// Upgrade id starts from 1
database.upgrades = {
    // Helper method
    _getUpgrade2Multi(upgradeObject) {
        const level = database.apocalypses.getApocalypseLevel();
        if (level >= 1) {
            return upgradeObject._data.multiA1;
        }
        return upgradeObject._data.multiA0;
    },
    _data: [
        null,
        {
            name: "Workers 1",
            getDesc: () => "Increase production of all buildings based on total workers bought",
            cost: new Decimal("3e5"),
            defaultEffect: new Decimal(1),
            effect() {
                const totalCount = database.buildings.getBuilding(1).owned();
                return Decimal.pow(totalCount, 0.9).add(1);
            },
            effectPrefix: "×",
        },
        {
            name: "Workers 2",
            getDesc() {
                const multi = database.upgrades._getUpgrade2Multi(this);
                return `×${multi} production to workers per 10 workers bought`;
            },
            cost: new Decimal("7.77e7"),
            defaultEffect: new Decimal(1),
            effect() {
                const buildingCount = database.buildings.getBuilding(1).owned();
                const multi = database.upgrades._getUpgrade2Multi(this);
                return Decimal.pow(multi, Math.max(0, Math.floor(buildingCount / 10)));
            },
            effectPrefix: "×",
            _data: {
                multiA0: 2.5,
                multiA1: 1.6
            }
        },
        {
            name: "Farmers 1",
            getDesc: () => "Increase production of all buildings based on total farmers bought",
            cost: new Decimal("1e17"),
            defaultEffect: new Decimal(1),
            effect() {
                const totalCount = database.buildings.getBuilding(2).owned();
                return Decimal.pow(totalCount, 0.9).add(1);
            },
            effectPrefix: "×"
        },
        {
            name: "Farmers 2",
            getDesc() {
                const multi = database.upgrades._getUpgrade2Multi(this);
                return `×${multi} production to farmers per 10 farmers bought`;
            },
            cost: new Decimal("1e20"),
            defaultEffect: new Decimal(1),
            effect() {
                const buildingCount = database.buildings.getBuilding(2).owned();
                const multi = database.upgrades._getUpgrade2Multi(this);
                return Decimal.pow(multi, Math.max(0, Math.floor(buildingCount / 10)));
            },
            effectPrefix: "×",
            _data: {
                multiA0: 4,
                multiA1: 2.75
            }
        },
        {
            name: "Builders 1",
            getDesc: () => "Increase production of all buildings based on total builders bought",
            cost: new Decimal("1e33"),
            defaultEffect: new Decimal(1),
            effect() {
                const totalCount = database.buildings.getBuilding(3).owned();
                return Decimal.pow(totalCount, 0.9).add(1);
            },
            effectPrefix: "×"
        },
        {
            name: "Builders 2",
            getDesc() {
                const multi = database.upgrades._getUpgrade2Multi(this);
                return `×${multi} production to builders per 10 builders bought`;
            },
            cost: new Decimal("2e47"),
            defaultEffect: new Decimal(1),
            effect() {
                const buildingCount = database.buildings.getBuilding(3).owned();
                const multi = database.upgrades._getUpgrade2Multi(this);
                return Decimal.pow(multi, Math.max(0, Math.floor(buildingCount / 10)));
            },
            effectPrefix: "×",
            _data: {
                multiA0: 8,
                multiA1: 6.5
            }
        },
        {
            name: "Merchants 1",
            getDesc: () => "Increase production of all buildings based on total merchants bought",
            cost: new Decimal("1e180"),
            defaultEffect: new Decimal(1),
            effect() {
                const totalCount = database.buildings.getBuilding(4).owned();
                return Decimal.pow(totalCount, 0.9).add(1);
            },
            effectPrefix: "×"
        },
        {
            name: "Merchants 2",
            getDesc() {
                const multi = database.upgrades._getUpgrade2Multi(this);
                return `×${multi} production to merchants per 10 merchants bought`;
            },
            cost: new Decimal("1e235"),
            defaultEffect: new Decimal(1),
            effect() {
                const buildingCount = database.buildings.getBuilding(4).owned();
                const multi = database.upgrades._getUpgrade2Multi(this);
                return Decimal.pow(multi, Math.max(0, Math.floor(buildingCount / 10)));
            },
            effectPrefix: "×",
            _data: {
                multiA0: 12.5,
                multiA1: 10.5
            }
        },
        {
            name: "Merchants 3",
            getDesc: () => "×1e9 production to merchants",
            cost: new Decimal("1e310"),
            defaultEffect: new Decimal(1),
            effect() {
                return new Decimal("1e9");
            },
            effectPrefix: "×"
        },
        {
            name: "Coalesce",
            getDesc: () => "Increase production of all buildings based on total buildings bought",
            cost: new Decimal("1e620"),
            defaultEffect: new Decimal(1),
            effect() {
                const totalCount = database.buildings.totalCount();
                return Decimal.add(Decimal.pow(totalCount, 1.2), 1);
            },
            effectPrefix: "×"
        },
    ],
    reset() {
        player.upgradeBits = 0;
    },
    hasUpgrade(n) {
        return (player.upgradeBits & (2 ** (n - 1))) !== 0; // eslint-disable-line no-bitwise
    },
    totalPurchased() {
        let count = 0;
        for (let i = 1; i < this._data.length; i++) {
            if (this.hasUpgrade(i)) {
                count++;
            }
        }
        return count;
    },
    buyAll(deductCurrency = true) {
        this.all.map(x => x.buy(deductCurrency));
    },
    all: [],
    getUpgrade(n) {
        if (n < 0 || n > this._data.length) return null;
        return this.all[n - 1];
    }
};

// Populate the upgrades list
(function() {
    for (let i = 1; i < database.upgrades._data.length; i++) {
        database.upgrades.all.push(
            new Upgrade(id = i, config = database.upgrades._data[i])
        );
    }
}());