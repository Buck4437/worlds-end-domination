// eslint-disable-next-line no-new, no-unused-vars
const app = new Vue({
    el: "#app",
    data: {
        player,
        database,
        format: toSci,
        currentTab: "",
        version: "v0.0.0"
    },
    computed: {
        tabs() {
            // Format [Tabname, Apocalypse level required to unlock tab]
            const data = [
                ["Main", -1],
                ["Automation", 1],
                ["Mana Shop", 1],
                ["Apocalypses", 1],
                ["Options", -1]
            ];
            const tabList = [];
            const apocalypseLevel = database.apocalypses.getApocalypseLevel();
            for (const item of data) {
                if (apocalypseLevel >= item[1]) {
                    tabList.push(item[0]);
                }
            }
            return tabList;
        },
        maxPercentage() {
            const percent = 
                Decimal.log10(this.player.maxMoney.add(1)) / Decimal.log10(this.database.constants.goal) * 100;
            return this.format(percent);
        }
    },
    methods: {
        switchTab(tab) {
            this.currentTab = tab;
        },
        toTabComponent(name) {
            return `${name.split(" ").map(x => capitalize(x.toLowerCase())).join("")}Tab`;
        }
    },
    mounted() {
        this.switchTab(this.tabs[0]);
        setInterval(gameloop, 25);
    }
});

