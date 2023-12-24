class Building {
    constructor(id, config) {
        this.id = id;
        this.name = config.name;
        this._unnerfedBaseCost = config.baseCost;
        this._unnerfedScaling = config.baseScaling;
        this._unnerfedBaseProduction = config.baseProduction;
        this._autoCost = config.autoCost;
    }

    // Returns the base cost of the building after nerfs.
    _baseCost() {
        const base = this._unnerfedBaseCost;
        return base;
    }

    // Returns the cost scaling of the building.
    _scaling() {
        const base = this._unnerfedScaling;
        return base;
    }

    // Returns the number of buildings owned by the player.
    owned() {
        return player.buildings[this.id].count;
    }

    // Returns the total cost needed to buy "count" extra buildings.
    _totalCost(count) {
        const priceStart = this._baseCost();
        const scaling = this._scaling();
        const owned = this.owned();
        // First building includes 1 free worker - requires special calculation
        if (this.id === 1) {
            if (owned === 0) {
                // Owning no workers and buying 0-1 worker: Free of charge
                if (count <= 1) {
                    return new Decimal(0);
                }
                // Owning no workers and buying 2+ workers: Subtract the free worker from calculation
                return Decimal.sumGeometricSeries(count - 1, priceStart, scaling, owned);
            }
            // Owning free workers - Subtract the free worker from calculation
            return Decimal.sumGeometricSeries(count, priceStart, scaling, owned - 1);
        }
        // Other buildings
        return Decimal.sumGeometricSeries(count, priceStart, scaling, owned);
    }

    // Returns the multiplier of production of the building.
    multiplier() {
        const apocalypseLevel = database.apocalypses.getApocalypseLevel();
        const multiplier = new Decimal(1)
            .times(database.upgrades.getUpgrade(1).appliedEffect())
            .times(database.upgrades.getUpgrade(3).appliedEffect())
            .times(database.upgrades.getUpgrade(5).appliedEffect())
            .times(database.upgrades.getUpgrade(7).appliedEffect())
            .times(database.upgrades.getUpgrade(10).appliedEffect())
            .times(this.id === 1 ? database.upgrades.getUpgrade(2).appliedEffect() : 1)
            .times(this.id === 2 ? database.upgrades.getUpgrade(4).appliedEffect() : 1)
            .times(this.id === 3 ? database.upgrades.getUpgrade(6).appliedEffect() : 1)
            .times(this.id === 4 ? database.upgrades.getUpgrade(8).appliedEffect() : 1)
            .times(this.id === 4 ? database.upgrades.getUpgrade(9).appliedEffect() : 1)
            .times(apocalypseLevel >= 1 ? 2 : 1)
            .times(database.spells.getSpell(1).appliedEffect());
        return multiplier;
    }

    // Returns the base production of the building after nerfs.
    baseProduction() {
        const base = this._unnerfedBaseProduction;
        return base;
    }

    // Returns the production rate for the building per second.
    production() {
        const baseProduction = this.baseProduction();
        const owned = this.owned();
        const multiplier = this.multiplier();

        return Decimal.times(baseProduction, owned).times(multiplier);
    }

    // Adds building to the player directly, without cost checking.
    _addBuilding(count) {
        player.buildings[this.id].count += count;
    }

    // Reset the building count (and automation settings)
    // resetAuto excludes resetting automation settings.
    _resetBuilding(resetAuto = false) {
        player.buildings[this.id].count = 0;
        if (resetAuto) {
            player.buildings[this.id].isAuto = false;
            player.buildings[this.id].isAutoUnlocked = false;
        }
    }

    // Return the cost for buildings based on the selected purchase mode.
    cost() {
        switch (database.buildings.currentMode()) {
            case database.constants.buyingMode.BUY1: return this._costForOne();
            case database.constants.buyingMode.BUY10: return this._costForTen();
            case database.constants.buyingMode.BUYMAX: return this._costForMax();
            case database.constants.buyingMode.BUYMAX10: return this._costForMax10();
        }
        return null;
    }

    // Return the cost for 1 building.
    _costForOne() {
        return this._totalCost(1);
    }

    // Return the cost for nearest 10 building.
    _costForTen() {
        return this._totalCost(10 - this.owned() % 10);
    }

    // Return the cost for X buildings, where X is the maximum amount of buildings the player can purchase.
    // If X = 0, returns the cost for 1 building instead.
    _costForMax() {
        const maxAffordable = this.maxAffordableAmount();
        if (maxAffordable <= 0) {
            return this._costForOne();
        }
        return this._totalCost(this.maxAffordableAmount());
    }

    // Return the cost for X buildings, where X is the maximum amount of buildings the player can purchase.
    // X = 10a + remainder.
    // If X = 0, returns the cost for nearest 10 building instead.
    _costForMax10() {
        const remainder = (10 - this.owned() % 10) % 10;
        const maxAffordable = Math.floor((this.maxAffordableAmount() - remainder) / 10) * 10 + remainder;
        if (maxAffordable <= 0) {
            return this._costForTen();
        }
        return this._totalCost(maxAffordable);
    }

    // Check if the player can purchase any building under the selected mode.
    // mode (optional): Specify the mode to check if the building is buyable.
    isBuyable(mode = null) {
        const buyingMode = mode ?? database.buildings.currentMode();

        switch (buyingMode) {
            case database.constants.buyingMode.BUY1:
            case database.constants.buyingMode.BUYMAX:
                return this._isBuyableToOne();
            case database.constants.buyingMode.BUY10:
            case database.constants.buyingMode.BUYMAX10:
                return this._isBuyableToTen();
        }
        return false;
    }

    // Check if the player can afford 1 building.
    _isBuyableToOne() {
        return database.money.get().gte(this._costForOne());
    }

    // Check if the player can afford nearest 10 buildings.
    _isBuyableToTen() {
        return database.money.get().gte(this._costForTen());
    }

    // Return the maximum number of buildings affordable, using binary search.
    maxAffordableAmount() {
        const money = database.money.get();
        if (!this._isBuyableToOne())
            return 0;
        const owned = this.owned();

        // The +1 and ceil is for extra buffer in case of off-by-one error, since I don't want to tackle them.
        // The reason for using +1 is that, the first worker is free and does not increase the scaling.
        const maxAmount = Math.ceil(database.constants.goal.div(this._baseCost()).log(this._scaling()) + 1);
        let min = 0, max = maxAmount - owned;
        while (min < max) {
            const mid = Math.floor(((min + 1) + max) / 2);
            const totalCost = this._totalCost(mid);
            if (money.gte(totalCost)) {
                min = mid;
            } else {
                max = mid - 1;
            }
        }
        // In the end, min and max should have the same value, so we can take either value.
        return min;
    }

    // Purchase buildings based on mode, if affordable.
    // mode (optional): Specify the mode to purchase the building.
    buy(mode = null) {
        const buyingMode = mode ?? database.buildings.currentMode();

        switch (buyingMode) {
            case database.constants.buyingMode.BUY1:
                this._buyOne();
                break;
            case database.constants.buyingMode.BUY10:
                this._buyToTen();
                break;
            case database.constants.buyingMode.BUYMAX:
                this._buyMax();
                break;
            case database.constants.buyingMode.BUYMAX10:
                this._buyMax10();
                break;
        }
    }

    // Purchase 1 building, if affordable.
    _buyOne() {
        const cost = this._costForOne();
        if (this._isBuyableToOne()) {
            database.money.sub(cost);
            this._addBuilding(1);
        }
    }

    // Purchase to nearest 10 buildings, if affordable.
    _buyToTen() {
        if (this._isBuyableToTen()) {
            const amount = 10 - this.owned() % 10;
            for (let i = 0; i < amount; i++) {
                this._buyOne();
            }
        }
    }

    // Purchase the maximum number of buildings affordable.
    _buyMax() {
        const maxAffordable = this.maxAffordableAmount();
        if (maxAffordable <= 0)
            return;
        const totalCost = this._costForMax();
        database.money.sub(totalCost);
        this._addBuilding(maxAffordable);
    }

    // Purchase the maximum number of buildings that is closest to multiples of 10.
    _buyMax10() {
        const remainder = (10 - this.owned() % 10) % 10;
        const maxAffordable = Math.floor((this.maxAffordableAmount() - remainder) / 10) * 10 + remainder;
        if (maxAffordable <= 0)
            return;
        const totalCost = this._costForMax10();
        database.money.sub(totalCost);
        this._addBuilding(maxAffordable);
    }

    // Check if autobuy is unlocked.
    isAutoUnlocked() {
        return player.buildings[this.id].isAutoUnlocked;
    }

    // Check the cost needed to unlock autobuy.
    getAutoCost() {
        const lv = database.apocalypses.getApocalypseLevel();
        if (lv >= 1) {
            return this._autoCost.a1;
        }
        return this._autoCost.a0;
    }

    // Check if the player can afford autobuy.
    canUnlockAuto() {
        return database.stats.maxMoneyThisApocalypse().gte(this.getAutoCost());
    }

    // Unlock autobuy, if affordable.
    unlockAuto() {
        if (this.canUnlockAuto()) {
            player.buildings[this.id].isAutoUnlocked = true;
        }
    }

    // Check if autobuy is on.
    isAuto() {
        return player.buildings[this.id].isAuto;
    }

    // Toggle autobuy.
    toggleAuto() {
        if (this.isAutoUnlocked()) {
            player.buildings[this.id].isAuto = !this.isAuto();
        }
    }

    // Get the current mode of autobuy.
    getAutoMode() {
        const id = player.buildings[this.id].autoMode;
        return database.buildings.buyingModes[id];
    }

    // Switch mode of autobuy.
    switchAutoMode() {
        player.buildings[this.id].autoMode++;
        player.buildings[this.id].autoMode %= database.buildings.buyingModes.length;
    }
}
