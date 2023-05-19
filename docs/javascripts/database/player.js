database.player = {
    reset() {
        player.money = new Decimal(0);
        player.maxMoney = new Decimal(0);
    },
    getMoney() {
        return player.money;
    },
    addMoney(n) {
        player.money = player.money.add(n);
    },
    subMoney(n) {
        player.money = player.money.sub(n);
    },
    setMoney(n) {
        player.money = new Decimal(n);
    },
    updateMaxMoney() {
        player.maxMoney = Decimal.max(this.getMoney(), player.maxMoney);
    }
};