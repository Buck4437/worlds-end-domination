Vue.component("MainTab", {
    data() {
        return {
            database,
            interval: null,
        };
    },
    computed: {
        upgrades() {
            const upgs = database.upgrades.all;
            if (this.spellsUnlocked) {
                return upgs;
            }
            return upgs.filter(x => x.id === 1 || database.upgrades.hasUpgrade(x.id - 1));
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
    },
    mounted() {
        this.update();
        this.interval = setInterval(() => {
            this.update();
        }, 50);
    },
    beforeDestroyed() {
        clearInterval(this.interval);
    },
    template: `
    <div class="main-tab tab">
        <div class="main-tab-wrapper">
            <div class="buildings-section" :class="{'pre-apocalypse': !spellsUnlocked}">
                <BuildingsDisplay/>
                <div class="upgrades-section-con">
                    <div class="upgrades-header">Building Upgrades</div>
                    <button v-if="spellsUnlocked" class="upg-buy-all-btn" @click="database.upgrades.buyAll()">
                        Buy all upgrades
                    </button>
                    <div class="upg-list">
                        <UpgradeButton v-for="upg in upgrades"
                                        :upgrade="upg" 
                                        :key="upg.id"
                                        ref="upgrade"/>
                    </div>
                </div>
            </div>
            <div v-if="spellsUnlocked" class="spells-section">
                <SpellsDisplay/>
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>`
});