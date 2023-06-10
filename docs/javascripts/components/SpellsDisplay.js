Vue.component("SpellsDisplay", {
    computed: {
        visibleSpells() {
            return database.spells.all.filter(spell => spell.isVisible());
        }
    },
    methods: {
        update() {
            for (const child of this.$refs.spell) {
                child.update();
            }
        }
    },
    template: `
    <div>
        <SpellDisplay v-for="spell in visibleSpells"
                      :spell="spell"
                      :key="spell.id"
                      ref="spell"/>
    </div>`
});
