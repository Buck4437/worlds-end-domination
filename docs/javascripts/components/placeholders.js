Vue.component("OptionsTab", {
    data() {
        return {
            database,
            format: toSci
        };
    },
    template: `
    <div>
        Placeholder 1
    </div>`
});

Vue.component("ManaShopTab", {
    data() {
        return {
            database,
            format: toSci
        };
    },
    template: `
    <div class="mana-shop-tab">
        Placeholder for mana shop (WIP, none of the effects are added yet)
        <div v-for="upgrade in database.manaShop.all()">
            <span>{{upgrade.name}}: {{upgrade.getDesc()}}</span><br>
            <button class="upg-btn"
                    :class="{
                        'bought': database.manaShop.hasUpgrade(upgrade.id),
                        'locked': !database.manaShop.hasUpgrade(upgrade.id) && !upgrade.isBuyable(),      
                        'buyable': !database.manaShop.hasUpgrade(upgrade.id) && upgrade.isBuyable()
                    }"
                    @click="upgrade.buy()">
                <span>Cost: {{format(upgrade.getCost(), 2, 0)}} Mana</span><br>
            </button>
        </div>
    </div>`
});
