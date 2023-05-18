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
        }
    },
    template: `
    <div>
        <div class="main-tab-wrapper">
            <div class="buildings-section">
                <BuildingsDisplay/>
                Upgrades:
                <div class="upg-list">
                    <UpgradeContainer v-for="upg in upgrades"
                                    :upgrade="upg" 
                                    :key="upg.id">
                    </UpgradeContainer>
                </div>
            </div>
            <div class="spells-section">
                Spells:
                <SpellsDisplay/>
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>`
});