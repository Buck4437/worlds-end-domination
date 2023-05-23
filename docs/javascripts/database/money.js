database.money = {
    reset() {
        player.money = new Decimal(0);
    },
    get() {
        return player.money;
    },
    add(n) {
        player.money = player.money.add(n);
    },
    sub(n) {
        player.money = player.money.sub(n);
    },
    set(n) {
        player.money = new Decimal(n);
    }
};