Vue.component("ManaShopUpgrade", {
    props: {
        upgrade: Object
    },
    data() {
        return {
            format: toSci,
            bought: false,
            canBuy: false,
            desc: "",
            cost: new Decimal(0)
        };
    },
    methods: {
        update() {
            this.bought = database.manaShop.hasUpgrade(this.upgrade.id);
            this.canBuy = this.upgrade.isBuyable();
            this.desc = this.upgrade.getDesc();
            this.cost = this.upgrade.getCost();
        }
    },
    template: `
    <button class="upg-btn"
            :class="{
                'bought': bought,
                'locked': !bought && !canBuy,      
                'buyable': !bought && canBuy
            }"
            @click="upgrade.buy()">
            <div class="upg-name">{{upgrade.name}}</div>
            <div class="upg-desc">{{desc}}</div>
            <div>Cost: {{format(cost, 2, 0)}} Mana</div>
    </button>`
});
