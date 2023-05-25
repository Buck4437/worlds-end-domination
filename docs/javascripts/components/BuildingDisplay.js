Vue.component("BuildingDisplay", {
    props: {
        building: Building
    },
    data() {
        return {
            owned: 0,
            base: new Decimal(0),
            production: new Decimal(0),
            unlockedAuto: false,
            isAuto: false,
            buyable: false,
            cost: new Decimal(0),
            format: toSci
        };
    },
    methods: {
        update() {
            const building = this.building;

            this.owned = building.owned();
            this.base = building.baseProduction();
            this.production = building.production();
            this.unlockedAuto = building.isAutoUnlocked();
            this.isAuto = building.isAuto();
            this.buyable = building.isBuyable();
            this.cost = building.cost();
        }
    },
    template: `
    <div class="building">
        <div class="building-text-con">
            <div>
                <span class="building-name">{{building.name}}</span>: {{owned}}
            </div>
            <div>
                Base: {{format(base)}} => {{format(production)}}/s
            </div>
        </div>
        <div class="building-buy-btn-con">
            <button v-show="unlockedAuto"
                    class="building-auto-btn"
                    :class="{
                        'on': isAuto,      
                        'off': !isAuto
                    }"
                    @click="building.toggleAuto()">
                    Auto: {{isAuto ? "On" : "Off"}}
            </button>
            <button class="building-buy-btn"
                    :class="{
                        'locked': !buyable,      
                        'buyable': buyable
                    }"
                    @click="building.buy()">
                    Cost: {{format(cost)}} Money
            </button>
        </div>
    </div>`
});