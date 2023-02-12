import React, { useEffect, useState } from 'react';
import { Button, Icon, List, Modal, Slider } from 'rsuite';
import { getGalleryForEdit } from '@pp/api/dist/panel/private-gallery';
import { translations } from '../../i18n';
import { createGraphApi, GraphApi } from '../../graph-api';
import { LikedPhoto } from '../../sdk';
import { useLikedImages } from '../../state/likes-images';

interface Props {
    id: number;
    show: boolean;
    close: () => void;
    onNotified: () => void;
}
interface State {
    likedPhotos: LikedPhoto[];
    directPath?: string;
}

const LikedPhotoList = ({
    thumbSize,
    likedPhotos,
    galleryPath,
}: {
    thumbSize: number;
    galleryPath: string;
    likedPhotos: LikedPhoto[];
}) => (
    <div className="likes-list">
        {likedPhotos.map((lp) => (
            <div className="liked-photo" key={lp.fileName}>
                <img
                    width={thumbSize}
                    height={thumbSize}
                    src={`${galleryPath}/${lp.directoryName}/slides/${lp.fileName}`}
                />
                <div className="like-count">
                    <Icon icon="heart" />
                    <span>{lp.likes}</span>
                </div>
            </div>
        ))}
    </div>
);

export const GalleryLikes = (props: Props) => {
    const api = createGraphApi('', props.id);

    const likedImages = useLikedImages();

    const [state, setState] = useState<State>({ likedPhotos: [] });

    useEffect(() => {
        Promise.all([api.likedPhotos({ galleryId: props.id }), getGalleryForEdit(props.id)]).then(
            ([likedPhotosResult, gallery]) => {
                setState({ ...state, likedPhotos: likedPhotosResult.likedPhotos, directPath: gallery.directPath });
            }
        );
    }, []);

    const handleModalHide = () => {
        props.close();
    };

    const changeThumbSize = (thumbSize: number) => {
        likedImages.updateThumbSize(thumbSize);
    };

    return <Modal
        dialogClassName="gallery-likes-modal"
        className="gallery-likes"
        size="lg"
        show={props.show}
        onHide={handleModalHide}>
        <Modal.Header>
            <Modal.Title>{translations.gallery.likesBrowser.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="thumbs-size-config">
                <label>{translations.gallery.likesBrowser.thumbnails}</label>
                <Slider
                    graduated
                    progress
                    value={likedImages.thumbSize}
                    onChange={changeThumbSize}
                    tooltip={false}
                    step={30}
                    min={120}
                    max={360}></Slider>
            </div>
            {state.directPath && (
                <div className="likes-list-container">
                    <LikedPhotoList
                        thumbSize={likedImages.thumbSize}
                        galleryPath={state.directPath}
                        likedPhotos={state.likedPhotos}
                    />
                </div>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={handleModalHide} appearance="subtle">
                {translations.gallery.likesBrowser.cancel}
            </Button>
        </Modal.Footer>
    </Modal>;
};
