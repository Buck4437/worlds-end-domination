Vue.component("SettingsTab", {
    data() {
        return {
            settings: player.settings,
            apocalypseLevel: 0
        };
    },
    methods: {
        // Placeholder
        update() {
            this.apocalypseLevel = database.apocalypses.getApocalypseLevel();
        }
    },
    template: `
    <div class="tab settings-tab">
        Confirmations:<br><br>
        <button v-if="apocalypseLevel >= 1" @click="settings.manaConfirmation = !settings.manaConfirmation">
            Convert Mana: {{settings.manaConfirmation ? "On" : "Off"}}
        </button>
    </div>`
});
