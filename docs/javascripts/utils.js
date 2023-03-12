"use strict";

// Number formatting

function toSci(num, dpSci = 2, dpNorm = 2, useNorm = 1000) {
    if (typeof num === "number") num = new Decimal(num)
    if(num.lt(useNorm)) {
        return toFixedTrunc(num.toNumber(), dpNorm)
    }
    return toFixedTrunc(num.mantissa, dpSci) + "e" + num.exponent
}

// Used for sci formatting
// Ask stackoverflow
function toFixedTrunc(x, n) {
  const v = (typeof x === 'string' ? x : x.toString()).split('.');
  if (n <= 0) return v[0];
  let f = v[1] || '';
  if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
  while (f.length < n) f += '0';
  return `${v[0]}.${f}`
}

function toTime(ts) {
    let d = Math.floor(ts / 86400);
    ts -= d * 86400;
    let h = Math.floor(ts / 3600);
    ts -= h * 3600
    let m = Math.floor(ts / 60);
    let s = Math.floor(ts - 60 * m);

    let hoursDisplay = [h, m, s].map(x => String(x).padStart(2, "0")).join(":");
    if (d === 0) {
        return hoursDisplay
    }
    return `${d} ${d === 1 ? "day" : "days"}, ` + hoursDisplay;
}

// Formula

Math.radian = deg => deg / 180 * Math.PI;

// File management

function copyText(text){
    //source: https://www.30secondsofcode.org/blog/s/copy-text-to-clipboard-with-javascript

    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    try{
        document.execCommand('copy');
        console.log("Auto-copy successful");
    } catch(e){
        console.log("Auto-copy unsuccessful");
        prompt("Failed to Auto-copy. Please copy manually:", text);
    }
    document.body.removeChild(el);
}

// Theming

var themes = ["Light", "Dark"];

function getTheme() {
    let data = localStorage.getItem(SAVE_NAME);
    if (data === null) {
        return 0
    }

    let theme = Number(JSON.parse(data).settings.theme);
    if (isNaN(theme) || theme >= themes.length) {
        return 0;
    }
    return theme;
}

function loadTheme() {
    let theme = getTheme();
    setTheme(theme);
    return theme;
}

function setTheme(index) {
    for (let theme of themes) {
        document.body.classList.remove(theme.toLowerCase() + "-theme");
    }
    document.body.classList.add(themes[index].toLowerCase() + "-theme");
}

function getCssVar(name) {
    return getComputedStyle(document.body).getPropertyValue(name);
}

// Validation

function isValidSave(save){
    try {
        JSON.parse(window.atob(save))
        return true
    }
    catch (e){
        return false
    }
}

function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

function isNumber(val) {
    return typeof val === 'number' && isFinite(val)
}

function isNumberString(str) {
    if (/^ *$/.test(str)) return false

    let num = Number(str)
    return !isNaN(num)
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
