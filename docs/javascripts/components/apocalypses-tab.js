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
            <i class="apocalypse-info-subheading">Disasters</i>
            <ul>
                <li v-for="nerf in apocalypse.text.nerfs">
                    <i class="apocalypse-nerf-desc">{{nerf}}</i>
                </li>
            </ul>
            <i class="apocalypse-info-subheading">Revelations</i>
            <ul>
                <li v-for="buff in apocalypse.text.buffs">
                    <i class="apocalypse-buff-desc">{{buff}}</i>
                </li>
            </ul>
        </div>
    </div>`
});