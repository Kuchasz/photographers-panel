export const randomElement = <T>(arr: T[]) => {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
};

export const nextElement = <T>(arr: T[], current: T) => {
    const index = arr.indexOf(current);
    return index === arr.length - 1 ? arr[0] : arr[index + 1];
};

export const range = (itemsNumber: number) => Array.from(Array(itemsNumber), (_, k) => k);

export const zip = <T1, T2, T3>(left: T1[], right: T2[], map: (l: T1, r: T2) => T3): T3[] => {
    if (left.length !== right.length) throw new Error('Arrays length are not equal');

    return left.map((value, index) => map(value, right[index]));
};

export const sort = <T>(arr: T[], fn: (x: T) => number) => {
    const ar = [...arr];
    ar.sort((a, b) => fn(b) - fn(a));

    return ar;
};

export const sum = <T>(arr: T[], selector: (item: T) => number) => arr.reduce((sum, curr) => sum + selector(curr), 0);

export const first = <T>(items: T[], predicate: (item: T) => boolean = () => true) => items.filter(predicate)[0];

export const last = <T>(items: T[], predicate: (item: T) => boolean = () => true) =>
    items.filter(predicate).reverse()[0];

export const includesAny = <T>(left: T[], right: T[]): boolean =>
    right.length === 0 ? true : right.some((r) => left.includes(r));

export const includesAll = <T>(left: T[], right: T[]): boolean => right.every((l) => left.includes(l));

export const all = <T>(items: T[], predicate: (item: T) => boolean) =>
    items.reduce((acc, cur) => acc && predicate(cur), true);

export const union = <T>(left: T[], right: T[]): T[] => [...new Set<T>([...left, ...right])];

export const distinctBy = <T, U>(items: T[], by: (item: T) => U) => {
    const uniqKeys = new Set<U>();
    const result = [] as T[];

    for (const item of items) {
        const key = by(item);
        if (!uniqKeys.has(key)) {
            uniqKeys.add(key);
            result.push(item);
        }
    }

    return result;
};

export const replace = <T, U>(items: T[], oldItem: T, newItem: T, comparator: (item: T) => U) => {
    const realItem = items.filter((i) => comparator(oldItem) === comparator(i))[0];

    if (!realItem) return items;

    const index = items.indexOf(realItem);
    return Object.assign(items.slice(), { [index]: newItem });
};
