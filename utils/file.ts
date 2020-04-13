type ReadResult = { url: string; file: File };
export const read = (file: File): Promise<ReadResult> => {
    return new Promise<ReadResult>((res, rej) => {
        const reader = new FileReader();

        reader.onload = (ev) => {
            res({ url: reader.result as string, file });
        };

        reader.onerror = (ev) => {
            rej(reader.error);
        };

        reader.readAsDataURL(file);
    });
};
