const SAVE_NAME = "Buck4437_WorldsEndDomination_Save";

function saveUpdater(old) {
    if (old.saveVersion === undefined) {
        old.saveVersion = 1;
    }
    return old;
}

function saveFixer(obj, def, update = false) {

    if (update) {
        obj = saveUpdater(obj);
    }

    let data = {};
    if (obj === null) obj = {};
    if (Array.isArray(def)) {
        if (def.length === 0) {
            return Array.isArray(obj) ? obj : def;
        }
        data = [];
    }

    for (const key in def) {
        if (obj[key] === undefined || obj[key] === "NaN") {
            data[key] = def[key];
        } else if (typeof obj[key] === "string" && def[key] instanceof Decimal) {
            data[key] = new Decimal(obj[key]);
        } else if (typeof obj[key] !== typeof def[key]) {
            data[key] = def[key];
        } else if (typeof obj[key] === "object" && typeof def[key] === "object") {
            data[key] = saveFixer(obj[key], def[key]);
        } else {
            data[key] = obj[key];
        }
    }

    return data;
}

if (localStorage.getItem(SAVE_NAME) !== null) {
    const data = JSON.parse(localStorage.getItem(SAVE_NAME));
    const fixedData = saveFixer(data, window.player, true);

    window.player = fixedData;
}