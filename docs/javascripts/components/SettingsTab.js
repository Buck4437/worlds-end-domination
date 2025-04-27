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
        },
        reset() {
            if (prompt("Do you want to permanently wipe your save? Type 'Yes' to proceed.") === "Yes") {
                localStorage.removeItem(SAVE_NAME);
                window.location.reload();
            }
        },
        cheatLevel() {
            player.apocalypseLevel = 1;
        }
    },
    template: `
    <div class="tab settings-tab">
        <div v-if="apocalypseLevel >= 1">
            Confirmations:<br><br>
            <button @click="settings.manaConfirmation = !settings.manaConfirmation">
                Convert Mana: {{settings.manaConfirmation ? "On" : "Off"}}
            </button>
            <br><br>
        </div>
        Save Management: <br><br>
        <button @click="reset">
            Hard Reset
        </button>
        <br><br>
        <!--
        Debugging: <br><br>
        <button @click="cheatLevel">Cheat to Apocalypse 1</button><br><br>
        -->
        Special thanks to Jazz for his inputs to the game.
    </div>`
});
