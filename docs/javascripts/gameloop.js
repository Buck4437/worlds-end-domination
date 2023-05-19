function gameloop() {
    const dt = (Date.now() - player.lastTick) / 1000;
    player.lastTick = Date.now();

    if (dt < 0) return;

    // Auto generate mana
    if (database.manaShop.hasUpgrade(1) && player.spells.mana.lt(10)) {
        player.spells.mana = Decimal.min(player.spells.mana.add(dt), 10);
    }

    if (database.manaShop.hasUpgrade(2) && player.spells.mana.lt(1000)) {
        player.spells.mana = Decimal.min(player.spells.mana.add(dt * 50), 1000);
    }

    // Automation

    if (database.manaShop.hasUpgrade(3)) {
        database.upgrades.buyAll(deductCurrency = false);
    }

    // Activate auto spells
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
