// eslint-disable-next-line no-new
const app = new Vue({
    el: "#app",
    data: {
        player: player,
        database: database,
        format: toSci,
        version: "v0.0.0"
    },
    computed: {
        buildings() {
            return this.database.buildings.all();
        },
        upgrades() {
            return this.database.upgrades.all();
        }
    },
    methods: {
        buy(id) {
            const building = this.database.buildings.getBuilding(id);
            const cost = building.cost();
            if (this.player.money.gte(cost)) {
                this.player.money = this.player.money.sub(cost);
                this.player.buildings[id] += 1;
            }
        },
        buyUpgrade(id) {
            if (!this.database.upgrades.hasUpgrade(id)) {
                const upg = this.database.upgrades.getUpgrade(id);
                if (this.player.money.gte(upg.cost)) {
                    this.player.money = this.player.money.sub(upg.cost);
                    this.player.upgradeBits |= 2 ** (id - 1)
                }
            }
        }
    },
    watch: {
        player: {
            deep: true,
            handler: () => {}
        }
    },
    mounted() {
        setInterval(() => {
            const dt = Date.now() - this.player.lastTick;
            this.player.lastTick = Date.now();

            if (dt < 0) return;

            for (const building of this.database.buildings.all()) {
                const production = building.production();
                this.player.money = this.player.money.add(production.times(dt / 1000));
            }
        }, 50)
    }
});
