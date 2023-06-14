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
    <div>
        Confirmation:<br>
        <button v-if="apocalypseLevel >= 1" @click="settings.manaConfirmation = !settings.manaConfirmation">
            Convert Mana: {{settings.manaConfirmation ? "On" : "Off"}}
        </button>
    </div>`
});

Vue.component("AboutTab", {
    data() {
        return {
            database,
            format: toSci
        };
    },
    methods: {
        // Placeholder
        update() {}
    },
    template: `
    <div>
        This is where I will add How To Play, Hotkeys, etc.<br>
        Hotkeys (I'll add progressive display later):<br>
        Left right arrow: switch between tabs<br>
        Building 1-4: 1-4<br>
        Max All: A<br>
        Convert Money to Mana: M<br>
        mana conversion has a cooldown of 1 second.
    </div>`
});
