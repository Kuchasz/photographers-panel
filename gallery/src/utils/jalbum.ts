import { GalleryDirectory, GalleryImage } from "../service/gallery.state";
import { parseString } from "xml2js";

const getId = () => {
    const usedIds = [];
    return (name: string) => {
        let newId = "";
        let tries = 0;
        do {
            newId =
                name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase() +
                "-" +
                tries;
            tries++;
        } while (usedIds.includes(newId));

        usedIds.push(newId);

        return newId;
    };
};

export const fetchGallery = (path: string) =>
    new Promise<{
        images: GalleryImage[];
        directoryImages: { [id: string]: string[] };
        directories: { [id: string]: GalleryDirectory };
    }>((res) => {
        fetch(`${path}folders.xml`)
            .then((response) => response.text())
            .then((foldersXmlString) =>
                parseString(foldersXmlString, (_, _directories) => {
                    const directoriesToFetch = _directories.item.item
                        .filter((item) => item.$.action === "loadalbum")
                        .map((item) => item.$);

                    const getIdFromName = getId();

                    let fetchedDirectories = 0;

                    const directories: { directory: GalleryDirectory; index: number }[] = [];
                    const images: GalleryImage[] = [];
                    const directoryImages: { images: string[]; directoryId: string }[] = [];

                    directoriesToFetch.forEach((item, index) => {
                        fetch(`${path}${item.variables}`)
                            .then((response) => response.text())
                            .then((photosXmlString) => {
                                parseString(photosXmlString, (_, photos) => {
                                    if (photos.gallery) {
                                        const _images = photos.gallery.image.map((img) => img.$);

                                        const directoryId = getIdFromName(item.name.replaceAll("_", "-"));

                                        directories.push({
                                            index,
                                            directory: {
                                                id: directoryId,
                                                visited: false,
                                                name: item.name.replaceAll("_", " "),
                                                rootDir: item.path
                                            }
                                        });

                                        const galleryImages = _images.map((img, idx) => ({
                                            id: `${directoryId}#${img.img.replaceAll("/", "_")}#${idx}`,
                                            likes: 0,
                                            liked: Math.random() > 0.5,
                                            src: `${path}${item.path}${img.img}`,
                                            thumbnail: `${path}${item.path}${img.thmb}`,
                                            text: img.img.split("/")[1],
                                            width: Number(img.printwidth),
                                            height: Number(img.printheight)
                                        }));

                                        galleryImages.forEach(i => images.push(i));

                                        directoryImages.push({directoryId: directoryId, images: galleryImages.map(x => x.id)});

                                        if (fetchedDirectories === directoriesToFetch.length - 1) {
                                            directories.sort((l, r) => l.index - r.index);

                                            const resultDirectories = directories.reduce(
                                                (acc, cur) => ({ ...acc, [cur.directory.id]: cur.directory }),
                                                {}
                                            );

                                            const resultDirectoryImages = directoryImages.reduce(
                                                (acc, cur) => ({ ...acc, [cur.directoryId]: cur.images }),
                                                {}
                                            );

                                            const resultImages = images;

                                            const result = {
                                                directories: resultDirectories,
                                                directoryImages: resultDirectoryImages,
                                                images: resultImages
                                            };

                                            res(result);
                                        }

                                        fetchedDirectories++;
                                    }
                                });
                            });
                    });
                })
            );
    });
