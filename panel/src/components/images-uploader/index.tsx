import { ResultType } from "@pp/api/common";
import { uploadBlogAsset } from "@pp/api/panel/blog";
// import { all } from "@pp/utils/array";
import { formatFileSize } from "@pp/utils/file";
import { truncate } from "@pp/utils/string";
import React from "react";
import { Badge, FlexboxGrid, Icon, List, Loader, Nav, Popover, Progress, Whisper } from "rsuite";
import { useUploadedImages, State, UploadedImage } from "../../state/uploaded-images";
import "./styles.less";
// const queuedImages = [];

// const setProcessing = (image: UploadedImage) => (processing: boolean) => {
//     const images = useUploadedImages.getState().images;
//     const index = images.indexOf(image);
//     const newImage = {...image, processing: processing};
// }

const processImages = ({ images, updateImage }: State) => {

    if (images.filter(x => x.current === true).length !== 0) {
        console.warn("There is currently processed image");
        return;
    }

    const imageToProcess = images.filter(x => x.processed === false)[0];
    if (imageToProcess === undefined) {
        console.warn("No more items to process");
        return;
    }

    console.log("Starting new upload");

    const updateImageToProcess = updateImage(imageToProcess.originId);

    updateImageToProcess({ current: true });

    uploadBlogAsset(
        imageToProcess.blogId,
        imageToProcess.file!,
        updateImageToProcess,
        (res) => {
            if (res.type === ResultType.Success) {
                updateImageToProcess({ id: res.result?.id, url: res.result?.url, current: false, progress: 100, processed: true });
            } else {
                updateImageToProcess({ current: false, progress: 0, processed: true, error: res.error });
                console.error("An issue occured while uploading image", res.error)
            }
        }
    );
}

useUploadedImages.subscribe(processImages);

const UploadHeader = ({ items }: { items: UploadedImage[] }) => {

    const loadedBytes = items.reduce((acc, cur) => acc + cur.loaded, 0);
    const totalBytes = items.reduce((acc, cur) => acc + cur.size, 1);
    const leftImages = items.filter(x => !x.processed).length;

    const totalProgress = Math.floor(loadedBytes / totalBytes * 100);

    return <header><Badge content={<span><Icon icon="sort-up" /> {totalProgress}%</span>} /><span>{leftImages} left</span></header>
}

const UploadsPopup = ({ ...props }) => {
    // const uploadedImages = useUploadedImages(x => x.images);
    // const imagesByBatches: { [key: string]: UploadedImage[] } = uploadedImages.reduce((acc: any, cur) => ({ ...acc, [cur.batchId]: [...(acc[cur.batchId] || []), cur] }), {});

    //when no uploads then show all finnished uploads
    //if some uploads are in progress then show all uploads (even completed) from the same batches
    // const proper = Object.values(imagesByBatches).filter(images => !all(images, img => img.processed)).reduce((acc, cur) => [...acc, ...cur], []);

    const proper: any[] = JSON.parse(`[{"blogId":"304","file":{},"size":20592894,"name":"PF7B4400a.jpg","originId":"PF7B4400a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":true,"processed":false,"processing":false,"progress":7.631575267058614,"loaded":1571588,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":17102851,"name":"PF7B4404-adawdawdaw-adawda.jpg","originId":"PF7B4404a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":true,"processing":false,"progress":100,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":17484072,"name":"PF7B4410aPF7B4410aPF7B4410aPF7B4410aPF7B4410aPF7B4410a.jpg","originId":"PF7B4410a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":true,"processing":false,"progress":50,"error":"Sineting went wrong", "loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":18416382,"name":"PF7B4412a.jpg","originId":"PF7B4412a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":15054983,"name":"PF7B4419a.jpg","originId":"PF7B4419a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":19282284,"name":"PF7B4422a.jpg","originId":"PF7B4422a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":23073856,"name":"PF7B4425a.jpg","originId":"PF7B4425a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":14300644,"name":"PF7B4431a.jpg","originId":"PF7B4431a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":15274610,"name":"PF7B4435a.jpg","originId":"PF7B4435a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":15279244,"name":"PF7B4437a.jpg","originId":"PF7B4437a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":16170972,"name":"PF7B4443a.jpg","originId":"PF7B4443a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":19577973,"name":"PF7B4448a.jpg","originId":"PF7B4448a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":12073713,"name":"PF7B4453a.jpg","originId":"PF7B4453a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":8275481,"name":"PF7B4458a.jpg","originId":"PF7B4458a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":19041735,"name":"PF7B4465a.jpg","originId":"PF7B4465a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":13898841,"name":"PF7B4474a.jpg","originId":"PF7B4474a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"},{"blogId":"304","file":{},"size":13385373,"name":"PF7B4480a.jpg","originId":"PF7B4480a.jpg3042e2e794e-1dca-4eae-9dff-1521a51a883b","current":false,"processed":false,"processing":false,"progress":0,"loaded":0,"batchId":"2e2e794e-1dca-4eae-9dff-1521a51a883b"}]`);
    // console.log(JSON.stringify(proper));

    return (
        <Popover title={<UploadHeader items={proper} />}  {...props} className={props.className += " uploads-popup"}>
            <List style={{ width: "400px" }}>
                {proper.map((item, index) => (
                    <List.Item key={item.originId} index={index}>
                        <FlexboxGrid>
                            <FlexboxGrid.Item colspan={2}><Icon icon="sort-up" /></FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={20}>{truncate(30, item.name)} <span className="file-size-separator">|</span><span className="file-size-text">{formatFileSize(item.size)}</span></FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={2}>{!item.processed && !item.current && <Loader speed={"slow"} size={"xs"} />}</FlexboxGrid.Item>
                        </FlexboxGrid>
                        <Progress.Line strokeWidth={3} status={item.processed ? item.error ? "fail" : "success" : "active"} showInfo={false} percent={item.progress}></Progress.Line>
                    </List.Item>
                ))}
            </List>
        </Popover>
    );
};

export const ImagesUploader = () => {
    return (<Whisper trigger="click" placement="rightEnd" speaker={<UploadsPopup />}>
        {<Nav.Item icon={<Icon icon="arrow-circle-o-up" />}>
        </Nav.Item>}
    </Whisper>);
};