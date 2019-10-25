import {withMinLength} from "./number";

export const addMonths = (date: Date, months: number) => {
    const finalDate = new Date(date);
    finalDate.setMonth(finalDate.getMonth() + months);

    return finalDate;
}

export const getDateString = (date: Date) => {
    const month = withMinLength(date.getMonth() + 1, 2);
    const day = withMinLength(date.getDate(), 2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};