import database from "database";

const apocalypses = function(player) {
    return {
        _data: [
            {
                level: 1,
                text: {
                    name: "(Placeholder)",
                    nerfs: [
                        "2.5 => 1.5, 4 => 3, 8 => 6, 12.5 => 10 "
                    ],
                    buffs: [
                        "Unlock BLOBMEGATHINK",
                        "x2 production to all buildings"
                    ]
                }
            },
            {
                level: 2,
                text: {
                    name: "2nd",
                    nerfs: "Placeholder 2",
                    buffs: "Unlock BLLLLLLLLLLLLLOB"
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
                    database.buildings(player).reset();
                    database.upgrades(player).reset();

                    player.money = new Decimal(0);
                    player.maxMoney = new Decimal(0);
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
};

export default apocalypses;