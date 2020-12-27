import { ResultType } from "@pp/api/common";
import { uploadBlogAsset } from "@pp/api/panel/blog";
import React from "react";
import { useUploadedImages, State } from "../../state/uploaded-images";

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

    const updateImageToProcess = updateImage(imageToProcess.id);

    updateImageToProcess({ current: true });

    uploadBlogAsset(
        imageToProcess.blogId,
        imageToProcess.file!,
        updateImageToProcess,
        (res) => {
            if (res.type === ResultType.Success) {
                updateImageToProcess({ current: false, progress: 100, processed: true });
            } else {
                updateImageToProcess({ current: false, progress: 0, processed: true, error: res.error });
                console.error("An issue occured while uploading image", res.error)
            }
        }
    );
}

useUploadedImages.subscribe(processImages);

export const ImagesUploader = () => {
    const uploadedImages = useUploadedImages(x => x.images).filter(x => x.processed === false).length;

    return (<div>{uploadedImages}</div>);
};