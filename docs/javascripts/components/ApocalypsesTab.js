Vue.component("ApocalypsesTab", {
    data() {
        return {
            apocalypseLevel: 0,
            interval: null
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
    mounted() {
        this.interval = setInterval(() => {
            this.update();
        }, 50);
    },
    beforeDestroyed() {
        clearInterval(this.interval);
    },
    template: `
    <div class="tab">
        <ApocalypseDisplay v-for="apocalypse in apocalypsesList"
                           :apocalypse="apocalypse"
                           :key="apocalypse.level"/>
    </div>`
});