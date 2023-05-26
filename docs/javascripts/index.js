// eslint-disable-next-line no-new, no-unused-vars
const app = new Vue({
    el: "#app",
    data: {
        player,
        database,
        money: new Decimal(0),
        maxMoney: new Decimal(0),
        format: toSci,
        currentTab: "",
        version: "v0.0.0"
    },
    computed: {
        tabs() {
            const apocalypseLevel = database.apocalypses.getApocalypseLevel();

            // Format [Tabname, Threshold to unlock tab]
            const data = [
                {
                    name: "Main",
                    shown: () => true,
                    class: "main-tab-btn"
                },
                {
                    name: "Automation",
                    shown: () => apocalypseLevel >= 1 || database.buildings.getBuilding(3).owned() > 0,
                    class: "automation-tab-btn"
                },
                {
                    name: "Mana Shop",
                    shown: () => apocalypseLevel >= 1,
                    class: "mana-tab-btn"
                },
                {
                    name: "Apocalypses",
                    shown: () => apocalypseLevel >= 1,
                    class: "apocalypse-tab-btn"
                },
                {
                    name: "Options",
                    shown: () => true,
                    class: null
                },
                {
                    name: "About",
                    shown: () => true,
                    class: null
                }
            ];
            const tabList = [];
            for (const item of data) {
                if (item.shown() === true) {
                    tabList.push(item);
                }
            }
            return tabList;
        },
        maxPercentage() {
            const percent = Decimal.log10(this.maxMoney.add(1)) / 
                            Decimal.log10(this.database.constants.goal) * 100;
            return this.format(percent);
        }
    },
    methods: {
        switchTab(tab) {
            this.currentTab = tab;
            this.update();
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
        },
        update() {
            this.money = database.money.get();
            this.maxMoney = database.stats.maxMoneyThisApocalypse();

            this.$refs.buttons.update();
            this.$refs[this.currentTab][0].update();
        }
    },
    mounted() {
        this.switchTab(this.tabs[0].name);
        this.mountHotkeys();

        this.update();
        setInterval(() => {
            this.update();
        }, 25);
        setInterval(gameloop, 25);
    }
});

