// eslint-disable-next-line no-new
const app = new Vue({
    el: "#app",
    data: {
        player: player,
        database: database,
        version: "v0.0.0"
    },
    computed: {
    },
    methods: {
        buy(id) {
            const building = this.database.buildings[id]
            const targetBuilding = this.player.buildings[building.id];
            const cost = building.getCost(targetBuilding);
            if (this.player.money.gte(cost)) {
                this.player.money = this.player.money.sub(cost);
                this.player.buildings[building.id] += 1;
            }
        }
    },
    mounted() {
        setInterval(() => {
            const dt = Date.now() - this.player.lastTick;
            this.player.lastTick = Date.now();

            if (dt < 0) return;

            for (const building of this.database.buildings) {
                const production = building.getProduction(this.player.buildings[building.id]);
                this.player.money = this.player.money.add(production.times(dt / 1000));
            }
        }, 50)
    }
});
