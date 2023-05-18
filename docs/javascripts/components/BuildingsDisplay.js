Vue.component("BuildingsDisplay", {
    data() {
        return {
            player,
            database,
            format: toSci,
            mode: 0,
            modes: [
                {
                    name: "Buy 1",
                    buyable(building) {
                        return building.isBuyable();
                    },
                    buy(building) {
                        building.buy();
                    }
                },
                {
                    name: "Buy to next 10",
                    buyable(building) {
                        return building.isBuyableToTen();
                    },
                    buy(building) {
                        building.buyToTen();
                    }
                },
                {
                    name: "Buy max",
                    buyable(building) {
                        return building.isBuyable();
                    },
                    buy(building) {
                        building.buyMax();
                    }
                }
            ]
        };
    },
    computed: {
        buildings() {
            return this.database.buildings.all();
        },
        upgrades() {
            return this.database.upgrades.all();
        },
        currentMode() {
            return this.modes[this.mode];
        }
    },
    methods: {
        switchMode() {
            this.mode = (this.mode + 1) % this.modes.length;
        },
        buy(building) {
            this.currentMode.buy(building);
        },
        buyable(building) {
            return this.currentMode.buyable(building);
        }
    },
    template: `
    <div>
        <div class="building-con">
            <div v-for="building in buildings" class="building">
                <div class="building-text-con">
                    <div>
                        {{building.name}}: {{building.owned()}}
                        (×{{format(building.multiplier())}})
                        (Total: + {{format(building.production())}}/s)
                    </div>
                    <div>
                        Cost: {{format(building.cost())}} Money
                    </div>
                </div>
                <div class="building-buy-btn-con">
                    <button class="building-buy-btn"
                            :class="{
                                'locked': !buyable(building),      
                                'buyable': buyable(building)
                            }"
                            @click="buy(building)">
                            {{currentMode.name}}
                    </button>
                </div>
            </div>
            <div class="building-util-btn-con">
                <button class="building-mode-btn" @click="switchMode()">Mode: {{currentMode.name}}</button>
                <button class="building-max-all-btn" @click="database.buildings.maxAll()">Max All</button>
            </div>
        </div>
    </div>`
});