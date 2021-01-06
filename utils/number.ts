export const withMinLength = (number: number, minLength: number) =>
    new Array(minLength - String(number).length + 1).join("0") + number;

export const inRange = (min: number, max: number, number: number): boolean => min <= number && number < max;