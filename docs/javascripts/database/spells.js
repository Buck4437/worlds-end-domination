// Cost is measured in mana / second
// Level ranges from 1 - 100
database.spells = {
    unlocked() {
        return database.apocalypses.getApocalypseLevel() >= 1;
    },
    _data: {
        spells: [
            null,
            {
                name: "Spell 1",
                requiredApocalypseLevel: 1,
                levelCap: 15,
                getDuration: level => 5,
                getDesc(level) {
                    return `Multiply all buildings by x${toSci(this.effect(level))}`;
                },
                cost(level) {
                    return Decimal.pow(5, level - 1);
                },
                defaultEffect: new Decimal(1),
                effect(level, timer) {
                    const base = Decimal.pow(6, level);
                    return base.pow(database.spells.getSpell(3).appliedEffect());
                }
            },
            {
                name: "Spell 2",
                requiredApocalypseLevel: 1,
                levelCap: 5,
                getDuration: level => 10,
                getDesc(level) {
                    return `Multiply mana gain by x${toSci(this.effect(level))}`;
                },
                cost(level) {
                    return Decimal.pow(50, level - 1).times(1000);
                },
                defaultEffect: new Decimal(1),
                effect(level, timer) {
                    const base = Decimal.pow(5, level);
                    return base.pow(database.spells.getSpell(3).appliedEffect());
                }
            },
            {
                name: "Spell 3",
                requiredApocalypseLevel: 1,
                levelCap: 6,
                getDuration: level => 7.5,
                getDesc(level) {
                    return `Spell 1 and Spell 2 multiplier ^${toSci(this.effect(level))}`;
                },
                cost(level) {
                    return Decimal.pow(1e3, level - 1).times(1e6);
                },
                defaultEffect: new Decimal(1),
                effect(level, timer) {
                    // 1.4 => 1.5 => 1.7 => 2.1 => 2.9 => 4.2
                    if (level < 6) {
                        return Decimal.add(1.3, 0.1 * 2 ** (level - 1));
                    }
                    return new Decimal(4.2);
                }
            },
            {
                name: "Spell 4",
                requiredApocalypseLevel: 2,
                levelCap: 3,
                getDuration: level => 30,
                getDesc(level) {
                    return `Multiply all buildings by x${toSci(this.effect(level, 30))} in the first 10 seconds, 
                        x${toSci(this.effect(level, 20))} for the remaining duration.`;
                },
                cost(level) {
                    return Decimal.pow(1000, level - 1).times(100);
                },
                defaultEffect: new Decimal(1),
                effect(level, remainingTime) {
                    if (remainingTime > this.getDuration(level) - 10) {
                        return Decimal.pow(10, level);
                    }
                    return Decimal.pow(0.25, level);
                },
                displayEffect: true,
                effectPrefix: "x",
                exclusiveWith: [5]
            },
            {
                name: "Spell 5",
                requiredApocalypseLevel: 2,
                levelCap: 3,
                getDuration(level) {
                    return 30 + level * 120;
                },
                getDesc(level) {
                    return `Multiply all buildings by x1~${toSci(this.effect(level, 30))},
                        max out after ${this.getDuration(level) - 30} seconds.`;
                },
                cost(level) {
                    return Decimal.pow(1000, level - 1).times(100);
                },
                defaultEffect: new Decimal(1),
                effect(level, remainingTime) {
                    // Effect increases exponentially (x10 every 120 seconds), until the last 30 seconds
                    if (remainingTime <= 30) {
                        return Decimal.pow(10, (this.getDuration(level) - 30) / 120);
                    }
                    return Decimal.pow(10, (this.getDuration(level) - remainingTime) / 120);
                },
                displayEffect: true,
                effectPrefix: "x",
                exclusiveWith: [4]
            },
        ]
    },
    decimalGain() {
        // ((log(money/10 + 1) + 1)^3 - 1) / 10
        const base = Decimal.pow(Decimal.log10(player.maxMoney.div(10).add(1)) + 1, 3).sub(1).div(10);

        // Extra bonus after 1e180: (log(money/1e180 + 1)/10)^2 + 1
        const extra = Decimal.pow(Decimal.log10(player.maxMoney.div(1e180).add(1)) / 10, 2).add(1);

        const multi = new Decimal(1).times(database.spells.getSpell(2).appliedEffect());
        return base.times(extra).times(multi);
    },
    gainOnConversion() {
        return this.decimalGain().floor();
    },
    canConvert() {
        return this.unlocked() && this.gainOnConversion().gt(0) && player.spells.convertCooldown <= 0;
    },
    convert() {
        if (!this.canConvert()) return;
        const gain = this.gainOnConversion();

        database.player.reset();
        database.buildings.reset();
        database.upgrades.reset();

        if (database.manaShop.hasUpgrade(4)) {
            database.player.setMoney(new Decimal("100"));
        }

        this.addMana(gain);
        player.spells.convertCooldown = 1;
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
    getMana() {
        return player.spells.mana;
    },
    addMana(n) {
        player.spells.mana = player.spells.mana.add(n);
    },
    subMana(n) {
        player.spells.mana = player.spells.mana.sub(n);
    },
    setMana(n) {
        player.spells.mana = new Decimal(n);
    },
    getSpell(id) {
        if (id <= 0 || id >= this._data.spells.length) return null;
        const spell = this._data.spells[id];
        
        return {
            id,
            name: spell.name,
            requiredApocalypseLevel: spell.requiredApocalypseLevel,
            levelCap: spell.levelCap,
            getDuration() { return spell.getDuration(this.getLevel()); },
            getDesc() { return spell.getDesc(this.getLevel()); },
            getCost() { return spell.cost(this.getLevel()); },
            getEffect() { return spell.effect(this.getLevel(), this.getTimer()); },
            defaultEffect: spell.defaultEffect,
            displayEffect: spell.displayEffect ?? false,
            effectPrefix: spell.effectPrefix ?? null,
            appliedEffect() { return this.isActivated() ? this.getEffect() : this.defaultEffect; },

            getLevel: () => player.spells.spells[id].level,
            getTimer: () => player.spells.spells[id].timer,
            tickTimer: dt => player.spells.spells[id].timer = Math.max(0, player.spells.spells[id].timer - dt),
            isAuto: () => player.spells.spells[id].auto,
            toggleAuto: () => player.spells.spells[id].auto = !player.spells.spells[id].auto,
            isActivated() { return this.getTimer() > 0; },
            activate() {
                if (this.isActivated()) return;
                for (const exclusiveId of this.exclusiveWith) {
                    if (database.spells.getSpell(exclusiveId).isActivated()) {
                        return;
                    }
                }
                const manaCost = this.getCost();
                if (database.spells.getMana().gte(manaCost)) {
                    database.spells.subMana(manaCost);
                    player.spells.spells[id].timer = this.getDuration();
                }
            },

            canBuff() { return !this.isActivated() && this.getLevel() < this.levelCap; },
            canNerf() { return !this.isActivated() && this.getLevel() > 1; },
            buff() { if (this.canBuff()) player.spells.spells[id].level++; },
            nerf() { if (this.canNerf()) player.spells.spells[id].level--; },
            
            exclusiveWith: spell.exclusiveWith ?? []
        };
    },

};