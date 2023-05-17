window.player = {
    money: new Decimal(0),
    maxMoney: new Decimal(0),
    buildings: [null, 0, 0, 0, 0, 0, 0, 0],
    upgradeBits: 0,

    apocalypseLevel: 0,
    spells: {
        mana: new Decimal(0),
        spells: [
            null,
            {
                activated: false
            }
        ]
    },

    lastTick: Date.now()
};
