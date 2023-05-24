window.player = {
    money: new Decimal(0),
    buildings: [null],
    upgradeBits: 0,

    apocalypseLevel: 0,
    spells: {
        mana: new Decimal(0),
        convertCooldown: 0,
        spells: [
            null,
            {
                auto: false,
                level: 1,
                timer: 0
            },
            {
                auto: false,
                level: 1,
                timer: 0
            },
            {
                auto: false,
                level: 1,
                timer: 0
            },
            {
                auto: false,
                level: 1,
                timer: 0
            },
            {
                auto: false,
                level: 1,
                timer: 0
            }
        ],
        upgradeBits: 0
    },
    
    stats: {
        maxMoney: {
            thisApocalypse: new Decimal(0),
            thisReset: new Decimal(0),
        }
    },

    settings: {
        buildingBuyMode: 0
    },
    lastTick: Date.now()
};

// Initialize player object
(function() {
    for (let i = 0; i < database.buildings.all.length; i++) {
        player.buildings.push({
            count: 0,
            isAutoUnlocked: false,
            auto: false
        });
    }
}());