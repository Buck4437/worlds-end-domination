function gameloop() {
    const dt = (Date.now() - player.lastTick) / 1000;
    player.lastTick = Date.now();

    if (dt < 0) return;

    // Auto generate mana
    if (database.manaShop.hasUpgrade(1) && database.spells.getMana().lt(100)) {
        database.spells.setMana(Decimal.min(player.spells.mana.add(dt * 5), 100));
    }

    if (database.manaShop.hasUpgrade(2) && database.spells.getMana().lt(10000)) {
        database.spells.setMana(Decimal.min(player.spells.mana.add(dt * 500), 10000));
    }

    // Automation

    if (database.manaShop.hasUpgrade(3)) {
        database.upgrades.buyAll(deductCurrency = false);
    }

    // Autobuy buildings: The priority is from high to low.
    for (const building of database.buildings.all().reverse()) {
        if (building.isAuto()) {
            database.buildings.currentMode().buy(building);
        }
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
        const newMoney = database.player.getMoney().add(production.times(dt));

        // Prevent player from getting more than the max amount of money.
        database.player.setMoney(Decimal.min(newMoney, database.constants.goal));
        database.player.updateMaxMoney();
    }
}
