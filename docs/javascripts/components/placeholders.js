Vue.component("OptionsTab", {
    data() {
        return {
            database,
            format: toSci
        };
    },
    template: `
    <div>
        Placeholder 1
    </div>`
});

Vue.component("GuildsTab", {
    data() {
        return {
            player,
            database,
            format: toSci
        };
    },
    template: `
    <div>
        Members: {{player.guilds.members}}<br>
        <button @click="database.guilds.reset()">
            Recruit Member<br>
            Next member at {{format(database.guilds.getNextRequirement())}} money.
        </button>
        <br>
        Guilds placeholder<br>
        Todo:
        <ul>
            <li>Member gives effect</li>
            <li>Milestones</li>
            <li>Basic Automation</li>
            <li>Max recruit</li>
        </ul>
    </div>`
});
