export const randomElement = <T>(arr: T[]) => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

export const range = (itemsNumber: number) => Array.from(Array(itemsNumber));