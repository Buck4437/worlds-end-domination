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
        }
    },
    template: `
    <div>
        <div>
            <div v-for="spell in spells" class="spell-con">
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
                <button class="spell-buff-btn" @click="spell.buff()"
                        :class="{
                            'green': spell.canBuff(),
                            'disabled': !spell.canBuff(),
                        }">
                    +
                </button>
                <button class="spell-nerf-btn" @click="spell.nerf()"
                        :class="{
                            'red': spell.canNerf(),
                            'disabled': !spell.canNerf(),
                        }">
                    -
                </button>
                <br>
                <span class="spell-name">{{spell.name}}:</span>
                <span class="spell-desc" v-html="spell.getDesc()"></span><br>
                <span v-if="spell.exclusiveWith.length != 0"  class="spell-cost">
                    Exclusive with: 
                    {{spell.exclusiveWith.map(x => database.spells.getSpell(x).name).join(", ")}}<br>
                </span>
                <span class="spell-cost">Duration: {{format(spell.getDuration())}}s</span><br>
                <span class="spell-cost">
                    Cost: {{format(spell.getCost(), 2, 0)}} mana
                </span><br>
                <span class="spell-cost">Timer: {{format(spell.getTimer())}}s</span><br>
                <span v-if="spell.displayEffect" class="spell-cost">
                    Current: {{spell.effectPrefix}}{{format(spell.apply())}}
                </span><br>
                
            </div>
        </div>
    </div>`
});
