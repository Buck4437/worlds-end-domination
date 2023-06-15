window.player = {
    money: new Decimal(0),
    buildings: [null],
    upgradeBits: 0,

    apocalypseLevel: 0,
    spells: {
        mana: new Decimal(0),
        convertCooldown: 0,
        spells: [null],
        upgradeBits: 0
    },

    display: {
        spells: false
    },
    
    stats: {
        maxMoney: {
            thisApocalypse: new Decimal(0),
            thisReset: new Decimal(0),
        }
    },

    settings: {
        buildingBuyMode: 0,
        manaConfirmation: true
    },

    saveVersion: 1,
    lastTick: Date.now()
};

// Initialize player object
(function() {
    for (let i = 0; i < database.buildings.all.length; i++) {
        player.buildings.push({
            count: 0,
            isAutoUnlocked: false,
            auto: false,
            autoMode: 0
        });
    }

    for (let i = 0; i < database.spells.all.length; i++) {
        player.spells.spells.push({
            level: 1,
            timer: 0,
            auto: false
        });
    }
}());