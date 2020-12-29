import { ResultType } from "@pp/api/common";
import { uploadBlogAsset } from "@pp/api/panel/blog";
import { all } from "@pp/utils/array";
import { formatFileSize, formatTransfer } from "@pp/utils/file";
import { truncate } from "@pp/utils/string";
// import { stringify } from "querystring";
import React from "react";
import { Badge, FlexboxGrid, Icon, List, Nav, Popover, Progress, Whisper } from "rsuite";
import { useUploadedImages, State, UploadedImage, isQueued, isActive, isProcessed } from "../../state/uploaded-images";
import "./styles.less";
// const queuedImages = [];

// const setProcessing = (image: UploadedImage) => (processing: boolean) => {
//     const images = useUploadedImages.getState().images;
//     const index = images.indexOf(image);
//     const newImage = {...image, processing: processing};
// }

const processImages = ({ images, updateImage }: State) => {

    if (images.filter(x => isActive(x.status)).length >= 1) {
        console.warn("Exceeded number of concurrent uploads!");
        return;
    }

    const imageToProcess = images.filter(x => isQueued(x.status))[0];
    if (imageToProcess === undefined) {
        console.warn("No more items to process");
        return;
    }

    console.log("Starting new upload");

    const updateImageToProcess = updateImage(imageToProcess.originId);

    updateImageToProcess({ status: "uploading" });

    uploadBlogAsset(
        imageToProcess.blogId,
        imageToProcess.file!,
        updateImageToProcess,
        (res) => {
            if (res.type === ResultType.Success) {
                updateImageToProcess({ id: res.result?.id, url: res.result?.url, status: "successful", progress: 100 });
            } else {
                updateImageToProcess({ status: "failed" });
                console.error("An issue occured while uploading image", res.error)
            }
        }
    );
}

useUploadedImages.subscribe(processImages);

const UploadHeader = () => {
    const uploadedItems = useUploadedImages(x => getProper(x.images), (p, n) => p.reduce((acc, cur) => acc + cur.loaded, 0) === (n as any[]).reduce((acc, cur) => acc + cur.loaded, 0));

    const items = uploadedItems;

    const loadedBytes = items.reduce((acc, cur) => acc + cur.loaded, 0);
    const totalBytes = items.reduce((acc, cur) => acc + cur.size, 1);
    const leftImages = items.filter(x => isActive(x.status) || isQueued(x.status)).length;

    const totalProgress = Math.floor(loadedBytes / totalBytes * 100);

    return <header><Badge content={<span><Icon icon="sort-up" /> {totalProgress}%</span>} /><span>{leftImages} left</span></header>
}

const getStatusIcon = (image: UploadedImage) => {
    if (isQueued(image.status))
        return <Icon icon="clock-o" size="lg"></Icon>;

    if (image.status === "successful")
        return <Icon style={{ color: "#4caf50" }} icon="check" size="lg"></Icon>;

    if (image.status === "failed")
        return <Icon style={{ color: "#f44336" }} icon="close" size="lg"></Icon>;

    return formatTransfer(image.lastBytesPerSecond);
}


const getStatus = (image: UploadedImage) => {
    if (image.status === "failed")
        return "fail";
    if (image.status === "successful")
        return "success";
    return "active";
}

const UploadsListItem = ({ id }: { id: string }) => {
    const item = useUploadedImages(x => x.images.filter(xx => xx.originId === id)[0]);

    return <List.Item key={item.originId}>
        <FlexboxGrid>
            <FlexboxGrid.Item colspan={1}><Icon icon="sort-up" /></FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={20}>{truncate(40, item.name)} <span className="file-size-separator">|</span><span className="file-size-text">{formatFileSize(item.size)}</span></FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={3} className="status">{getStatusIcon(item)}</FlexboxGrid.Item>
        </FlexboxGrid>
        <Progress.Line strokeWidth={3} status={getStatus(item)} showInfo={false} percent={item.progress}></Progress.Line>
    </List.Item>
}

const UploadsPopup = ({ images, ...props }: { images: UploadedImage[], className?: string }) => {
    return (
        <Popover title={<UploadHeader />}  {...props} className={props.className += " uploads-popup"}>
            <List style={{ width: "500px" }}>
                {images.map((item) => (<UploadsListItem key={item.originId} id={item.originId} />))}
            </List>
        </Popover>
    );
};

const getProper = (images: UploadedImage[]) => {
    const imagesByBatches: { [key: string]: UploadedImage[] } = images.reduce((acc: any, cur) => ({ ...acc, [cur.batchId]: [...(acc[cur.batchId] || []), cur] }), {});
    return Object.values(imagesByBatches).filter(images => !all(images, img => isProcessed(img.status))).reduce((acc, cur) => [...acc, ...cur], []);;
}

export const ImagesUploader = () => {
    const uploadedImages = useUploadedImages(x => getProper(x.images), (p, n) => "".concat(...p.map(pi => pi.originId)) === "".concat(...(n as any[]).map(ni => ni.originId)));

    //when no uploads then show all finnished uploads
    //if some uploads are in progress then show all uploads (even completed) from the same batches
    const proper = getProper(uploadedImages);

    console.log(proper);

    // const proper: any[] = JSON.parse(`[{"blogId":"304","file":{},"size":20592894,"name":"PF7B4400a.jpg","lastBytesPerSecond": 856924, "originId":"PF7B4400a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":true,"processed":false,"processing":false,"progress":7.631575267058614,"loaded":1571588,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":17102851,"name":"PF7B4404-adawdawdaw-adawda.jpg","originId":"PF7B4404a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":true,"processing":false,"progress":100,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":17484072,"name":"PF7B4410aPF7B4410aPF7B4410aPF7B4410aPF7B4410aPF7B4410a.jpg","originId":"PF7B4410a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":true,"processing":false,"progress":50,"error":"Sineting went wrong", "loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":18416382,"name":"PF7B4412a.jpg","originId":"PF7B4412a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":15054983,"name":"PF7B4419a.jpg","originId":"PF7B4419a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":19282284,"name":"PF7B4422a.jpg","originId":"PF7B4422a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":23073856,"name":"PF7B4425a.jpg","originId":"PF7B4425a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":14300644,"name":"PF7B4431a.jpg","originId":"PF7B4431a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":15274610,"name":"PF7B4435a.jpg","originId":"PF7B4435a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":15279244,"name":"PF7B4437a.jpg","originId":"PF7B4437a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":16170972,"name":"PF7B4443a.jpg","originId":"PF7B4443a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":19577973,"name":"PF7B4448a.jpg","originId":"PF7B4448a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":12073713,"name":"PF7B4453a.jpg","originId":"PF7B4453a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":8275481,"name":"PF7B4458a.jpg","originId":"PF7B4458a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":19041735,"name":"PF7B4465a.jpg","originId":"PF7B4465a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":13898841,"name":"PF7B4474a.jpg","originId":"PF7B4474a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":13385373,"name":"PF7B4480a.jpg","originId":"PF7B4480a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"}]`);

    return (<Whisper trigger="click" placement="rightEnd" speaker={<UploadsPopup images={proper} />}>
        {<Nav.Item icon={<Icon icon="arrow-circle-o-up" />}>Transfers</Nav.Item>}
    </Whisper>);
};