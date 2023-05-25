Vue.component("MainTab", {
    data() {
        return {
            interval: null,
        };
    },
    computed: {
        spellsUnlocked() {
            return database.apocalypses.getApocalypseLevel() >= 1;
        }
    },
    methods: {
        update() {
            this.$refs.building.update();
            this.$refs.upgrade.update();
            if (this.spellsUnlocked) {
                this.$refs.spell.update();
            }
        },
    },
    mounted() {
        this.update();
        this.interval = setInterval(() => {
            this.update();
        }, 25);
    },
    beforeDestroyed() {
        clearInterval(this.interval);
    },
    template: `
    <div class="main-tab tab">
        <div class="main-tab-wrapper">
            <div class="buildings-section" :class="{'pre-apocalypse': !spellsUnlocked}">
                <BuildingsDisplay ref="building"/>
                <UpgradesDisplay ref="upgrade"/>
            </div>
            <div v-if="spellsUnlocked" class="spells-section">
                <SpellsDisplay ref="spell"/>
            </div>
        </div>
        <div style="clear: both;"></div>
    </div>`
});