Vue.component("AutomationTab", {
    data() {
        return {
            database,
            format: toSci,
            update: true,
            interval: null
        };
    },
    computed: {
        buildings() {
            return database.buildings.all;
        }
    },
    mounted() {
        this.interval = setInterval(() => {
            this.update = !this.update;
        }, 50);
    },
    beforeDestroyed() {
        clearInterval(this.interval);
    },
    template: `
    <div class="automation-tab tab">
        <AutobuyerDisplay v-for="building in buildings" 
                          class="automation-module"
                          :building="building"
                          :updater="update"
                          :key="building.id"/>
    </div>`
});