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
        Performing an apocalypse will reset your game.<br>
        In addition, each apocalypse applies permanent nerfs, 
        but also unlocks new features.<br><br>
        You are currently in Apocalypse {{apocalypseLevel}}.<br><br>
        <ApocalypseDisplay v-for="apocalypse in apocalypsesList"
                           :apocalypse="apocalypse"
                           :key="apocalypse.level"/>
    </div>`
});