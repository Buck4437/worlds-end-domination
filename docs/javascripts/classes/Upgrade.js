class Upgrade {

    constructor(id, config) {
        this.id = id;
        this.name = config.name;
        this.cost = config.cost;
        this.effectPrefix = config.effectPrefix;
        this.defaultEffect = config.defaultEffect;
        this.effect = function() {
            return config.effect();
        };
        this.getDesc = function() {
            return config.getDesc();
        };
    }

    // Check if an upgrade can be purchased.
    isBuyable() {
        return !database.upgrades.hasUpgrade(this.id) && database.money.get().gte(this.cost);
    }

    // Purchase an upgrade, if affordable.
    buy(deductCurrency = true) {
        if (this.isBuyable()) {
            if (deductCurrency) {
                database.money.sub(this.cost);
            }
            player.upgradeBits |= 2 ** (this.id - 1); // eslint-disable-line no-bitwise
        }
    }
    
    // Return the effect of an upgrade if it is purchased, and return default effect if it is not purchased.
    appliedEffect() {
        return database.upgrades.hasUpgrade(this.id) ? this.effect() : this.defaultEffect;
    }
}
