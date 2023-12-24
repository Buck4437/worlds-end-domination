Vue.component("TopBarButtons", {
    data() {
        return {
            format: toSci,
            getCssVariable,
            apocalypseLevel: 0,
            unlockedManaConvert: false,
            onManaCooldown: true,
            decimalManaGain: new Decimal(0)
        };
    },
    computed: {
        formattedManaGain() {
            const gain = this.decimalManaGain;
            if (gain.lt(100)) {
                const intgral = gain.floor().toString();
                const decimal = Math.floor(gain.toNumber() % 1 * 10);
                return `
<span class="mana-gain-integral">${intgral}</span><span class="grey-out mana-gain-decimal">.${decimal}</span>`;
            }
            return `<span class="mana-gain-integral">${this.format(gain.floor(), 2, 0)}</span>`;
        },
        manaCooldown() {
            return player.spells.convertCooldown / database.spells.cooldown() * 100;
        },
        manaClass() {
            return {
                "disabled": this.onManaCooldown
            };
        }
    },
    methods: {
        update() {
            this.apocalypseLevel = database.apocalypses.getApocalypseLevel();
            this.unlockedManaConvert = database.spells.unlocked();
            this.decimalManaGain = database.spells.decimalGain();
            this.onManaCooldown = !database.spells.canConvert();
        },
        convert() {
            database.spells.convert();
        }
    },
    template: `
    <div class="top-bar-layer-3 top-bar-layer">
        <button v-if="apocalypseLevel >= 1"
                class="mana-convert-btn"
                @click="convert"
                :class="manaClass">
            <template v-if="this.unlockedManaConvert">
                <span>Convert Money to Mana</span>
                <span>Gain <span class="gain" v-html="formattedManaGain"></span> Mana.</span>
                <progress-bar class="mana-cooldown-bar"
                    :percentage="manaCooldown"
                    :color="getCssVariable('--color-mana')"
                    :background-color="getCssVariable('--progress-background')"></progress-bar>
            </template>
            <template v-else>
                Reach 1e8 Money
            </template>
        </button>
    </div>`
});