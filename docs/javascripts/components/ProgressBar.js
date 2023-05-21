Vue.component("ProgressBar", {
    props: {
        percentage: Number,
        backgroundColor: String,
        colour: String
    },
    computed: {
        barStyle() {
            return {
                "width": `${this.percentage}%`,
                "background-color": this.colour
            };
        },
        conStyle() {
            return {
                "background-color": this.backgroundColor
            };
        }
    },
    template: `
    <div :style="conStyle">
        <div style="height: 100%;" :style="barStyle">
        </div>
    </div>`
});
