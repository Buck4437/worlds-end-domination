function gameloop() {
    const dt = (Date.now() - player.lastTick) / 1000;
    player.lastTick = Date.now();

    if (dt < 0) return;

    // Drain mana
    // I should make it a fixed investment instead.
    for (const spell of database.spells.all()) {
        spell.tickTimer(dt);
        if (spell.getTimer() === 0) {
            if (spell.isAuto()) {
                spell.activate();
            }
        }
    }

    for (const building of database.buildings.all()) {
        const production = building.production();
        const newMoney = player.money.add(production.times(dt));

        // Prevent player from getting more than the max amount of money.
        player.money = Decimal.min(newMoney, database.constants.goal);
        player.maxMoney = Decimal.max(player.money, player.maxMoney);
    }
}
