window.player = {
    money: new Decimal(0),
    buildings: [null, 0, 0, 0, 0, 0, 0, 0],
    upgradeBits: 0,
    maxMoney: new Decimal(0),

    apocalypseLevel: 0,

    guilds: {
        members: 0
    },

    lastTick: Date.now()
};