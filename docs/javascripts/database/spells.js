// Rate is measured in mana / second
database.spells = {
    _data: {
        spells: [
            null,
            {
                name: "Aploxy",
                requiredApocalypseLevel: 1,
                getDesc() {
                    return "Multiply all buildings by x10";
                },
                rate: 0.1,
                defaultEffect: new Decimal(1),
                effect() {
                    return new Decimal(10);
                },
                effectPrefix: "x"
            }
        ]
    },
    gainOnConversion() {
        return Decimal.pow(player.maxMoney.div(100), 0.25);
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
            spells.push(this.getSpell(i));
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
            rate: spell.rate,
            getDesc: spell.getDesc,
            defaultEffect: spell.defaultEffect,
            effect: spell.effect,
            effectPrefix: spell.effectPrefix,
            apply: () => (this.hasUpgrade(n) ? spell.effect() : spell.defaultEffect)
        };
    }
};