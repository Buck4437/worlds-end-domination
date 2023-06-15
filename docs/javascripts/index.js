// eslint-disable-next-line no-new, no-unused-vars
const app = new Vue({
    el: "#app",
    data: {
        player,
        database,
        money: new Decimal(0),
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
                    shown: () => player.display.spells,
                    class: "mana-tab-btn"
                },
                {
                    name: "Apocalypse",
                    shown: () => apocalypseLevel >= 1 || 
                        database.stats.maxMoneyThisApocalypse().gte(database.constants.goal),
                    class: "apocalypse-tab-btn"
                },
                {
                    name: "Settings",
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
                    case "ArrowLeft": {
                        for (let i = 0; i < this.tabs.length; i++) {
                            if (this.tabs[i].name === this.currentTab) {
                                const tabIndex = (i + this.tabs.length - 1) % this.tabs.length;
                                this.currentTab = this.tabs[tabIndex].name;
                                break;
                            }
                        }
                        break;
                    }
                    case "ArrowRight": {
                        for (let i = 0; i < this.tabs.length; i++) {
                            if (this.tabs[i].name === this.currentTab) {
                                const tabIndex = (i + 1) % this.tabs.length;
                                this.currentTab = this.tabs[tabIndex].name;
                                break;
                            }
                        }
                        break;
                    }
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
        configToastr() {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "300",
                "timeOut": "5000",
                "extendedTimeOut": "3000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "slideDown",
                "hideMethod": "slideUp"
            };
        },
        update() {
            this.money = database.money.get();

            this.$refs.buttons.update();
            this.$refs[this.currentTab][0].update();
        }
    },
    mounted() {
        this.switchTab(this.tabs[0].name);
        this.mountHotkeys();
        this.configToastr();

        this.update();
        
        setInterval(() => {
            this.update();
        }, 25);
        setInterval(gameloop, 25);
        setInterval(() => {
            localStorage.setItem(SAVE_NAME, JSON.stringify(this.player));
            console.log("Game saved!");
            toastr.info("", "Game saved!");
        }, 20000);
    }
});

