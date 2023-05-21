Vue.component("ApocalypsesTab", {
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
    <div class="tab">
        <div v-for="apocalypse in apocalypsesList" class="apocalypse-info">
            <span class="apocalypse-name">Apocalypse {{apocalypse.level}}: {{apocalypse.text.name}}</span>
            <span class="apocalypse-info-subheading">Destructions</span>
            <div v-for="nerf in apocalypse.text.nerfs" class="apocalypse-desc">
                {{nerf}}
            </div>
            <span class="apocalypse-info-subheading">Revelations</span>
            <div v-for="buff in apocalypse.text.buffs" class="apocalypse-desc">
                {{buff}}
            </div>
        </div>
    </div>`
});