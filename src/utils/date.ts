export const addMonths = (date: Date, months: number) => {
    const finalDate = new Date(date);
    finalDate.setMonth(finalDate.getMonth() + months);

    return finalDate;
}

export const getDateString = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};