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
            return this.database.upgrades.all();
        },
        spellsUnlocked() {
            return this.database.apocalypses.getApocalypseLevel() >= 1;
        }
    },
    template: `
    <div class="main-tab">
        <div class="main-tab-wrapper">
            <div class="buildings-section">
                <BuildingsDisplay/>
                <span class="upgrade-header">Upgrades:</span>
                <button @click="database.upgrades.buyAll()">
                    Buy all upgrades
                </button>
                <div class="upg-list">
                    <UpgradeContainer v-for="upg in upgrades"
                                    :upgrade="upg" 
                                    :key="upg.id">
                    </UpgradeContainer>
                </div>
            </div>
            <div v-if="spellsUnlocked" class="spells-section">
                <SpellsDisplay/>
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>`
});