const SEED = 16777215;
const FACTOR = 49979693;

export const colorFromString = (text: string) => {
    var b = 1;
    var d = 0;
    var f = 1;
    if (text.length > 0) {
        for (var i = 0; i < text.length; i++)
            text[i].charCodeAt(0) > d && (d = text[i].charCodeAt(0)),
                (f = parseInt((SEED / d).toString())),
                (b = (b + text[i].charCodeAt(0) * f * FACTOR) % SEED);
    }
    var hex = ((b * text.length) % SEED).toString(16);
    hex = hex.padEnd(6, hex);

    return `#${hex}`;
}

export const invertColor = (hex: string) => {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);

    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
        ? '#000000'
        : '#FFFFFF';
}