Vue.component("BuildingsDisplay", {
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
        },
        mode() {
            return database.buildings.currentMode();
        }
    },
    methods: {
        switchMode() {
            database.buildings.switchMode();
        },
        buy(building) {
            this.mode.buy(building);
        },
        buyable(building) {
            return this.mode.buyable(building);
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
                    <button v-show="building.isAutoUnlocked()"
                            class="building-auto-btn"
                            :class="{
                                'on': building.isAuto(),      
                                'off': !building.isAuto()
                            }"
                            @click="building.toggleAuto()">
                            Auto: {{building.isAuto() ? "On" : "Off"}}
                    </button>
                    <button class="building-buy-btn"
                            :class="{
                                'locked': !buyable(building),      
                                'buyable': buyable(building)
                            }"
                            @click="buy(building)">
                            {{mode.name}}
                    </button>
                </div>
            </div>
            <div class="building-util-btn-con">
                <button class="building-mode-btn" @click="switchMode()">Mode: {{mode.name}}</button>
                <button class="building-max-all-btn" @click="database.buildings.maxAll()">Max All</button>
            </div>
        </div>
    </div>`
});