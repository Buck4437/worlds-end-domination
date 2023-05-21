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
        <button class="upg-btn"
                :class="{
                    'bought': database.upgrades.hasUpgrade(upgrade.id),
                    'locked': !database.upgrades.hasUpgrade(upgrade.id) && !upgrade.isBuyable(),      
                    'buyable': !database.upgrades.hasUpgrade(upgrade.id) && upgrade.isBuyable()
                }"
                @click="upgrade.buy()">
            <div class="upgrade-name">{{upgrade.name}}</div>
            <span class="upgrade-desc">{{upgrade.getDesc()}}</span>
            Currently: {{upgrade.effectPrefix}}{{format(upgrade.effect())}}<br>
            Cost: {{format(upgrade.cost)}} Money
        </button>`
});