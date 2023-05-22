Vue.component("TopBarButtons", {
    data() {
        return {
            database,
            player,
            format: toSci,
            getCssVariable
        };
    },
    computed: {
        formattedManaGain() {
            if (database.spells.decimalGain().lt(100)) {
                const intgral = database.spells.gainOnConversion().toString();
                const decimal = Math.floor(database.spells.decimalGain().toNumber() % 1 * 10);
                return `
    <span class="mana-gain-integral">${intgral}</span><span class="grey-out mana-gain-decimal">.${decimal}</span>`;
            }
            return `<span class="mana-gain-integral">${this.format(database.spells.gainOnConversion(), 2, 0)}</span>`;
        },
        manaCooldown() {
            return player.spells.convertCooldown / database.spells.cooldown() * 100;
        },
        manaClass() {
            return {
                "disabled": !database.spells.canConvert()
            };
        }
    },
    method: {
        convert() {
            database.spells.convert();
        }
    },
    template: `
    <div class="top-bar-layer-3 top-bar-layer">
        <button v-if= "database.apocalypses.getApocalypseLevel() == 0"
                @click="player.apocalypseLevel = 1">Cheat to Apocalypse 1 (Temporary)</button>
        <button v-if="database.apocalypses.getApocalypseLevel() >= 1"
                class="mana-convert-btn"
                @click="convert"
                :class="manaClass">
            <span>Convert Money to Mana</span>
            <span>Gain <span class="gain" v-html="formattedManaGain"></span> Mana.</span>
            <progress-bar class="mana-cooldown-bar"
                :percentage="manaCooldown"
                :color="getCssVariable('--color-mana')"
                :background-color="getCssVariable('--progress-background')"></progress-bar>
        </button>
    </div>`
});