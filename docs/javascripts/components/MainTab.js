Vue.component("MainTab", {
    computed: {
        spellsUnlocked() {
            return database.apocalypses.getApocalypseLevel() >= 1;
        },
        showUpgrades() {
            return this.spellsUnlocked || database.buildings.getBuilding(2).owned() > 0;
        }
    },
    methods: {
        update() {
            this.$refs.building.update();
            this.$refs.upgrade?.update();
            if (this.spellsUnlocked) {
                this.$refs.spell.update();
            }
        },
    },
    template: `
    <div class="main-tab tab">
        <div class="main-tab-wrapper">
            <div class="buildings-section" :class="{'pre-apocalypse': !spellsUnlocked}">
                <BuildingsDisplay ref="building"/>
                <UpgradesDisplay v-if="showUpgrades" ref="upgrade"/>
            </div>
            <div v-if="spellsUnlocked" class="spells-section">
                <SpellsDisplay ref="spell"/>
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>`
});