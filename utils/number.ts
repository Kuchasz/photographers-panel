export const withMinLength = (number: number, minLength: number) =>
    new Array(minLength - String(number).length + 1).join("0") + number;
