database.guilds = {
    _data: {
        getBaseRequirement: () => new Decimal(1e8),
        getScaling: () => new Decimal(10),
        getEffect: () => new Decimal(4),
    },
    getNextRequirement() {
        const amount = player.guilds.members;
        const baseReq = this._data.getBaseRequirement();
        const scale = this._data.getScaling();
        return baseReq.times(scale.pow(amount));
    },
    canReset() {
        return player.money.gte(this.getNextRequirement());
    },
    reset() {
        if (this.canReset()) {
            player.money = new Decimal(0);
            database.buildings.reset();
            database.upgrades.reset();

            player.guilds.members++;
        }
    }
};