// Building id starts from 1 
database.buildings = {
    _data: [
        null, 
        {
            name: "Workers",
            baseCost: new Decimal("2"),
            baseScaling: new Decimal("1.15"),
            baseProduction: new Decimal("1"),
            autoCost: {
                a0: new Decimal("1e12"),
                a1: new Decimal("1e8"),
            }
        }, 
        {
            name: "Farmers",
            baseCost: new Decimal("1e3"),
            baseScaling: new Decimal("1.2"),
            baseProduction: new Decimal("500"),
            autoCost: {
                a0: new Decimal("1e40"),
                a1: new Decimal("1e13")
            }
        },
        {
            name: "Builders",
            baseCost: new Decimal("1e12"),
            baseScaling: new Decimal("1.25"),
            baseProduction: new Decimal("1e12"),
            autoCost: {
                a0: new Decimal("1e100"),
                a1: new Decimal("1e30")
            }
        },  
        {
            name: "Merchants",
            baseCost: new Decimal("1e40"),
            baseScaling: new Decimal("1.3"),
            baseProduction: new Decimal("1e36"),
            autoCost: {
                a0: new Decimal("1e320"),
                a1: new Decimal("1e80")
            }
        },  
        // Priests, Bishops and Monarchs and will be unlocked later in the game
        // {
        //     name: "Priests",
        //     baseCost: new Decimal("1e1000"),
        //     baseScaling: new Decimal("1.35"),
        //     baseProduction: new Decimal("1")
        // },  
        // {
        //     name: "Bishops",
        //     baseCost: new Decimal("1e1000"),
        //     baseScaling: new Decimal("1.4"),
        //     baseProduction: new Decimal("1")
        // },  
        // {
        //     name: "Monarchs",
        //     baseCost: new Decimal("1e1000"),
        //     baseScaling: new Decimal("1.5"),
        //     baseProduction: new Decimal("1")
        // }
    ],
    totalCount() {
        return this.all.map(building => building.owned()).reduce((a, b) => a + b, 0);
    },
    // To be initialized automatically
    all: [],
    maxAll() {
        for (const building of this.all) {
            building._buyMax();
        }
    },
    reset(resetAuto) {
        for (const building of this.all) {
            building._resetBuilding(resetAuto);
        }
    },
    getBuilding(id) {
        if (id <= 0 || id >= this._data.length) return null;
        return this.all[id - 1];
    },
    buyingModes: [
        database.constants.buyingMode.BUY1, 
        database.constants.buyingMode.BUY10,
        database.constants.buyingMode.BUYMAX,
        database.constants.buyingMode.BUYMAX10
    ],
    currentMode() {
        return this.buyingModes[player.settings.buildingBuyMode];
    },
    modeName(name = null) {
        switch (name ?? database.buildings.currentMode()) {
            case database.constants.buyingMode.BUY1: return "Buy 1";
            case database.constants.buyingMode.BUY10: return "Buy to next 10";
            case database.constants.buyingMode.BUYMAX: return "Buy max";
            case database.constants.buyingMode.BUYMAX10: return "Buy max 10";
        }
        return null;
    },
    switchMode() {
        player.settings.buildingBuyMode = (player.settings.buildingBuyMode + 1) % this.buyingModes.length;
    }
};

// Populate the buildings list
(function() {
    for (let i = 1; i < database.buildings._data.length; i++) {
        database.buildings.all.push(
            new Building(id = i, config = database.buildings._data[i])
        );
    }
}());