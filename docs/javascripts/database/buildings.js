// n represents number of buildings currently owned by the player
// Production is in Money / second
// Building id starts from 1 
database.buildings = {
    data: [
        null, 
        {
            name: "Workers",
            baseCost: new Decimal(1),
            baseScaling: new Decimal(1.1),
            baseProduction: new Decimal(1)
        }, 
        {
            name: "Farmers",
            baseCost: new Decimal(1000),
            baseScaling: new Decimal(1.2),
            baseProduction: new Decimal(50)
        },  
        {
            name: "Builders",
            baseCost: new Decimal(1e9),
            baseScaling: new Decimal(1.3),
            baseProduction: new Decimal(1e7)
        }, 
    ],
    all() {
        const buildings = []
        for (let i = 1; i < this.data.length; i++) {
            buildings.push(this.getBuilding(i));
        }
        return buildings;
    },
    getBuilding(n) {
        if (n <= 0 || n >= this.data.length) return null;
        const building = this.data[n];

        return {
            id: n,
            name: building.name,
            owned: () => player.buildings[n],
            cost: () => {
                const ownedBuilding = player.buildings[n];
                const baseCost = building.baseCost;
                const scaling = building.baseScaling;

                return baseCost.times(scaling.pow(ownedBuilding));
            },
            production: () => {
                const ownedBuilding = player.buildings[n];
                const baseProduction = building.baseProduction;

                const multiplier = new Decimal(ownedBuilding)
                                   .times(n === 1 ? database.upgrades.getUpgrade(1).apply() : 1)
                return baseProduction.times(multiplier);
            }
        }
    }
}

// Workers, Farmers, Builders, Merchants, Priests, Monarchs