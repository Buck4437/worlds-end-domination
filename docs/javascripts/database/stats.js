database.stats = {
    manaReset() {
        player.stats.maxMoney.thisReset = new Decimal(0);
    },
    apocalypseReset() {
        this.manaReset();
        player.stats.maxMoney.thisApocalypse = new Decimal(0);
    },
    updateMaxMoney() {
        const money = database.money.get();
        player.stats.maxMoney.thisReset = Decimal.max(money, player.stats.maxMoney.thisReset);
        player.stats.maxMoney.thisApocalypse = Decimal.max(money, player.stats.maxMoney.thisApocalypse);
    },
    maxMoneyThisApocalypse() {
        return player.stats.maxMoney.thisApocalypse;
    },
    maxMoneyThisReset() {
        return player.stats.maxMoney.thisReset;
    }
};