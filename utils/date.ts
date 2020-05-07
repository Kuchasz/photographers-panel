import {withMinLength} from "./number";

export const addMonths = (date: Date, months: number) => {
    const finalDate = new Date(date);
    finalDate.setMonth(date.getMonth() + months);

    return finalDate;
}

export const addDays = (date: Date, days: number) => {
    var finalDate = new Date(date);
    finalDate.setDate(date.getDate() + days);

    return finalDate;
}

export const getDateString = (date: Date) => {
    const month = withMinLength(date.getMonth() + 1, 2);
    const day = withMinLength(date.getDate(), 2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

export const getDayAndMonth = (date: Date) => {
    const month = withMinLength(date.getMonth() + 1, 2);
    const day = withMinLength(date.getDate(), 2);
    return `${day}/${month}`;
}

export const getDateRange = (startDate: Date, endDate: Date) => {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= endDate) {
        dateArray.push(new Date (currentDate));
        currentDate = addDays(currentDate, 1);
    }
    return dateArray;
}

export const getYear = (date: Date) => date.getFullYear();