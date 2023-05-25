Vue.component("BuildingsDisplay", {
    data() {
        return {
            modeName: ""
        };
    },
    computed: {
        buildings() {
            return database.buildings.all;
        }
    },
    methods: {
        update() {
            this.modeName = database.buildings.modeName();

            for (const child of this.$refs.building) {
                child.update();
            }
        },
        switchMode() {
            database.buildings.switchMode();
        },
        maxAll() {
            database.buildings.maxAll();
        }
    },
    template: `
    <div class="building-con">
        <BuildingDisplay v-for="building in buildings"
                         :building="building"
                         :key="building.id"
                         ref="building"/>
        <div class="building-util-btn-con">
            <button class="building-mode-btn" @click="switchMode()">Mode: {{modeName}}</button>
            <button class="building-max-all-btn" @click="maxAll()">Max All</button>
        </div>
    </div>`
});