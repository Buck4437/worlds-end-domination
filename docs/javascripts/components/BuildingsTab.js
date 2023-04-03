import UpgradeButton from "./UpgradeButton.js";

const BuildingsTab = {
    props: {
        player: Object
    },
    data() {
        return {
            format: toSci
        };
    },
    components: {
        UpgradeButton
    },
    computed: {
        buildings() {
            return this.database.buildings(this.player).all();
        },
        upgrades() {
            return this.database.upgrades(this.player).all();
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
                <button class="building-max-all-btn" @click="database.buildings(player).maxAll()">Max All</button>
            </div>
        </div>
        Upgrades:
        <div class="upg-con">
            <upgrade-button v-for="upg in upgrades"
                            :upgrade="upg"
                            :player="player"
                            :key="upg.id">
            </upgrade-button>
        </div>
    </div>`
};

export default BuildingsTab;