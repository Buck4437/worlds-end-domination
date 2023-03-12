// n represents number of buildings currently owned by the player
// Production is in Money / second
// Upgrade id starts from 1
database.upgrades = {
    data: [
        null,
        {
            name: "Worker's Union",
            desc: "×2 production per 20 workers bought",
            cost: new Decimal(1e4),
            defaultEffect: new Decimal(1),
            effect() {
                const buildingCount = player.buildings[1];
                return Decimal.pow(2, Math.max(0, Math.floor(buildingCount / 20)))
            },
            effectPrefix: "×"
        }
    ],
    hasUpgrade(n) {
        return player.upgradeBits & (2 ** (n - 1)) != 0;
    },
    all() {
        const upgrades = []
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
            hasEffect: upgrade.effect !== undefined,
        }

        if (upgradeObject.hasEffect) {
            upgradeObject.effect = upgrade.effect;
            upgradeObject.effectPrefix = upgrade.effectPrefix
            upgradeObject.apply = () => {
                return this.hasUpgrade(n) ? upgrade.effect() : upgrade.defaultEffect;
            }
        }

        return upgradeObject;
    }
}

// Workers, Farmers, Builders, Merchants, Priests, Monarchs