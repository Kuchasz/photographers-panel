export const randomElement = <T>(arr: T[]) => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
};

export const range = (itemsNumber: number) => Array.from(Array(itemsNumber));

export const zip = <T1, T2, T3>(left: T1[], right: T2[], map: (l: T1, r: T2) => T3): T3[] => {
    if (left.length !== right.length) throw new Error("Arrays length are not equal");

    return left.map((value, index) => map(value, right[index]));
};

export const first = <T>(items: T[], predicate: (item: T) => boolean) => items.filter(predicate)[0];

export const includesAny = <T>(left: T[], right: T[]): boolean => right.length === 0 ? true : right.some(r => left.includes(r));

export const includesAll = <T>(left: T[], right: T[]): boolean => right.every(l => left.includes(l));

export const distinctBy = <T, U>(items: T[], by: (item: T) => U) => {
    const uniqKeys = new Set<U>();
    const result = [] as T[];

    for(const item of items){
        const key = by(item);
        if(!uniqKeys.has(key)){
            uniqKeys.add(key);
            result.push(item);
        }
    }

    return result;
};
