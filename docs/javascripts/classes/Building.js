function Building(id, config) {
    this.id = id;
    this.name = config.name;
    this._unnerfedBaseCost = config.baseCost;
    this._unnerfedScaling = config.baseScaling;
    this._unnerfedBaseProduction = config.baseProduction;
    this._autoCost = config.autoCost;
}

// Returns the base cost of the building after nerfs.
Building.prototype._baseCost = function() {
    const base = this._unnerfedBaseCost;
    return base;
};

// Returns the cost scaling of the building.
Building.prototype._scaling = function() {
    const base = this._unnerfedScaling;
    return base;
};

// Returns the number of buildings owned by the player.
Building.prototype.owned = function() {
    return player.buildings[this.id].count;
};

// Returns the total cost needed to buy "count" extra buildings.
Building.prototype._totalCost = function(count) {
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
};

// Returns the multiplier of production of the building.
Building.prototype.multiplier = function() {
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
        .times(database.spells.getSpell(1).appliedEffect())
        .times(database.spells.getSpell(4).appliedEffect())
        .times(database.spells.getSpell(5).appliedEffect());
    return multiplier;
};

// Returns the base production of the building after nerfs.
Building.prototype.baseProduction = function() {
    const base = this._unnerfedBaseProduction;
    return base;
};

// Returns the production rate for the building per second.
Building.prototype.production = function() {
    const baseProduction = this.baseProduction();
    const owned = this.owned();
    const multiplier = this.multiplier();

    return Decimal.times(baseProduction, owned).times(multiplier);
};

// Adds building to the player directly, without cost checking.
Building.prototype._addBuilding = function(count) {
    player.buildings[this.id].count += count;
};

// Reset the building count (and automation settings)
// resetAuto excludes resetting automation settings.
Building.prototype._resetBuilding = function(resetAuto = false) {
    player.buildings[this.id].count = 0;
    if (resetAuto) {
        player.buildings[this.id].isAuto = false;
        player.buildings[this.id].isAutoUnlocked = false;
    }
};

// Return the cost for buildings based on the selected purchase mode.
Building.prototype.cost = function() {
    switch (database.buildings.currentMode()) {
        case database.constants.buyingMode.BUY1: return this._costForOne();
        case database.constants.buyingMode.BUY10: return this._costForTen();
        case database.constants.buyingMode.BUYMAX: return this._costForMax();
    }
    return null;
};

// Return the cost for 1 building.
Building.prototype._costForOne = function() { 
    return this._totalCost(1); 
};

// Return the cost for nearest 10 building.
Building.prototype._costForTen = function() { 
    return this._totalCost(10 - this.owned() % 10); 
};

// Return the cost for X buildings, where X is the maximum amount of buildings the player can purchase.
// If X = 0, returns the cost for 1 building instead.
Building.prototype._costForMax = function() { 
    const maxAffordable = this.maxAffordableAmount();
    if (maxAffordable <= 0) {
        return this._costForOne();
    }
    return this._totalCost(this.maxAffordableAmount()); 
};

// Check if the player can purchase any building under the selected mode.
Building.prototype.isBuyable = function() {
    switch (database.buildings.currentMode()) {
        case database.constants.buyingMode.BUY1:
        case database.constants.buyingMode.BUYMAX: 
            return this._isBuyableToOne();
        case database.constants.buyingMode.BUY10: 
            return this._isBuyableToTen();
    }
    return false;
};

// Check if the player can afford 1 building.
Building.prototype._isBuyableToOne = function() {
    return database.player.getMoney().gte(this._costForOne()); 
};

// Check if the player can afford nearest 10 buildings.
Building.prototype._isBuyableToTen = function() { 
    return database.player.getMoney().gte(this._costForTen()); 
};

// Return the maximum number of buildings affordable, using binary search.
Building.prototype.maxAffordableAmount = function() {
    const money = database.player.getMoney();
    if (!this._isBuyableToOne()) return 0;
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
};

// Purchase buildings based on mode, if affordable.
Building.prototype.buy = function() {
    switch (database.buildings.currentMode()) {
        case database.constants.buyingMode.BUY1:
            this._buyOne();
            break;
        case database.constants.buyingMode.BUY10:
            this._buyToTen();
            break;
        case database.constants.buyingMode.BUYMAX:
            this._buyMax();
            break;
    }
};

// Purchase 1 building, if affordable.
Building.prototype._buyOne = function() {
    const cost = this._costForOne();
    if (this._isBuyableToOne()) {
        database.player.subMoney(cost);
        this._addBuilding(1);
    }
};

// Purchase to nearest 10 buildings, if affordable.
Building.prototype._buyToTen = function() {
    if (this._isBuyableToTen()) {
        const amount = 10 - this.owned() % 10;
        for (let i = 0; i < amount; i++) {
            this._buyOne();
        }   
    }
};

// Purchase the maximum number of buildings affordable.
Building.prototype._buyMax = function() {
    const maxAffordable = this.maxAffordableAmount();
    if (maxAffordable <= 0) return;
    const totalCost = this._costForMax();
    database.player.subMoney(totalCost);
    this._addBuilding(maxAffordable);
};

// Check if autobuy is unlocked.
Building.prototype.isAutoUnlocked = function() { 
    return player.buildings[this.id].isAutoUnlocked; 
};

// Check the cost needed to unlock autobuy.
Building.prototype.getAutoCost = function() { 
    return this._autoCost; 
};

// Check if the player can afford autobuy.
Building.prototype.canUnlockAuto = function() { 
    return database.player.getMoney().gte(this.getAutoCost()); 
};

// Unlock autobuy, if affordable.
Building.prototype.unlockAuto = function() { 
    if (this.canUnlockAuto()) {
        player.buildings[this.id].isAutoUnlocked = true;
        database.player.subMoney(this.getAutoCost());
    } 
};

// Check if autobuy is on.
Building.prototype.isAuto = function() {
    return player.buildings[this.id].isAuto;
};

// Toggle autobuy.
Building.prototype.toggleAuto = function() { 
    if (this.isAutoUnlocked()) {
        player.buildings[this.id].isAuto = !this.isAuto(); 
    }
};
