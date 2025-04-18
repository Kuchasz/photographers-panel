import { Photo } from '~/components/gallery/photo-tile';

export type Column = {
    photos: Photo[];
    height: number;
    width: number;
};

// Gap size in pixels - matches the gap-4 class (1rem = 16px)
// 0.25rem * 1.5 = 0.375rem
const GAP_SIZE = 6;

function getRandomHeightAdjustment(): number {
    const adjustments = [-0.05, 0, 0.05, 0.10, 0.15] as const;
    const randomIndex = Math.floor(Math.random() * adjustments.length);
    return adjustments[randomIndex] ?? 0;
}

export function calculateGridLayout(photos: Photo[], containerWidth: number): Column[] {
    if (photos.length === 0 || containerWidth === 0) return [];

    // Calculate column count based on container width
    let columnCount = 3;
    if (containerWidth < 640) {
        columnCount = 1;
    } else if (containerWidth < 768) {
        columnCount = 2;
    }

    if (containerWidth >= 1280 && photos.length >= 50) {
        columnCount = 4;
    }

    const gapSpace = GAP_SIZE * (columnCount - 1);
    const availableWidth = containerWidth - gapSpace;
    const columnWidth = Math.floor(availableWidth / columnCount);

    // 1. Calculate initial tile sizes based on column width
    const photosWithTileSizes = photos.map(photo => {
        const aspectRatio = photo.width / photo.height;
        const tileHeight = Math.round(columnWidth / aspectRatio);

        // Apply random height adjustment if there are 2 or more columns
        const adjustedHeight = columnCount >= 2
            ? Math.round(tileHeight * (1 + getRandomHeightAdjustment()))
            : tileHeight;

        return {
            ...photo,
            sizes: {
                ...photo.sizes,
                tile: {
                    width: columnWidth,
                    height: adjustedHeight
                }
            }
        };
    });

    // 2. Distribute photos into columns based on tile heights
    const columns: Column[] = Array.from({ length: columnCount }, () => ({
        photos: [],
        height: 0,
        width: columnWidth
    }));

    photosWithTileSizes.forEach(photo => {
        const minHeightColumn = columns.reduce(
            (min, col, i) => col.height < columns[min]!.height ? i : min,
            0
        );

        const gapContribution = columns[minHeightColumn]!.photos.length > 0 ? GAP_SIZE : 0;
        columns[minHeightColumn]!.photos.push(photo);
        columns[minHeightColumn]!.height += photo.sizes.tile.height + gapContribution;
    });

    // 3. Find the tallest column
    const maxColumnHeight = Math.max(...columns.map(col => col.height));

    // 4 & 5. Adjust heights of shorter columns to match the tallest
    columns.forEach(column => {
        if (column.height === maxColumnHeight) return;

        const totalGaps = (column.photos.length - 1) * GAP_SIZE;
        const availableHeight = maxColumnHeight - totalGaps;
        const totalPhotoHeight = column.photos.reduce((sum, photo) => sum + photo.sizes.tile!.height, 0);
        const scaleRatio = availableHeight / totalPhotoHeight;

        // Adjust each photo's height proportionally
        column.photos = column.photos.map(photo => {
            const newHeight = Math.round(photo.sizes.tile!.height * scaleRatio);

            return {
                ...photo,
                sizes: {
                    ...photo.sizes,
                    tile: {
                        width: columnWidth,
                        height: newHeight
                    }
                }
            };
        });

        // Recalculate column height with new rounded heights
        const newColumnHeight = column.photos.reduce((sum, photo) => sum + photo.sizes.tile!.height, 0) +
            ((column.photos.length - 1) * GAP_SIZE);

        // If there are remaining pixels to distribute
        if (newColumnHeight < maxColumnHeight) {
            const photosToAdjust = column.photos.length;
            let currentHeight = newColumnHeight;
            let currentPhotoIndex = 0;

            // Keep distributing pixels until we reach the target height
            while (currentHeight < maxColumnHeight) {
                const photo = column.photos[currentPhotoIndex];
                if (!photo) continue;

                column.photos[currentPhotoIndex] = {
                    ...photo,
                    sizes: {
                        ...photo.sizes,
                        tile: {
                            ...photo.sizes.tile!,
                            height: photo.sizes.tile!.height + 1
                        }
                    }
                };

                currentHeight += 1;
                currentPhotoIndex = (currentPhotoIndex + 1) % photosToAdjust;
            }
        }

        column.height = maxColumnHeight;
    });

    return columns;
} 