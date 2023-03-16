// Building id starts from 1 
database.buildings = {
    data: [
        null, 
        {
            name: "Workers",
            baseCost: new Decimal("2"),
            baseScaling: new Decimal("1.15"),
            baseProduction: new Decimal("1")
        }, 
        {
            name: "Farmers",
            baseCost: new Decimal("1e3"),
            baseScaling: new Decimal("1.2"),
            baseProduction: new Decimal("500")
        },
        {
            name: "Builders",
            baseCost: new Decimal("1e12"),
            baseScaling: new Decimal("1.25"),
            baseProduction: new Decimal("1e12")
        },  
        {
            name: "Merchants",
            baseCost: new Decimal("1e40"),
            baseScaling: new Decimal("1.3"),
            baseProduction: new Decimal("1e45")
        },  
        // Priests, Bishops and Monarchs and will be unlocked later in the game
        // {
        //     name: "Priests",
        //     baseCost: new Decimal("1e3"),
        //     baseScaling: new Decimal("1.35"),
        //     baseProduction: new Decimal("1000")
        // },  
        // {
        //     name: "Bishops",
        //     baseCost: new Decimal("1e3"),
        //     baseScaling: new Decimal("1.4"),
        //     baseProduction: new Decimal("1000")
        // },  
        // {
        //     name: "Monarchs",
        //     baseCost: new Decimal("1e999"),
        //     baseScaling: new Decimal("1.5"),
        //     baseProduction: new Decimal("1000")
        // }
    ],
    totalCount() {
        return this.all().map(building => building.owned()).reduce((a, b) => a + b, 0);
    },
    all() {
        const buildings = [];
        for (let i = 1; i < this.data.length; i++) {
            buildings.push(this.getBuilding(i));
        }
        return buildings;
    },
    getBuilding(id) {
        if (id <= 0 || id >= this.data.length) return null;
        const building = this.data[id];

        return {
            id,
            name: building.name,
            // Returns the base cost of the building.
            _baseCost() {
                const base = building.baseCost;
                return base;
            },
            // Returns the cost scaling of the building.
            _scaling() {
                const base = building.baseScaling;
                return base;
            },
            // Returns the total cost needed to buy "count" extra buildings.
            _totalCost(count) {
                const priceStart = this._baseCost();
                const scaling = this._scaling();
                const owned = this.owned();
                // No workers bought - includes 1 free worker in the calculations
                if (this.id === 1 && owned === 0) {
                    // Buying 1 or less workers: Free of charge
                    if (count <= 1) {
                        return new Decimal(0);
                    }
                    // Buying 2+ workers: Subtract the free worker from calculation
                    return Decimal.sumGeometricSeries(count - 1, priceStart, scaling, owned);
                }
                // No free workers
                return Decimal.sumGeometricSeries(count, priceStart, scaling, owned);
            },
            // Returns the cost if the player has owned n buildings.
            _costFor(n) {
                const baseCost = this._baseCost();
                const scaling = this._scaling();
                if (this.id === 1) {
                    // Includes 1 free worker in the calculations
                    if (n === 0) {
                        return new Decimal(0);
                    }
                    return baseCost.times(scaling.pow(n - 1));
                }
                return baseCost.times(scaling.pow(n));
            },
            // Returns the number of buildings owned by the player.
            owned() {
                return player.buildings[this.id];
            },
            // Returns the cost for the next building.
            cost() {
                return this._costFor(this.owned());
            },
            isBuyable() {
                return player.money.gte(this.cost());
            },
            multiplier() {
                const multiplier = new Decimal(1)
                    .times(database.upgrades.getUpgrade(1).apply())
                    .times(database.upgrades.getUpgrade(3).apply())
                    .times(database.upgrades.getUpgrade(5).apply())
                    .times(database.upgrades.getUpgrade(7).apply())
                    .times(database.upgrades.getUpgrade(9).apply())
                    .times(this.id === 1 ? database.upgrades.getUpgrade(2).apply() : 1)
                    .times(this.id === 2 ? database.upgrades.getUpgrade(4).apply() : 1)
                    .times(this.id === 3 ? database.upgrades.getUpgrade(6).apply() : 1)
                    .times(this.id === 4 ? database.upgrades.getUpgrade(8).apply() : 1);
                return multiplier;
            }, 
            // Returns the production rate for the buildings per second.
            production() {
                const baseProduction = building.baseProduction;
                const owned = new Decimal(this.owned());
                const multiplier = this.multiplier();
                return baseProduction.times(owned).times(multiplier);
            },
            // Adds building to the player directly, without cost checking.
            _addBuilding(count) {
                player.buildings.splice(this.id, 1, this.owned() + count);
            },
            // Purchase the next building, if affordable.
            buy() {
                const cost = this.cost();
                if (player.money.gte(cost)) {
                    player.money = player.money.sub(cost);
                    this._addBuilding(1);
                }
            },
            // Purchase the maximum number of buildings affordable.
            buyMax() {
                const money = player.money;
                if (money.lt(this.cost())) return;
                const owned = this.owned();
                // The +1 is for extra buffer in case of off-by-one error, since I don't want to tackle them.
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
                const totalCost = this._totalCost(min);
                player.money = player.money.sub(totalCost);
                this._addBuilding(min);
            }
        };
    }
};
