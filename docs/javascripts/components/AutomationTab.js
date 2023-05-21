Vue.component("AutomationTab", {
    data() {
        return {
            database,
            format: toSci
        };
    },
    template: `
    <div class="automation-tab tab">
        <div v-for="building in database.buildings.all">
            <button class="automation-unlock-btn"
                    :class="{
                        'bought': building.isAutoUnlocked(),
                        'locked': !building.isAutoUnlocked() && !building.canUnlockAuto(),      
                        'buyable': !building.isAutoUnlocked() && building.canUnlockAuto()
                    }"
                    @click="building.unlockAuto()">
                Unlock autobuy for {{building.name.toLowerCase()}}<br>
                Cost: {{format(building.getAutoCost())}} Money
            </button>
        </div>
    </div>`
});