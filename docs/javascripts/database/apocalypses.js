database.apocalypses = {
    _data: [
        {
            level: 1,
            text: {
                name: "Domination",
                nerfs: [
                    "Workers 2 upgrade multiplier x2.5 -> x1.6",
                    "Farmers 2 upgrade multiplier x4 -> x2.75",
                    "Builders 2 upgrade multiplier x8 -> x6.5",
                    "Merchants 2 upgrade multiplier x12.5 -> x10.5"
                ],
                buffs: [
                    "Unlock Spells",
                    "Unlock Mana Shop",
                    "Unlock Automation",
                    "x2 production to all buildings"
                ]
            }
        },
        {
            level: 2,
            text: {
                name: "(Placeholder 2)",
                nerfs: [
                    "To be determined",
                ],
                buffs: [
                    "Unlock Spell 4-5",
                    "Unlock Upgrade 4 to 7?",
                    "Coming soon",
                ]
            }
        }
    ],
    canApocalypse() {
        return player.maxMoney.gte(database.constants.goal);
    },
    performApocalypse() {
        if (this.canApocalypse()) {
            const confirmed = confirm("Do you want to proceed?");
            if (confirmed) {
                database.player.reset();
                database.buildings.reset(resetAuto = true);
                database.upgrades.reset();
                player.apocalypseLevel += 1;
            }
        }
    },
    getApocalypseLevel() {
        return player.apocalypseLevel;
    },
    all() {
        return this._data;
    }
};