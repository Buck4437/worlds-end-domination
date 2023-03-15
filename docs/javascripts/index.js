// eslint-disable-next-line no-new, no-unused-vars
const app = new Vue({
    el: "#app",
    data: {
        player,
        database,
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
        buyUpgrade(id) {
            if (!this.database.upgrades.hasUpgrade(id)) {
                const upg = this.database.upgrades.getUpgrade(id);
                if (this.player.money.gte(upg.cost)) {
                    this.player.money = this.player.money.sub(upg.cost);
                    this.player.upgradeBits |= 2 ** (id - 1); // eslint-disable-line no-bitwise
                }
            }
        }
    },
    watch: {
        player: {
            deep: true,
            // eslint-disable-next-line no-empty-function
            handler() {}
        }
    },
    mounted() {
        setInterval(() => {
            const dt = Date.now() - this.player.lastTick;
            this.player.lastTick = Date.now();

            if (dt < 0) return;

            for (const building of this.database.buildings.all()) {
                const production = building.production();
                const newMoney = this.player.money.add(production.times(dt / 1000));
                // Prevent player from getting more than the max amount of money.
                this.player.money = Decimal.min(newMoney, database.constants.goal);
            }
        }, 25);
    }
});
