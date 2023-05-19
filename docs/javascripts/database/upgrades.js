// Upgrade id starts from 1
database.upgrades = {
    _CONSTANTS: {
        EFFECT: 0,
        UNLOCK: 1
    },
    // Helper method
    _getUpgrade2Multi(upgradeObject) {
        const level = database.apocalypses.getApocalypseLevel();
        if (level >= 1) {
            return upgradeObject._data.multiA1;
        }
        return upgradeObject._data.multiA0;
    },
    data: [
        null,
        {
            name: "Workers 1",
            type: database.constants.upgradeType.EFFECT,
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
            type: database.constants.upgradeType.EFFECT,
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
            type: database.constants.upgradeType.EFFECT,
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
            type: database.constants.upgradeType.EFFECT,
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
                multiA1: 3
            }
        },
        {
            name: "Builders 1",
            type: database.constants.upgradeType.EFFECT,
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
            type: database.constants.upgradeType.EFFECT,
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
                multiA1: 6
            }
        },
        {
            name: "Merchants 1",
            type: database.constants.upgradeType.EFFECT,
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
            type: database.constants.upgradeType.EFFECT,
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
                multiA1: 10
            }
        },
        {
            name: "Merchants 3",
            type: database.constants.upgradeType.EFFECT,
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
            type: database.constants.upgradeType.EFFECT,
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
        for (let i = 1; i < this.data.length; i++) {
            if (this.hasUpgrade(i)) {
                count++;
            }
        }
        return count;
    },
    buyAll(deductCurrency = true) {
        this.all().map(x => x.buy(deductCurrency));
    },
    all() {
        const upgrades = [];
        for (let i = 1; i < this.data.length; i++) {
            upgrades.push(this.getUpgrade(i));
        }
        return upgrades;
    },
    getUpgrade(n) {
        if (n < 0 || n > this.data.length) return null;
        const upgrade = this.data[n];
        const upgradeObject = {
            id: n,
            name: upgrade.name,
            getDesc: upgrade.getDesc,
            cost: upgrade.cost,
            type: upgrade.type,
            isBuyable() {
                return !database.upgrades.hasUpgrade(this.id) && database.player.getMoney().gte(this.cost);
            },
            buy(deductCurrency = true) {
                if (this.isBuyable()) {
                    if (deductCurrency) {
                        database.player.subMoney(this.cost);
                    }
                    player.upgradeBits |= 2 ** (this.id - 1); // eslint-disable-line no-bitwise
                }
            }
        };

        if (upgradeObject.type === database.constants.upgradeType.EFFECT) {
            upgradeObject.effect = upgrade.effect;
            upgradeObject.effectPrefix = upgrade.effectPrefix;
            upgradeObject.apply = () => (this.hasUpgrade(n) ? upgrade.effect() : upgrade.defaultEffect);
        }

        if (upgrade._data !== undefined) {
            upgradeObject._data = upgrade._data;
        }

        return upgradeObject;
    }
};
