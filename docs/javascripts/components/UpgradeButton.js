Vue.component("UpgradeButton", {
    props: {
        upgrade: Upgrade
    },
    data() {
        return {
            database,
            owned: false,
            buyable: false,
            desc: "",
            effect: new Decimal(0),
            format: toSci
        };
    },
    methods: {
        update() {
            this.owned = database.upgrades.hasUpgrade(this.upgrade.id);
            this.buyable = this.upgrade.isBuyable();
            this.desc = this.upgrade.getDesc();
            this.effect = this.upgrade.effect();
        }
    },
    template: `
        <button class="upg-btn"
                :class="{
                    'bought': owned,
                    'locked': !owned && !buyable,      
                    'buyable': !owned && buyable
                }"
                @click="upgrade.buy()">
            <div class="upg-name">{{upgrade.name}}</div>
            <span class="upg-desc">{{desc}}</span>
            Currently: {{upgrade.effectPrefix}}{{format(effect)}}<br>
            Cost: {{format(upgrade.cost)}} Money
        </button>`
});