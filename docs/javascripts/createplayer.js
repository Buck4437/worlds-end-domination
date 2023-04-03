// Creates a player object with default values
function createPlayerObject() {
    // A default player object
    return {
        money: new Decimal(0),
        buildings: [null, 0, 0, 0, 0, 0, 0, 0],
        upgradeBits: 0,
        maxMoney: new Decimal(0),
    
        apocalypseLevel: 0,
        lastTick: Date.now()
    };
}
