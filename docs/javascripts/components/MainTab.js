Vue.component("MainTab", {
    computed: {
        afterFirstReset() {
            return database.apocalypses.getApocalypseLevel() >= 1;
        },
        showSpells() {
            return player.display.spells;
        },
        showUpgrades() {
            return this.spellsUnlocked || database.buildings.getBuilding(2).owned() > 0;
        }
    },
    methods: {
        update() {
            this.$refs.building.update();
            this.$refs.upgrade?.update();
            if (this.showSpells) {
                this.$refs.spell.update();
            }
        },
    },
    template: `
    <div class="main-tab tab">
        <div class="main-tab-wrapper">
            <div class="buildings-section" :class="{'pre-apocalypse': !showSpells}">
                <BuildingsDisplay ref="building"/>
                <UpgradesDisplay v-if="showUpgrades || afterFirstReset" ref="upgrade"/>
            </div>
            <div v-if="showSpells" class="spells-section">
                <SpellsDisplay ref="spell"/>
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>`
});