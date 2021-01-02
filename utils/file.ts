type ReadResult = { url: string; file: File };
export const read = (file: File): Promise<ReadResult> => {
    return new Promise<ReadResult>((res, rej) => {
        const reader = new FileReader();

        const img = document.createElement("img");

        reader.onload = (ev) => {
            img.src = reader.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0);

                const MAX_WIDTH = 100;
                const MAX_HEIGHT = 100;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                const dataurl = canvas.toDataURL("image/png");

                res({ url: dataurl as string, file });
            };
        };

        reader.onerror = (ev) => {
            rej(reader.error);
        };

        reader.readAsDataURL(file);

        // res({ url: file.name, file });
    });
};

export const formatFileSize = (size: number, precision: number = 2) => {
    const i = size === 0 ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
    const formattedSize = ( size / Math.pow(1024, i) );
    return `${formattedSize.toFixed(precision)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
};

export const getLastBytesPerSecond = (lastBytes: number, lastNow: number, loaded: number) => {
    const calculationTime = new Date().getTime();
    const elapsed = (calculationTime - lastNow) / 1000;
    var uploadedBytes = loaded - lastBytes;
    const lastBytesPerSecond = elapsed ? uploadedBytes / elapsed : 0;

    return { calculationTime, lastBytesPerSecond };
}

export const formatTransfer = (bytesPerSecond: number) => `${formatFileSize(bytesPerSecond, 1)}/s`;