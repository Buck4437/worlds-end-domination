Vue.component("AutomationTab", {
    data() {
        return {
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
            for (const child of this.$refs.building) {
                child.update();
            }
        }, 50);
    },
    beforeDestroyed() {
        clearInterval(this.interval);
    },
    template: `
    <div class="automation-tab tab">
        <AutobuyerDisplay v-for="building in buildings" 
                          :building="building"
                          :key="building.id"
                          ref="building"/>
    </div>`
});