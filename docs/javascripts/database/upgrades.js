// Upgrade id starts from 1
database.upgrades = {
    _CONSTANTS: {
        EFFECT: 0,
        UNLOCK: 1
    },
    data: [
        null,
        {
            name: "Workers 1",
            type: database.constants.upgradeType.EFFECT,
            desc: "Increase production of all buildings based on total workers bought",
            cost: new Decimal("3e5"),
            defaultEffect: new Decimal(1),
            effect() {
                const totalCount = database.buildings.getBuilding(1).owned();
                return Decimal.pow(totalCount, 0.9).add(1);
            },
            effectPrefix: "×"
        },
        {
            name: "Workers 2",
            type: database.constants.upgradeType.EFFECT,
            desc: "×2.5 production to workers per 10 workers bought",
            cost: new Decimal("7.77e7"),
            defaultEffect: new Decimal(1),
            effect() {
                const buildingCount = database.buildings.getBuilding(1).owned();
                return Decimal.pow(2.5, Math.max(0, Math.floor(buildingCount / 10)));
            },
            effectPrefix: "×"
        },
        {
            name: "Farmers 1",
            type: database.constants.upgradeType.EFFECT,
            desc: "Increase production of all buildings based on total farmers bought",
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
            desc: "×4 production to farmers per 10 farmers bought",
            cost: new Decimal("1e20"),
            defaultEffect: new Decimal(1),
            effect() {
                const buildingCount = database.buildings.getBuilding(2).owned();
                return Decimal.pow(4, Math.max(0, Math.floor(buildingCount / 10)));
            },
            effectPrefix: "×"
        },
        {
            name: "Builders 1",
            type: database.constants.upgradeType.EFFECT,
            desc: "Increase production of all buildings based on total builders bought",
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
            desc: "×8 production to builders per 10 builders bought",
            cost: new Decimal("1e54"),
            defaultEffect: new Decimal(1),
            effect() {
                const buildingCount = database.buildings.getBuilding(3).owned();
                return Decimal.pow(8, Math.max(0, Math.floor(buildingCount / 10)));
            },
            effectPrefix: "×"
        },
        {
            name: "Merchants 1",
            type: database.constants.upgradeType.EFFECT,
            desc: "Increase production of all buildings based on total merchants bought",
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
            desc: "×12.5 production to merchants per 10 merchants bought",
            cost: new Decimal("1e235"),
            defaultEffect: new Decimal(1),
            effect() {
                const buildingCount = database.buildings.getBuilding(4).owned();
                return Decimal.pow(12.5, Math.max(0, Math.floor(buildingCount / 10)));
            },
            effectPrefix: "×"
        },
        {
            name: "Coalesce",
            type: database.constants.upgradeType.EFFECT,
            desc: "Increase production of all buildings based on total buildings bought",
            cost: new Decimal("1e620"),
            defaultEffect: new Decimal(1),
            effect() {
                const totalCount = database.buildings.totalCount();
                return Decimal.add(Decimal.pow(totalCount, 1.2), 1);
            },
            effectPrefix: "×"
        },
    ],
    hasUpgrade(n) {
        return (player.upgradeBits & (2 ** (n - 1))) !== 0; // eslint-disable-line no-bitwise
    },
    isBuyable(n) {
        return player.money.gte(this.getUpgrade(n).cost);
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
            desc: upgrade.desc,
            cost: upgrade.cost,
            type: upgrade.type
        };

        if (upgradeObject.type === database.constants.upgradeType.EFFECT) {
            upgradeObject.effect = upgrade.effect;
            upgradeObject.effectPrefix = upgrade.effectPrefix;
            upgradeObject.apply = () => (this.hasUpgrade(n) ? upgrade.effect() : upgrade.defaultEffect);
        }

        return upgradeObject;
    }
};
