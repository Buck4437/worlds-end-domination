Vue.component("BuildingDisplay", {
    props: {
        building: Building
    },
    data() {
        return {
            tippyInstance: null,
            owned: 0,
            base: new Decimal(0),
            multi: new Decimal(0),
            production: new Decimal(0),
            unlockedAuto: false,
            isAuto: false,
            buyable: false,
            cost: new Decimal(0),
            format: toSci
        };
    },
    computed: {
        detailedProduction() {
            const base = this.format(this.base);
            const owned = this.format(this.owned, 2, 0);
            const multi = this.format(this.multi);
            return `${base} x${multi} x${owned}`;
        }
    },
    methods: {
        update() {
            const building = this.building;

            this.owned = building.owned();
            this.base = building.baseProduction();
            this.multi = building.multiplier();
            this.production = building.production();
            this.unlockedAuto = building.isAutoUnlocked();
            this.isAuto = building.isAuto();
            this.buyable = building.isBuyable();
            this.cost = building.cost();

            this.tippyInstance.setContent(this.detailedProduction);
        }
    },
    mounted() {
        this.tippyInstance = tippy(this.$el.querySelector(".building-production"), {
            content: this.detailedProduction
        });
    },
    unmounted() {
        this.tippyInstances.destroy();
    },
    template: `
    <div class="building">
        <div class="building-text-con">
            <div>
                <span class="building-name">{{building.name}}</span>: {{owned}}
            </div>
            <div class="building-production" tabindex="0">
                {{format(production)}} Money/s
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