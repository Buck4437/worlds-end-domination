Vue.component("OptionsTab", {
    data() {
        return {
            database,
            format: toSci
        };
    },
    template: `
    <div>
        Placeholder 1
    </div>`
});

Vue.component("AboutTab", {
    data() {
        return {
            database,
            format: toSci
        };
    },
    template: `
    <div>
        This is where I will add How To Play, Hotkeys, etc.<br>
        Hotkeys (I'll add progressive display later):<br>
        Building 1-4: 1-4<br>
        Max All: A<br>
        Convert Money to Mana: M<br>
    </div>`
});
