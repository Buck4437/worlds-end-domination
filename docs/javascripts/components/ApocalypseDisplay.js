Vue.component("ApocalypseDisplay", {
    props: {
        apocalypse: Object
    },
    template: `
    <div class="apocalypse-info">
        <span class="apocalypse-name">Apocalypse {{apocalypse.level}}: {{apocalypse.text.name}}</span>
        <span class="apocalypse-info-subheading">Destructions</span>
        <div v-for="nerf in apocalypse.text.nerfs" class="apocalypse-desc">
            {{nerf}}
        </div>
        <span class="apocalypse-info-subheading">Revelations</span>
        <div v-for="buff in apocalypse.text.buffs" class="apocalypse-desc">
            {{buff}}
        </div>
    </div>`
});