window.player = {
    money: new Decimal(0),
    buildings: [
        null,
        {
            count: 0,
            isAutoUnlocked: false,
            auto: false
        },
        {
            count: 0,
            isAutoUnlocked: false,
            auto: false
        },
        {
            count: 0,
            isAutoUnlocked: false,
            auto: false
        },
        {
            count: 0,
            isAutoUnlocked: false,
            auto: false
        },
        {
            count: 0,
            isAutoUnlocked: false,
            auto: false
        },
        {
            count: 0,
            isAutoUnlocked: false,
            auto: false
        },
        {
            count: 0,
            isAutoUnlocked: false,
            auto: false
        }
    ],
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
