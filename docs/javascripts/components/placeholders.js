Vue.component("options-tab", {
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

Vue.component("blobmegathink-tab", {
    data() {
        return {
            database,
            format: toSci
        };
    },
    template: `
    <div>
        Placeholder 2
    </div>`
});
