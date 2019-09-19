export const randomElement = <T>(arr: T[]) => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

export const range = (itemsNumber: number) => Array.from(Array(itemsNumber));

export const zip = <T1, T2, T3>(left: T1[], right: T2[], map: (l: T1, r: T2) => T3): T3[] => {
    if(left.length !== right.length)
        throw new Error('Arrays length are not equal');
    
    return left.map((value, index) => map(value, right[index]));
}

export const first = <T>(items: T[], predicate: (item: T) => boolean) => items.filter(predicate)[0];