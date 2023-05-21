Vue.component("MainTab", {
    data() {
        return {
            player,
            database,
            format: toSci
        };
    },
    computed: {
        upgrades() {
            return this.database.upgrades.all;
        },
        spellsUnlocked() {
            return this.database.apocalypses.getApocalypseLevel() >= 1;
        }
    },
    template: `
    <div class="main-tab tab">
        <div class="main-tab-wrapper">
            <div class="buildings-section">
                <BuildingsDisplay/>
                <div class="upgrades-section-con">
                    <div class="upgrades-header">Building Upgrades</div>
                    <button class="upg-buy-all-btn" @click="database.upgrades.buyAll()">
                        Buy all upgrades
                    </button>
                    <div class="upg-list">
                        <UpgradeButton v-for="upg in upgrades"
                                        :upgrade="upg" 
                                        :key="upg.id"/>
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