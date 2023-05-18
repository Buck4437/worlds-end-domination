// Cost is measured in mana / second
// Level ranges from 1 - 100
database.spells = {
    _data: {
        spells: [
            null,
            {
                name: "Spell 1",
                requiredApocalypseLevel: 1,
                levelCap: 101,
                getDesc(level) {
                    return `Multiply all buildings by x${toSci(this.effect(level))}`;
                },
                cost(level) {
                    return Decimal.pow(10, level - 1).times(5);
                },
                defaultEffect: new Decimal(1),
                effect(level) {
                    return Decimal.pow(4, level);
                }
            },
            {
                name: "Spell 2",
                requiredApocalypseLevel: 1,
                levelCap: 51,
                getDesc(level) {
                    return `Multiply mana gain by x${toSci(this.effect(level))}`;
                },
                cost(level) {
                    return Decimal.pow(10, level - 1).times(5);
                },
                defaultEffect: new Decimal(1),
                effect(level) {
                    return Decimal.pow(2, level);
                }
            },
            // {
            //     name: "Spell 3",
            //     requiredApocalypseLevel: 1,
            //     getDesc() {
            //         return "Placeholder";
            //     },
            //     rate: 0.1,
            //     defaultEffect: new Decimal(1),
            //     effect(level) {
            //         return new Decimal(10);
            //     }
            // }
        ]
    },
    decimalGain() {
        const base = Decimal.pow(player.maxMoney.div(100).add(1), 0.2).sub(1).times(15);
        const multi = new Decimal(1).times(database.spells.getSpell(2).apply());
        return base.times(multi);
    },
    gainOnConversion() {
        return this.decimalGain().floor();
    },
    convert() {
        if (this.gainOnConversion().lte(0)) return;
        const gain = this.gainOnConversion();

        database.player.reset();
        database.buildings.reset();
        database.upgrades.reset();

        player.spells.mana = player.spells.mana.add(gain);
    },
    all() {
        const spells = [];
        for (let i = 1; i < this._data.spells.length; i++) {
            const spell = this.getSpell(i);
            if (database.apocalypses.getApocalypseLevel() >= spell.requiredApocalypseLevel) {
                spells.push(spell);
            }
        }
        return spells;
    },
    getSpell(id) {
        if (id <= 0 || id >= this._data.spells.length) return null;
        const spell = this._data.spells[id];
        
        return {
            id,
            name: spell.name,
            requiredApocalypseLevel: spell.requiredApocalypseLevel,
            levelCap: spell.levelCap,
            getDesc() { return spell.getDesc(this.getLevel()); },
            getCost() { return spell.cost(this.getLevel()); },
            getEffect() { return spell.effect(this.getLevel()); },
            defaultEffect: spell.defaultEffect,
            effectPrefix: spell.effectPrefix,
            apply() { return this.isActivated() ? this.getEffect() : this.defaultEffect; },

            getLevel: () => player.spells.spells[id].level,
            getTimer: () => player.spells.spells[id].timer,
            tickTimer: dt => player.spells.spells[id].timer = Math.max(0, player.spells.spells[id].timer - dt),
            isAuto: () => player.spells.spells[id].auto,
            toggleAuto: () => player.spells.spells[id].auto = !player.spells.spells[id].auto,
            isActivated() { return this.getTimer() > 0; },
            activate() {
                if (this.isActivated()) return;
                const manaCost = this.getCost();
                if (player.spells.mana.gte(manaCost)) {
                    player.spells.mana = player.spells.mana.sub(manaCost);
                    player.spells.spells[id].timer = 5;
                }
            },

            canBuff() { return !this.isActivated() && this.getLevel() < this.levelCap; },
            canNerf() { return !this.isActivated() && this.getLevel() > 1; },
            buff() { if (this.canBuff()) player.spells.spells[id].level++; },
            nerf() { if (this.canNerf()) player.spells.spells[id].level--; }
        };
    },

};