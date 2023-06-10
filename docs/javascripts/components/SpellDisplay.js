Vue.component("SpellDisplay", {
    props: {
        spell: Spell
    },
    data() {
        return {
            level: 1,
            desc: "",
            cost: new Decimal(0),
            duration: 0,
            timer: 0,
            appliedEffect: new Decimal(0),
            isAuto: false,
            canActivate: false,
            buffingUnlocked: false,
            canBuff: false,
            canNerf: false,
            format: toSci
        };
    },
    computed: {
        progressBarColour() {
            return getCssVariable("--progress-mana");
        },
        backgroundColour() {
            return getCssVariable("--progress-background");
        }
    },
    methods: {
        update() {
            const spell = this.spell;

            this.level = spell.getLevel();
            this.desc = spell.getDesc();
            this.cost = spell.getCost();
            this.duration = spell.getDuration();
            this.timer = spell.getTimer();
            this.appliedEffect = spell.appliedEffect();

            this.isAuto = spell.isAuto();
            this.canActivate = spell.canActivate();
            this.buffingUnlocked = spell.isBuffUnlocked();
            this.canBuff = spell.canBuff();
            this.canNerf = spell.canNerf();
        },
        getName(spellId) {
            return database.spells.getSpell(spellId).name;
        }
    },
    template: `
    <div class="spell-con">
        <template v-if="spell.isUnlocked()">

        <div class="spell-text-display">
            <div class="spell-info-con">
                <span class="spell-name">{{spell.name}}</span>
                <span class="spell-desc" v-html="desc"></span>
                <span :class="{'invisible': spell.exclusiveWith.length <= 0}" class="spell-exclusive">
                    Exclusive with: 
                    {{spell.exclusiveWith.map(x => getName(x)).join(", ")}}
                </span>
            </div>
            <div class="spell-property-con">
                <span>Cost: {{format(cost, 2, 0)}} Mana</span>
                <span>Duration: {{format(duration)}}s</span>
                <span>Timer: {{format(timer)}}s</span>
                <span :class="{'invisible': !spell.displayEffect}">
                    Current: {{spell.effectPrefix}}{{format(appliedEffect)}}
                </span>
            </div>
        </div>
        <div class="spell-buttons">
            <div class="spell-use-button-con">
                <button class="spell-toggle-btn" @click="spell.toggleAuto()"
                        :class="{
                                    'on': isAuto,
                                    'off': !isAuto,
                                }">
                    Auto: {{isAuto ? "On" : "Off"}}
                </button>
                <button class="spell-activate-btn" @click="spell.activate()"
                        :class="{
                                    'green': canActivate,
                                    'disabled': !canActivate,
                                }">
                                Activate
                </button>
            </div>
            <div class="spell-level-adjust" :class="{'invisible': !buffingUnlocked}">
                <button class="spell-buff-btn" @click="spell.nerf5()"
                        :class="{
                            'red': canNerf,
                            'disabled': !canNerf,
                        }">
                    -5
                </button>
                <button class="spell-nerf-btn" @click="spell.nerf()"
                        :class="{
                            'red': canNerf,
                            'disabled': !canNerf,
                        }">
                    -
                </button>
                
                <span class="spell-level">Level {{level}}</span>

                <button class="spell-buff-btn" @click="spell.buff()"
                        :class="{
                            'green': canBuff,
                            'disabled': !canBuff,
                        }">
                    +
                </button>
                <button class="spell-buff-btn" @click="spell.buff5()"
                        :class="{
                            'green': canBuff,
                            'disabled': !canBuff,
                        }">
                    +5
                </button>
            </div>
        </div>
        <ProgressBar class="spell-progress-bar"
                    :backgroundColor="backgroundColour"
                    :color="progressBarColour"
                    :percentage="timer / duration * 100"/>
        
        </template>

        <template v-else>
            <span class="spell-money-requirement">
                Reach {{format(spell.requiredMoney)}} Money to unlock new spell
            </span>
        </template>
    </div>`
});
