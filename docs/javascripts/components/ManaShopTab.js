Vue.component("ManaShopTab", {
    data() {
        return {
            database,
            format: toSci
        };
    },
    template: `
    <div class="mana-shop-tab tab">
        <div class="upg-con">
            <button v-for="upgrade in database.manaShop.all()" class="upg-btn"
                    :class="{
                        'bought': database.manaShop.hasUpgrade(upgrade.id),
                        'locked': !database.manaShop.hasUpgrade(upgrade.id) && !upgrade.isBuyable(),      
                        'buyable': !database.manaShop.hasUpgrade(upgrade.id) && upgrade.isBuyable()
                    }"
                    @click="upgrade.buy()">
                    <div class="upg-name">{{upgrade.name}}</div>
                    <div class="upg-desc">{{upgrade.getDesc()}}</div>
                    <div>Cost: {{format(upgrade.getCost(), 2, 0)}} Mana</div>
            </button>
        </div>
    </div>`
});
