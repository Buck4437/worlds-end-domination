Vue.component("BuildingsDisplay", {
    data() {
        return {
            apocalypseLevel: 0,
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
            this.apocalypseLevel = database.apocalypses.getApocalypseLevel();

            for (const child of this.$refs.building) {
                child.update();
            }
        },
        isShown(id) {
            if (this.apocalypseLevel >= 1) return true;
            return id === 1 || database.buildings.getBuilding(id - 1).owned() > 0;
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
                         v-show="isShown(building.id)"
                         :building="building"
                         :key="building.id"
                         ref="building"/>
        <div class="building-util-btn-con" v-if="isShown(2)">
            <button class="building-mode-btn" @click="switchMode()">Mode: {{modeName}}</button>
            <button class="building-max-all-btn" @click="maxAll()">Max All</button>
        </div>
    </div>`
});