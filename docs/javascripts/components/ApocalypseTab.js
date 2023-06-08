Vue.component("ApocalypseTab", {
    data() {
        return {
            apocalypseLevel: 0,
        };
    },
    computed: {
        apocalypsesList() {
            return database.apocalypses.all().filter(x => this.apocalypseLevel >= x.level);
        }
    },
    methods: {
        update() {
            this.apocalypseLevel = database.apocalypses.getApocalypseLevel();
        }
    },
    template: `
    <div class="tab">
        Your excess greed has unleashed the wrath of god in the form of apocalypses.<br>
        Performing an apocalypse will reset your game.<br>
        In addition, each apocalypse applies permanent nerf to your current game, 
        but also unlocks new features.<br><br>
        You are currently in Apocalypse {{apocalypseLevel}}.<br>
        <ApocalypseDisplay v-for="apocalypse in apocalypsesList"
                           :apocalypse="apocalypse"
                           :key="apocalypse.level"/>
    </div>`
});