Vue.component("AutomationTab", {
    computed: {
        buildings() {
            return database.buildings.all;
        }
    },
    methods: {
        update() {
            for (const child of this.$refs.building) {
                child.update();
            }
        }
    },
    template: `
    <div class="automation-tab tab">
        <AutobuyerDisplay v-for="building in buildings" 
                          :building="building"
                          :key="building.id"
                          ref="building"/>
    </div>`
});