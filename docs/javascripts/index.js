import { createApp } from "vue";

import database from "database";
import gameloop from "./gameloop.js";

import ApocalypsesTab from "components/ApocalypsesTab.js";
import BuildingsTab from "components/BuildingsTab.js";
import { OptionsTab, BlobmegathinkTab } from "components/Placeholders.js";

const player = createPlayerObject();
// // eslint-disable-next-line no-unused-vars
const app = createApp({
    data() {
        return {
            player,
            database,
            format: toSci,
            currentTab: "",
            version: "v0.0.0"
        };
    },
    components: {
        ApocalypsesTab,
        BuildingsTab,
        BlobmegathinkTab,
        OptionsTab
    },
    computed: {
        tabs() {
            const data = [
                ["Buildings", -1],
                ["BLOBMEGATHINK", 1],
                ["Apocalypses", 1],
                ["Options", -1]
            ];
            const tabList = [];
            const apocalypseLevel = this.database.apocalypses(this.player).getApocalypseLevel();
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
            return `${name.toLowerCase().replace(" ", "-")}-tab`;
        }
    },
    watch: {
        player: {
            deep: true,
            // eslint-disable-next-line no-empty-function
            handler() {}
        }
    },
    mounted() {
        this.switchTab(this.tabs[0]);
        setInterval(() => {
            gameloop(this.player);
        }, 25);
    }
});

app.config.globalProperties.database = database;

// Storing the root component to global for debugging purpose
window.app = app.mount("#app");
