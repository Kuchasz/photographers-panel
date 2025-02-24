import React from "react";
import { all } from "@pp/utils/dist/array";
import {
    Badge,
    FlexboxGrid,
    List,
    Loader,
    Nav,
    Popover,
    Progress,
    Whisper
} from "rsuite";
import { 
    ArrowCircleUp, 
    CaretUp, 
    Check, 
    Clock, 
    X 
} from '@phosphor-icons/react';
import { formatFileSize, formatTransfer } from "@pp/utils/dist/file";
import {
    isActive,
    isProcessed,
    isQueued,
    State,
    UploadedImage,
    useUploadedImages
} from "../../state/uploaded-images";
import { ResultType } from "@pp/api/dist/common";
import { translations } from "../../i18n";
import { truncate } from "@pp/utils/dist/string";
import { uploadBlogAsset } from "@pp/api/dist/panel/blog";
import "./styles.less";

const processImages = ({ images, updateImage, finalizeUpload }: State) => {
    if (images.filter((x) => isActive(x.status)).length >= 1) {
        return;
    }

    const imageToProcess = images.filter((x) => isQueued(x.status))[0];
    if (imageToProcess === undefined) {
        return;
    }

    const updateImageToProcess = updateImage(imageToProcess.originId);

    updateImageToProcess({ status: 'uploading' });

    uploadBlogAsset(
        imageToProcess.blogId,
        imageToProcess.file!,
        (params) =>
            updateImageToProcess({
                ...params,
                status: params.processing ? 'processing' : 'uploading',
            }),
        (res) => {
            if (res.type === ResultType.Success) {
                const asset = {
                    ...res.result!,
                    alt: '',
                    blogId: imageToProcess.blogId,
                };
                finalizeUpload(imageToProcess.originId, { status: 'successful', progress: 100 }, asset);
            } else {
                updateImageToProcess({ status: 'failed' });
                console.error(translations.imagesUploader.notUploaded, res.error);
            }
        }
    );
};

useUploadedImages.subscribe(processImages);

const calculateTotalItemsProgress = (items: UploadedImage[]) => {
    const loadedBytes = items.reduce((acc, cur) => acc + cur.loaded, 0);
    const totalBytes = items.reduce((acc, cur) => acc + cur.size, 1);

    return Math.floor((loadedBytes / totalBytes) * 100);
};

const UploadHeader = () => {
    const items = useUploadedImages(
        (x) => getProper(x.images),
        (p, n) => p.reduce((acc, cur) => acc + cur.loaded, 0) === (n as any[]).reduce((acc, cur) => acc + cur.loaded, 0)
    );

    const leftImages = items.filter((x) => isActive(x.status) || isQueued(x.status)).length;
    const totalProgress = calculateTotalItemsProgress(items);

    return (
        <header>
            <Badge
                content={
                    <span>
                        <CaretUp size={16} /> {totalProgress}%
                    </span>
                }
            />
            <span>
                {leftImages > 0
                    ? `${leftImages} ${translations.imagesUploader.leftImages}`
                    : translations.imagesUploader.noItemsLeft}
            </span>
        </header>
    );
};

const getStatusIcon = (image: UploadedImage) => {
    if (isQueued(image.status)) return <Clock size={20} />;

    if (image.status === 'successful') return <Check size={20} style={{ color: '#4caf50' }} />;

    if (image.status === 'failed') return <X size={20} style={{ color: '#f44336' }} />;

    if (image.status === 'processing') return <Loader size="xs" speed="slow" />;

    return formatTransfer(image.lastBytesPerSecond);
};

const getStatus = (image: UploadedImage) => {
    if (image.status === 'failed') return 'fail';
    if (image.status === 'successful') return 'success';

    return undefined;
};

const UploadsListItem = ({ id }: { id: string }) => {
    const item = useUploadedImages((x) => x.images.find((xx) => xx.originId === id));

    if (!item) throw 'that should not happen';

    return (
        <List.Item className={isActive(item.status) ? 'active' : ''} key={item.originId}>
            <FlexboxGrid>
                <FlexboxGrid.Item colspan={1}>
                    <CaretUp size={16} />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={20}>
                    {truncate(40, item.name)} <span className="file-size-separator">|</span>
                    <span className="file-size-text">{formatFileSize(item.size)}</span>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={3} className="status">
                    {getStatusIcon(item)}
                </FlexboxGrid.Item>
            </FlexboxGrid>
            <Progress.Line
                strokeWidth={3}
                status={getStatus(item)}
                showInfo={false}
                percent={item.progress}
            />
        </List.Item>
    );
};

const UploadsPopup = ({ images, ...props }: { images: UploadedImage[]; className?: string }) => {
    return (
        <Popover title={<UploadHeader />} {...props} className={(props.className += ' uploads-popup')}>
            <List style={{ width: '500px' }}>
                {images.map((item) => (
                    <UploadsListItem key={item.originId} id={item.originId} />
                ))}
            </List>
        </Popover>
    );
};

const getProper = (images: UploadedImage[]) => {
    const imagesByBatches: { [key: string]: UploadedImage[] } = images.reduce((acc: any, cur) => {
        const currItem = acc[cur.batchId];
        if (currItem) {
            currItem.push(cur);
        } else {
            acc[cur.batchId] = [cur];
        }
        return acc;
    }, {});
    return Object.values(imagesByBatches)
        .filter((images) => !all(images, (img) => isProcessed(img.status)))
        .reduce((acc, cur) => [...acc, ...cur], []);
};

const LoaderIcon = () => {
    const items = useUploadedImages(
        (x) => getProper(x.images),
        (p, n) => p.reduce((acc, cur) => acc + cur.loaded, 0) === (n as any[]).reduce((acc, cur) => acc + cur.loaded, 0)
    );

    const totalProgress = calculateTotalItemsProgress(items);

    return (
        <div className="images-uploader-status">
            <ArrowCircleUp size={16} />
            <Progress.Circle percent={totalProgress} strokeWidth={8} showInfo={false} />
        </div>
    );
};

export const ImagesUploader = () => {
    const uploadedImages = useUploadedImages(
        (x) => getProper(x.images),
        (p, n) => ''.concat(...p.map((pi) => pi.originId)) === ''.concat(...(n as any[]).map((ni) => ni.originId))
    );

    const proper = getProper(uploadedImages);

    return (
        <Whisper trigger="click" placement="rightEnd" speaker={<UploadsPopup images={proper} />}>
            <Nav.Item icon={<LoaderIcon />}>{translations.menu.transfers}</Nav.Item>
        </Whisper>
    );
};
