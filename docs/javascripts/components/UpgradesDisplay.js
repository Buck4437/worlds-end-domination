Vue.component("UpgradesDisplay", {
    computed: {
        upgrades() {
            return database.upgrades.all;
        },
        spellsUnlocked() {
            return database.apocalypses.getApocalypseLevel() >= 1;
        }
    },
    methods: {
        update() {
            for (const child of this.$refs.upgrade) {
                child.update();
            }
        },
        buyAll() {
            database.upgrades.buyAll();
        }
    },
    mounted() {
        this.update();
    },
    template: `
    <div class="upgrades-section-con">
        <div class="upgrades-header">Building Upgrades</div>
        <button v-if="spellsUnlocked" class="upg-buy-all-btn" @click="buyAll()">
            Buy all upgrades
        </button>
        <div class="upg-list">
            <UpgradeButton v-for="upg in upgrades"
                            :upgrade="upg" 
                            :key="upg.id"
                            ref="upgrade"/>
        </div>
    </div>`
});