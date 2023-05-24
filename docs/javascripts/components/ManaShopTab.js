Vue.component("ManaShopTab", {
    data() {
        return {
            interval: null
        };
    },
    computed: {
        upgrades() {
            return database.manaShop.all();
        }
    },
    mounted() {
        this.interval = setInterval(() => {
            for (const child of this.$refs.upgrade) {
                child.update();
            }
        }, 50);
    },
    beforeDestroyed() {
        clearInterval(this.interval);
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
