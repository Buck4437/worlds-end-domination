database.apocalypses = {
    _data: [
        {
            level: 1,
            text: {
                name: "1st",
                nerfs: "Placeholder",
                buffs: "Unlock BLOBMEGATHINK"
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
                database.buildings.reset();
                database.upgrades.reset();

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