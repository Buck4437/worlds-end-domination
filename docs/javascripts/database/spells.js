// Cost is measured in mana / second
// Level ranges from 1 - 100
database.spells = {
    unlocked() {
        return database.apocalypses.getApocalypseLevel() >= 1 && database.stats.maxMoneyThisApocalypse().gte("1e8");
    },
    reset() {
        this.setMana(new Decimal(0));
        player.spells.convertCooldown = 0;
        for (const spell of this.all) {
            spell.reset();
        }
    },
    _data: {
        spells: [
            null,
            {
                name: "Money Multiplication",
                requiredApocalypseLevel: 1,
                levelCap: 15,
                _durationFunction: level => 5,
                _descFunction(level) {
                    return `Multiply the production of all buildings by x${toSci(this._effectFunction(level))}`;
                },
                _costFunction(level) {
                    return Decimal.pow(5, level - 1);
                },
                defaultEffect: new Decimal(1),
                _effectFunction(level, remainingTime) {
                    const base = Decimal.pow(6, level);
                    return base.pow(database.spells.getSpell(3).appliedEffect());
                }
            },
            {
                name: "Ethereal Expansion",
                requiredApocalypseLevel: 1,
                requiredMoney: new Decimal("1e13"),
                levelCap: 5,
                _durationFunction: level => 10,
                _descFunction(level) {
                    return `Multiply mana gain by x${toSci(this._effectFunction(level))}`;
                },
                _costFunction(level) {
                    return Decimal.pow(50, level - 1).times(1000);
                },
                defaultEffect: new Decimal(1),
                _effectFunction(level, remainingTime) {
                    const base = Decimal.pow(5, level);
                    return base.pow(database.spells.getSpell(3).appliedEffect());
                }
            },
            {
                name: "Arcane Amplification",
                requiredApocalypseLevel: 1,
                requiredMoney: new Decimal("1e30"),
                levelCap: 6,
                _durationFunction: level => 7.5,
                _descFunction(level) {
                    return `Money Multiplication and Ethereal Expansion multiplier is raised to the power of` + 
                    ` ^${toSci(this._effectFunction(level))}`;
                },
                _costFunction(level) {
                    return Decimal.pow(1e3, level - 1).times(1e6);
                },
                defaultEffect: new Decimal(1),
                _effectFunction(level, remainingTime) {
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
                requiredMoney: new Decimal("1e5"),
                levelCap: 6,
                _durationFunction: level => 7.5,
                _descFunction(level) {
                    return `Increase production of (building) by ???` + 
                    ` ^${toSci(this._effectFunction(level))}`;
                },
                _costFunction(level) {
                    return Decimal.pow(1e3, level - 1).times(1e6);
                },
                defaultEffect: new Decimal(1),
                _effectFunction(level, remainingTime) {
                    // 1.4 => 1.5 => 1.7 => 2.1 => 2.9 => 4.2
                    if (level < 6) {
                        return Decimal.add(1.3, 0.1 * 2 ** (level - 1));
                    }
                    return new Decimal(4.2);
                }
            },
            // {
            //     name: "Spell 4",
            //     requiredApocalypseLevel: 2,
            //     levelCap: 3,
            //     _durationFunction: level => 30,
            //     _descFunction(level) {
            //         return `Multiply all buildings by x${toSci(this._effectFunction(level, 30))}
            //             in the first 10 seconds, 
            //             x${toSci(this._effectFunction(level, 20))} for the remaining duration.`;
            //     },
            //     _costFunction(level) {
            //         return Decimal.pow(1000, level - 1).times(100);
            //     },
            //     defaultEffect: new Decimal(1),
            //     _effectFunction(level, remainingTime) {
            //         if (remainingTime > this.getDuration(level) - 10) {
            //             return Decimal.pow(10, level);
            //         }
            //         return Decimal.pow(0.25, level);
            //     },
            //     displayEffect: true,
            //     effectPrefix: "x",
            //     exclusiveWith: [5]
            // },
        ]
    },
    decimalGain() {
        const money = database.stats.maxMoneyThisReset();

        const baseRequirement = new Decimal("1e8");
        if (money.lt(baseRequirement)) {
            return new Decimal(0);
        }

        // ((log(money/10 + 1) + 1)^3 - 1) / 10
        const base = Decimal.pow(Decimal.log10(money.div(10).add(1)) + 1, 3).sub(1).div(10);

        // Extra bonus after 1e180: (log(money/1e180 + 1)/10)^2 + 1
        const extra = Decimal.pow(Decimal.log10(money.div(1e180).add(1)) / 10, 2).add(1);

        const multi = new Decimal(1).times(database.spells.getSpell(2).appliedEffect());
        return base.times(extra).times(multi);
    },
    gainOnConversion() {
        return this.decimalGain().floor();
    },
    canConvert() {
        const baseRequirement = new Decimal("1e8");
        if (database.stats.maxMoneyThisReset().lt(baseRequirement)) {
            return false;
        }

        return this.unlocked() && this.gainOnConversion().gt(0) && player.spells.convertCooldown <= 0;
    },
    cooldown() {
        return 1;
    },
    convert() {
        if (!this.canConvert()) return;
        if (player.settings.manaConfirmation) {
            if (!confirm(
                "This will reset your money, buildings and building upgrades." +
                "Do you want to proceed? (You can disable this in the settings)"
            )) return;
        }

        const gain = this.gainOnConversion();

        database.money.reset();
        database.buildings.reset();
        database.upgrades.reset();
        database.stats.manaReset();

        if (database.manaShop.hasUpgrade(5)) {
            database.money.set(new Decimal("100"));
        }

        this.addMana(gain);
        player.spells.convertCooldown = this.cooldown();
    },
    all: [],
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
        return this.all[id - 1];
    }
};

// Populate spells list
(function() {
    for (let i = 1; i < database.spells._data.spells.length; i++) {
        database.spells.all.push(
            new Spell(id = i, config = database.spells._data.spells[i])
        );
    }
}());