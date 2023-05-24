Vue.component("AutobuyerDisplay", {
    props: {
        building: Building
    },
    data() {
        return {
            format: toSci,
            unlockable: false,
            unlocked: false,
            cost: new Decimal(0),
            isAuto: false,
            modeNum: 0
        };
    },
    computed: {
        modeName() {
            return database.buildings.modeName(this.modeNum);
        }
    },
    methods: {
        update() {
            this.unlockable = this.building.canUnlockAuto();
            this.unlocked = this.building.isAutoUnlocked();
            this.cost = this.building.getAutoCost();
            this.isAuto = this.building.isAuto();
            this.modeNum = this.building.getAutoMode();
        }
    },
    template: `
    <div class="autobuyer-display">
        <button v-if="!unlocked"
                class="automation-unlock-btn"
                :class="{
                    'locked': !unlockable,      
                    'buyable': unlockable
                }"
                @click="building.unlockAuto()">
            Unlock autobuy for {{building.name.toLowerCase()}}<br>
            Reach {{format(cost)}} Money
        </button>
        <div v-else class="automation-autobuy-con">
            <span class="automation-autobuy-title">{{building.name}} Autobuyer</span>
            <div class="automation-autobuy-btn-con">
                <button :class="{
                            'on': isAuto,      
                            'off': !isAuto
                        }"
                        @click="building.toggleAuto()">
                        Auto: {{isAuto ? "On" : "Off"}}
                </button>
                <button @click="building.switchAutoMode()">Mode: {{modeName}}</button>
            </div>
        </div>
    </div>`
});