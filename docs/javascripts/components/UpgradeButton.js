Vue.component("UpgradeButton", {
    props: {
        upgrade: Object
    },
    data() {
        return {
            database,
            format: toSci
        };
    },
    template: `
    <div>
        <button class="upg-btn"
                :class="{
                    'bought': database.upgrades.hasUpgrade(upgrade.id),
                    'locked': !database.upgrades.hasUpgrade(upgrade.id) && !upgrade.isBuyable(),      
                    'buyable': !database.upgrades.hasUpgrade(upgrade.id) && upgrade.isBuyable()
                }"
                @click="upgrade.buy()">
            <span>{{upgrade.name}}: {{upgrade.getDesc()}}</span>
            <span v-if="upgrade.type === database.constants.upgradeType.EFFECT">
                Currently: {{upgrade.effectPrefix}}{{format(upgrade.effect())}}<br>
            </span>
            <span>Cost: {{format(upgrade.cost)}} Money</span>
        </button>
    </div>`
});