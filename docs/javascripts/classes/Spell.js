class Spell {

    constructor(id, config) {
        this.id = id;
        this.name = config.name;
        this.requiredApocalypseLevel = config.requiredApocalypseLevel;
        this.requiredMoney = config.requiredMoney ?? new Decimal(0);
        this.levelCap = config.levelCap;
        this._durationFunction = config._durationFunction;
        this._descFunction = config._descFunction;
        this._costFunction = config._costFunction;
        this._effectFunction = config._effectFunction;
        this.defaultEffect = config.defaultEffect;
        this.displayEffect = config.displayEffect ?? false;
        this.effectPrefix = config.effectPrefix ?? null;
        this.exclusiveWith = config.exclusiveWith ?? [];
    }

    isVisible() {
        return database.apocalypses.getApocalypseLevel() >= this.requiredApocalypseLevel;
    }

    isUnlocked() {
        return database.apocalypses.getApocalypseLevel() >= this.requiredApocalypseLevel && 
        database.stats.maxMoneyThisApocalypse().gte(this.requiredMoney);
    }

    getLevel() {
        return player.spells.spells[this.id].level;
    }

    getTimer() {
        return player.spells.spells[this.id].timer;
    }

    tickTimer(dt) {
        player.spells.spells[this.id].timer = Math.max(0, player.spells.spells[this.id].timer - dt);
    }

    isAuto() {
        return player.spells.spells[this.id].auto;
    }

    toggleAuto() {
        player.spells.spells[this.id].auto = !player.spells.spells[this.id].auto;
    }

    getDuration() {
        return this._durationFunction(this.getLevel());
    }

    getDesc() {
        return this._descFunction(this.getLevel());
    }

    getCost() {
        return this._costFunction(this.getLevel());
    }

    getEffect() {
        return this._effectFunction(this.getLevel(), this.getTimer());
    }

    appliedEffect() { 
        return this.isActivated() ? this.getEffect() : this.defaultEffect; 
    }

    canActivate() {
        if (!this.isUnlocked() || 
            this.isActivated() || 
            database.spells.getMana().lt(this.getCost())) {
            return false;
        }
        for (const exclusiveId of this.exclusiveWith) {
            if (database.spells.getSpell(exclusiveId).isActivated()) {
                return false;
            }
        }
        return true;
    }

    isActivated() {
        return this.getTimer() > 0;
    }
    
    activate() {
        if (this.canActivate()) {
            database.spells.subMana(this.getCost());
            player.spells.spells[this.id].timer = this.getDuration();
        }
    }

    isBuffUnlocked() {
        return database.manaShop.hasUpgrade(1);
    }
    
    canBuff() {
        return this.isBuffUnlocked() && !this.isActivated() && this.getLevel() < this.levelCap;
    }

    canNerf() {
        return this.isBuffUnlocked() && !this.isActivated() && this.getLevel() > 1;
    }

    buff() { 
        if (this.canBuff()) player.spells.spells[this.id].level++; 
    }

    nerf() { 
        if (this.canNerf()) player.spells.spells[this.id].level--; 
    }

    buff5() { 
        if (this.canBuff()) {
            player.spells.spells[this.id].level = Math.min(this.levelCap, player.spells.spells[this.id].level + 5);
        } 
    }

    nerf5() { 
        if (this.canNerf()) {
            player.spells.spells[this.id].level = Math.max(1, player.spells.spells[this.id].level - 5);
        } 
    }

    reset() {
        const spellObj = player.spells.spells[this.id];
        spellObj.level = 1;
        spellObj.auto = false;
        spellObj.timer = 0;
    }
}
