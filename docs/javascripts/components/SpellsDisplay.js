Vue.component("SpellsDisplay", {
    data() {
        return {
            database,
            player,
            format: toSci
        };
    },
    computed: {
        spells() {
            return this.database.spells.all();
        },
        progressBarColour() {
            return getCssVariable("--progress-mana");
        },
        backgroundColour() {
            return getCssVariable("--progress-background");
        }
    },
    template: `
    <div>
        <div v-for="spell in spells" class="spell-con">
            <div class="spell-text-display">
                <div class="spell-info-con">
                    <span class="spell-name">{{spell.name}}</span>
                    <span class="spell-desc" v-html="spell.getDesc()"></span>
                    <span :class="{'invisible': spell.exclusiveWith.length <= 0}" class="spell-exclusive">
                        Exclusive with: 
                        {{spell.exclusiveWith.map(x => database.spells.getSpell(x).name).join(", ")}}
                    </span>
                </div>
                <div class="spell-property-con">
                    <span>Cost: {{format(spell.getCost(), 2, 0)}} Mana</span>
                    <span>Duration: {{format(spell.getDuration())}}s</span>
                    <span>Timer: {{format(spell.getTimer())}}s</span>
                    <span :class="{'invisible': !spell.displayEffect}">
                        Current: {{spell.effectPrefix}}{{format(spell.appliedEffect())}}
                    </span>
                </div>
            </div>
            <div class="spell-buttons">
                <div class="spell-use-button-con">
                    <button class="spell-toggle-btn" @click="spell.toggleAuto()"
                            :class="{
                                        'on': spell.isAuto(),
                                        'off': !spell.isAuto(),
                                    }">
                        {{spell.isAuto() ? "Auto On" : "Auto Off"}}
                    </button>
                    <button class="spell-activate-btn" @click="spell.activate()">
                        Activate
                    </button>
                </div>
                <div class="spell-level-adjust">
                    <button class="spell-buff-btn" @click="spell.nerfMax()"
                            :class="{
                                'red': spell.canNerf(),
                                'disabled': !spell.canNerf(),
                            }">
                        -5
                    </button>
                    <button class="spell-nerf-btn" @click="spell.nerf()"
                            :class="{
                                'red': spell.canNerf(),
                                'disabled': !spell.canNerf(),
                            }">
                        -
                    </button>
                    
                    <span class="spell-level">Level {{spell.getLevel()}}</span>

                    <button class="spell-buff-btn" @click="spell.buff()"
                            :class="{
                                'green': spell.canBuff(),
                                'disabled': !spell.canBuff(),
                            }">
                        +
                    </button>
                    <button class="spell-buff-btn" @click="spell.buffMax()"
                            :class="{
                                'green': spell.canBuff(),
                                'disabled': !spell.canBuff(),
                            }">
                        +5
                    </button>
                </div>
            </div>
            <ProgressBar class="spell-progress-bar"
                        :backgroundColor="backgroundColour"
                        :colour="progressBarColour"
                        :percentage="spell.getTimer() / spell.getDuration() * 100"/>
        </div>
    </div>`
});
