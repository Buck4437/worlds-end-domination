function gameloop() {
    const dt = (Date.now() - player.lastTick) / 1000;
    player.lastTick = Date.now();

    if (dt < 0) return;

    // Auto generate mana
    if (database.manaShop.hasUpgrade(2) && database.spells.getMana().lt(500)) {
        const rate = Decimal.times(database.spells.getSpell(2).appliedEffect(), 5).times(dt);
        database.spells.setMana(Decimal.min(player.spells.mana.add(rate), 500));
    }

    if (database.manaShop.hasUpgrade(3) && database.spells.getMana().lt(10000)) {
        const rate = Decimal.times(database.spells.getSpell(2).appliedEffect(), 100).times(dt);
        database.spells.setMana(Decimal.min(player.spells.mana.add(rate), 10000));
    }

    // Automation

    if (database.manaShop.hasUpgrade(4)) {
        database.upgrades.buyAll(deductCurrency = false);
    }

    // Autobuy buildings: The priority is from high to low.
    for (const building of [...database.buildings.all].reverse()) {
        if (building.isAuto()) {
            building.buy(mode = building.getAutoMode());
        }
    }

    // Activate auto spells
    for (const spell of database.spells.all) {
        spell.tickTimer(dt);
        if (spell.getTimer() === 0) {
            if (spell.isAuto()) {
                spell.activate();
            }
        }
    }

    // Refresh player cooldowns
    player.spells.convertCooldown = Math.max(player.spells.convertCooldown - dt, 0);

    for (const building of database.buildings.all) {
        const production = building.production();
        const newMoney = database.money.get().add(production.times(dt));

        // Prevent player from getting more than the max amount of money.
        database.money.set(Decimal.min(newMoney, database.constants.goal));
        database.stats.updateMaxMoney();
    }

    // Update display unlocks

    if (!player.display.spells) {
        if (database.apocalypses.getApocalypseLevel() >= 1 && player.spells.mana.gte(1)) {
            player.display.spells = true;
        }
    }
}
