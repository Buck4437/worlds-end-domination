// Number formatting

function toSci(num, dpSci = 2, dpNorm = 2, useNorm = 1000) {
    if (typeof num === "number") {
        return _numberToSci(num, dpSci, dpNorm, useNorm);
    }
    return _decimalToSci(num, dpSci, dpNorm, useNorm);
}

function _numberToSci(num, dpSci, dpNorm, useNorm) {
    return _decimalToSci(new Decimal(num), dpSci, dpNorm, useNorm);
}

function _decimalToSci(num, dpSci, dpNorm, useNorm) {
    if (num.lt(useNorm)) {
        return toFixedTrunc(num.toNumber(), dpNorm);
    }
    return `${toFixedTrunc(num.mantissa, dpSci)}e${num.exponent}`;
}

// Used for sci formatting
// Ask stackoverflow
function toFixedTrunc(x, n) {
    const v = (typeof x === "string" ? x : x.toString()).split(".");
    if (n <= 0) return v[0];
    let f = v[1] || "";
    if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
    while (f.length < n) f += "0";
    return `${v[0]}.${f}`;
}

// Text formatting
function capitalize(string) {
    if (string.length <= 0) {
        return string;
    }
    return string.charAt(0).toUpperCase() + string.substring(1);
}

// File management

function copyText(text) {
    // Source: https://www.30secondsofcode.org/blog/s/copy-text-to-clipboard-with-javascript

    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    try{
        document.execCommand("copy");
        console.log("Auto-copy successful");
    } catch(e) {
        console.log("Auto-copy unsuccessful");
        prompt("Failed to Auto-copy. Please copy manually:", text);
    }
    document.body.removeChild(el);
}

// Misc
function getCssVariable(name) {
    return getComputedStyle(document.body).getPropertyValue(name);
}