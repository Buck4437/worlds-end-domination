Vue.component("SpellsDisplay", {
    data() {
        return {
            interval: null
        };
    },
    computed: {
        unlockedSpells() {
            return database.spells.all.filter(spell => spell.isUnlocked());
        }
    },
    methods: {
        update() {
            for (const child of this.$refs.spell) {
                child.update();
            }
        }
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
    <div>
        <SpellDisplay v-for="spell in unlockedSpells"
                      :spell="spell"
                      :key="spell.id"
                      ref="spell"/>
    </div>`
});
