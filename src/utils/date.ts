export const addMonths = (date: Date, months: number) => {
    const finalDate = new Date(date);
    finalDate.setMonth(finalDate.getMonth() - 1);

    return finalDate;
}