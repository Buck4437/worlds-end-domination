Vue.component("SpellsDisplay", {
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
    template: `
    <div>
        <SpellDisplay v-for="spell in unlockedSpells"
                      :spell="spell"
                      :key="spell.id"
                      ref="spell"/>
    </div>`
});
