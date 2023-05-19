database.apocalypses = {
    _data: [
        {
            level: 1,
            text: {
                name: "(Placeholder)",
                nerfs: [
                    "Workers 2 upgrade multiplier 2.5 -> 1.5",
                    "Farmers 2 upgrade multiplier 4 -> 3",
                    "Builders 2 upgrade multiplier 8 -> 6",
                    "Merchants 2 upgrade multiplier 12.5 -> 10"
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
                name: "2nd",
                nerfs: [
                    "Placeholder",
                ],
                buffs: [
                    "Unlock Spell 3 and 4",
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
                database.buildings.reset();
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