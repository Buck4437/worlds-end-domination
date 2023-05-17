Vue.component("SpellsDisplay", {
    data() {
        return {
            database,
            player,
            format: toSci
        };
    },
    computed: {
        spells() {
            return this.database.spells.all();
        }
    },
    template: `
    <div>
        Mana: {{format(player.spells.mana)}}
        <div>
            <div v-for="spell in spells">
                {{spell.name}}
            </div>
        </div>
    </div>`
});
