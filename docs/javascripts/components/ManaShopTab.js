Vue.component("ManaShopTab", {
    computed: {
        upgrades() {
            return database.manaShop.all();
        }
    },
    methods: {
        update() {
            for (const child of this.$refs.upgrade) {
                child.update();
            }
        }
    },
    template: `
    <div class="mana-shop-tab tab">
        <div class="upg-con">
            <ManaShopUpgrade v-for="upgrade in upgrades"
                             :upgrade="upgrade"
                             :key="upgrade.id"
                             ref="upgrade"/>
        </div>
    </div>`
});
