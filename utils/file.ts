export const readUrl = (file: File): Promise<string> => {
    return new Promise<string>((res, rej) => {
        const reader = new FileReader();

        reader.onload = (ev) => {
            res(reader.result as string);
        };

        reader.onerror = (ev) => {
            rej(reader.error);
        };

        reader.readAsDataURL(file);
    });
};
