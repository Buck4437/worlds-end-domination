Vue.component("buildings-tab", {
    data() {
        return {
            player,
            database,
            format: toSci
        };
    },
    computed: {
        buildings() {
            return this.database.buildings.all();
        },
        upgrades() {
            return this.database.upgrades.all();
        }
    },
    watch: {
        player: {
            deep: true,
            // eslint-disable-next-line no-empty-function
            handler() {}
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
                        (+ {{format(building.production())}}/s)
                    </div>
                    <div>
                        Cost: {{format(building.cost())}} Money
                    </div>
                </div>
                <div class="building-buy-btn-con">
                    <button class="building-buy-btn" 
                            :class="{
                                'locked': !building.isBuyable(),      
                                'buyable': building.isBuyable()
                            }"
                            @click="building.buy()">
                            Buy 1
                    </button>
                    <button class="building-buy-btn"
                            :class="{
                                'locked': !building.isBuyableToTen(),      
                                'buyable': building.isBuyableToTen()
                            }"
                            @click="building.buyToTen()">
                            Buy to next 10
                    </button>
                    <button class="building-buy-btn"
                            :class="{
                                'locked': !building.isBuyable(),      
                                'buyable': building.isBuyable()
                            }"
                            @click="building.buyMax()">
                            Buy max
                    </button>
                </div>
            </div>
            <div class="building-max-all-btn-con">
                <button class="building-max-all-btn" @click="database.buildings.maxAll()">Max All</button>
            </div>
        </div>
        Upgrades:
        <div class="upg-con">
            <upgrade-button v-for="upg in upgrades"
                            :upgrade="upg" 
                            :key="upg.id">
            </upgrade-button>
        </div>
    </div>`
});