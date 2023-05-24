Vue.component("AutomationTab", {
    data() {
        return {
            database,
            format: toSci
        };
    },
    computed: {
        buildings() {
            return database.buildings.all;
        }
    },
    methods: {
        update() {
            return building.isAuto();
        },
        getModeName(building) {
            return database.buildings.modeName(building.getAutoMode());
        }
    },
    template: `
    <div class="automation-tab tab">
        <div v-for="building in database.buildings.all" class="automation-module">
            <button v-if="!building.isAutoUnlocked()"
                    class="automation-unlock-btn"
                    :class="{
                        'locked': !building.canUnlockAuto(),      
                        'buyable': building.canUnlockAuto()
                    }"
                    @click="building.unlockAuto()">
                Unlock autobuy for {{building.name.toLowerCase()}}<br>
                Reach {{format(building.getAutoCost())}} Money
            </button>
            <div v-else class="automation-autobuy-con">
                <span class="automation-autobuy-title">{{building.name}} Autobuyer</span>
                <div class="automation-autobuy-btn-con">
                    <button :class="{
                                'on': building.isAuto(),      
                                'off': !building.isAuto()
                            }"
                            @click="building.toggleAuto()">
                            Auto: {{building.isAuto() ? "On" : "Off"}}
                    </button>
                    <button @click="building.switchAutoMode()">Mode: {{getModeName(building)}}</button>
                </div>
            </div>
        </div>
    </div>`
});