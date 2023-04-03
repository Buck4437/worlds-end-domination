import database from "database";

function gameloop(player) {
    const dt = Date.now() - player.lastTick;
    player.lastTick = Date.now();

    if (dt < 0) return;

    for (const building of database.buildings(player).all()) {
        const production = building.production();
        const newMoney = player.money.add(production.times(dt / 1000));
        // Prevent player from getting more than the max amount of money.
        player.money = Decimal.min(newMoney, database.constants.goal);
        player.maxMoney = Decimal.max(player.money, player.maxMoney);
    }
}

export default gameloop;