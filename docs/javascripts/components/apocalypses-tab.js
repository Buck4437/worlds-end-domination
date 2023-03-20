Vue.component("apocalypses-tab", {
    data() {
        return {
            apocalypses: database.apocalypses,
            format: toSci
        };
    },
    computed: {
        apocalypsesList() {
            return this.apocalypses.all().filter(x => this.apocalypses.getApocalypseLevel() >= x.level);
        }
    },
    template: `
    <div>
        <div v-for="apocalypse in apocalypsesList" class="apocalypse-info">
            <span class="apocalypse-name">Apocalypse {{apocalypse.level}}: {{apocalypse.text.name}}</span>
            <i class="apocalypse-nerf-desc">{{apocalypse.text.nerfs}}</i>
            <i class="apocalypse-info-revelation">Revelations</i>
            <i class="apocalypse-buff-desc">{{apocalypse.text.buffs}}</i>
        </div>
    </div>`
});