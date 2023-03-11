// n represents number of buildings currently owned by the player
// Production is in Money / second
database.buildings = [
    {
        id: 1,
        name: "Workers",
        getCost: n => {
            // If the player owns 0 building, then it should be free
            if (n <= 0) {
                return new Decimal(0);
            }
            const scaling = new Decimal(1.1);
            return scaling.pow(n);
        },
        getProduction: n => {
            const baseProduction = new Decimal(1);
            return baseProduction.times(n);
        }
    }, 
    {
        id: 2,
        name: "Farmers",
        getCost: n => {
            const baseCost = new Decimal(1000);
            const scaling = new Decimal(1.2);
            return baseCost.times(scaling.pow(n));
        },
        getProduction: n => {
            const baseProduction = new Decimal(100);
            return baseProduction.times(n);
        }
    }
]

// Workers, Farmers, Builders, Merchants, Priests, Monarchs