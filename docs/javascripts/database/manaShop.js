// Upgrade id starts from 1
database.manaShop = {
    _data: [
        null,
        {
            name: "Mana Surge",
            getDesc: () => "You can increase the level of spells",
            cost: new Decimal(150)
        },
        {
            name: "Mana Rift I",
            getDesc: () => "Passively generate 5 Mana per second, up to 500 Mana",
            cost: new Decimal(500)
        },
        {
            name: "Mana Rift II",
            getDesc: () => "Passively generate 100 Mana per second, up to 10000 Mana",
            cost: new Decimal(1e4)
        },
        {
            name: "Auto Upgrade",
            getDesc: () => "Automatically unlock upgrades once they are affordable, for free",
            cost: new Decimal(1e6)
        },
        {
            name: "Money Box I",
            getDesc: () => "Start with 100 money when you exchange for mana.",
            cost: new Decimal(300),
            purchaseCallBack() { database.money.set(Decimal.max(100, database.money.get())); }
        },
        // Upgrade 5-8 effect not added yet
        // {
        //     name: "Upgrade 5",
        //     getDesc: () => 
        //         "Start with 1e3 money when you exchange for mana." +
        //         " Note: make the priority of auto buy buildings high - low",
        //     cost: new Decimal(1e3)
        // },
        // {
        //     name: "Upgrade 6",
        //     getDesc: () => 
        //         "Start with 1e12 money when you exchange for mana.",
        //     cost: new Decimal(1e5)
        // },
        // {
        //     name: "Upgrade 7",
        //     getDesc: () => 
        //         "Start with 1e40 money when you exchange for mana.",
        //     cost: new Decimal(1e8)
        // },
        // {
        //     name: "Upgrade 8",
        //     getDesc: () => 
        //         "Multiply all buildings by x2 for each purchased building upgrades",
        //     cost: new Decimal(1e7),
        //     defaultEffect: new Decimal(1),
        //     effect() { return Decimal.pow(2, database.upgrades.totalPurchased()); },
        //     displayEffect: true,
        //     effectPrefix: "x",
        // }
    ],
    reset() {
        player.spells.upgradeBits = 0;
    },
    hasUpgrade(n) {
        return (player.spells.upgradeBits & (2 ** (n - 1))) !== 0; // eslint-disable-line no-bitwise
    },
    all() {
        const upgrades = [];
        for (let i = 1; i < this._data.length; i++) {
            upgrades.push(this.getUpgrade(i));
        }
        return upgrades;
    },
    getUpgrade(n) {
        if (n < 0 || n > this._data.length) return null;
        const upgrade = this._data[n];
        const upgradeObject = {
            id: n,
            name: upgrade.name,
            getDesc: () => upgrade.getDesc(),
            getCost: () => upgrade.cost,
            isBuyable() { return !database.manaShop.hasUpgrade(this.id) && player.spells.mana.gte(this.getCost()); },
            buy() {
                if (this.isBuyable()) {
                    player.spells.mana = player.spells.mana.sub(this.getCost());
                    player.spells.upgradeBits |= 2 ** (this.id - 1); // eslint-disable-line no-bitwise
                }
                upgrade.purchaseCallBack?.();
            },
            defaultEffect: upgrade.defaultEffect ?? null,
            effect() { return upgrade?.effect() ?? null; },
            displayEffect: upgrade.displayEffect ?? false,
            effectPrefix: upgrade.displayEffect ?? null,
            appliedEffect() { return this.isActivated() ? this.getEffect() : this.defaultEffect; },
        };

        return upgradeObject;
    }
};
