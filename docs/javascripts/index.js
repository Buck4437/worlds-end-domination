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
                ["Options", -1],
                ["About", -1]
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
            const percent = Decimal.log10(database.stats.maxMoneyThisApocalypse().add(1)) / 
                            Decimal.log10(this.database.constants.goal) * 100;
            return this.format(percent);
        }
    },
    methods: {
        switchTab(tab) {
            this.currentTab = tab;
        },
        toTabComponent(name) {
            return `${name.split(" ").map(x => capitalize(x.toLowerCase())).join("")}Tab`;
        },
        mountHotkeys() {
            document.addEventListener("keydown", event => {
                switch (event.code) {
                    case "Digit1":
                        database.buildings.getBuilding(1).buy();
                        break;
                    case "Digit2":
                        database.buildings.getBuilding(2).buy();
                        break;
                    case "Digit3":
                        database.buildings.getBuilding(3).buy();
                        break;
                    case "Digit4":
                        database.buildings.getBuilding(4).buy();
                        break;
                    case "KeyA":
                        database.buildings.maxAll();
                        break;
                    case "KeyM":
                        database.spells.convert();
                        break;
                }
            });
        }
    },
    mounted() {
        this.switchTab(this.tabs[0]);
        this.mountHotkeys();
        setInterval(gameloop, 25);
    }
});

