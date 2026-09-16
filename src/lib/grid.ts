import { Photo } from '~/components/gallery/photo-tile';

export type GridLayout = {
    columnCount: number;
    columnWidth: number;
    /** Final tile height for every photo, in photo order. */
    heights: number[];
    /** Column (lane) index for every photo, in photo order. */
    lanes: number[];
    totalHeight: number;
};

// Gap size in pixels - matches the gap-1.5 class (0.375rem = 6px)
export const GAP_SIZE = 6;

const HEIGHT_ADJUSTMENTS = [-0.05, 0, 0.05, 0.10, 0.15] as const;

// Small deterministic hash so the "random" height variation of a photo is stable
// between renders and resizes (iOS fires resize when the URL bar collapses).
function hashString(value: string): number {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function getHeightAdjustment(photoId: string): number {
    return HEIGHT_ADJUSTMENTS[hashString(photoId) % HEIGHT_ADJUSTMENTS.length] ?? 0;
}

export function getColumnCount(containerWidth: number, photoCount: number): number {
    if (containerWidth < 640) return 1;
    if (containerWidth < 768) return 2;
    if (containerWidth >= 1280 && photoCount >= 50) return 4;
    return 3;
}

/**
 * Greedy "shortest column first" assignment. This mirrors exactly how
 * @tanstack/virtual-core assigns items to lanes (first row is `i % lanes`,
 * then the lane with the smallest end, ties broken by the lane whose last
 * item has the lowest index), so that the virtualizer's computed positions
 * match this layout.
 */
type LaneAssignment = {
    lanes: number[];
    columnHeights: number[];
    /**
     * For every photo, how much shorter its column was than the next-shortest
     * column when the photo was assigned. Growing earlier tiles in that column
     * by less than this margin keeps the assignment unchanged.
     */
    margins: number[];
};

function assignLanes(heights: number[], columnCount: number): LaneAssignment {
    const lanes = new Array<number>(heights.length);
    const margins = new Array<number>(heights.length);
    const columnEnds = new Array<number>(columnCount).fill(0);
    const columnLastIndex = new Array<number>(columnCount).fill(-1);

    for (let i = 0; i < heights.length; i++) {
        let lane: number;
        let start: number;

        if (i < columnCount) {
            lane = i % columnCount;
            start = 0;
            margins[i] = Number.POSITIVE_INFINITY;
        } else {
            lane = 0;
            for (let l = 1; l < columnCount; l++) {
                const end = columnEnds[l]!;
                const bestEnd = columnEnds[lane]!;
                if (end < bestEnd || (end === bestEnd && columnLastIndex[l]! < columnLastIndex[lane]!)) {
                    lane = l;
                }
            }
            start = columnEnds[lane]! + GAP_SIZE;
            let secondBest = Number.POSITIVE_INFINITY;
            for (let l = 0; l < columnCount; l++) {
                if (l !== lane) secondBest = Math.min(secondBest, columnEnds[l]!);
            }
            margins[i] = secondBest - columnEnds[lane]!;
        }

        lanes[i] = lane;
        columnEnds[lane] = start + heights[i]!;
        columnLastIndex[lane] = i;
    }

    return { lanes, columnHeights: columnEnds, margins };
}

// How much a single tile may grow (relative to its size) when closing the gap
// at the bottom of a column. Any gap that cannot be closed within this limit
// is left as a slightly ragged bottom edge rather than a badly stretched tile.
const MAX_TRAILING_TILE_GROWTH = 0.25;

/**
 * Grow trailing tiles of `column` by up to `deficit` px in total without
 * changing the greedy assignment. Growing the last tile is always safe.
 * Growing an earlier tile shifts every later pick into this column, so its
 * growth is limited by the smallest remaining margin of those later picks.
 * Returns the part of the deficit that could not be closed.
 */
function growColumnTail(heights: number[], assignment: LaneAssignment, column: number, deficit: number): number {
    const indices: number[] = [];
    for (let i = 0; i < assignment.lanes.length; i++) if (assignment.lanes[i] === column) indices.push(i);
    if (indices.length === 0) return deficit;

    // Remaining slack of each later pick into this column (strictly less than the margin keeps ordering)
    const slack = indices.map(i => assignment.margins[i]! - 1);
    let remaining = deficit;

    for (let k = indices.length - 2; k >= 0 && remaining > 0; k--) {
        const index = indices[k]!;
        let allowed = Math.floor(heights[index]! * MAX_TRAILING_TILE_GROWTH);
        for (let later = k + 1; later < indices.length; later++) {
            allowed = Math.min(allowed, slack[later]!);
        }
        const growth = Math.max(0, Math.min(allowed, remaining));
        if (growth === 0) continue;

        heights[index]! += growth;
        remaining -= growth;
        for (let later = k + 1; later < indices.length; later++) slack[later]! -= growth;
    }

    // The last tile is always safe to grow, but keep it within the same limit
    const lastIndex = indices[indices.length - 1]!;
    const lastGrowth = Math.min(remaining, Math.floor(heights[lastIndex]! * MAX_TRAILING_TILE_GROWTH));
    heights[lastIndex]! += lastGrowth;
    return remaining - lastGrowth;
}

/** Scale the photos of every shorter column so all columns end at the same height. */
function equalizeColumns(heights: number[], lanes: number[], columnHeights: number[], columnCount: number): number[] {
    const maxColumnHeight = Math.max(...columnHeights);
    const result = [...heights];

    for (let column = 0; column < columnCount; column++) {
        if (columnHeights[column] === maxColumnHeight) continue;

        const indices: number[] = [];
        for (let i = 0; i < lanes.length; i++) if (lanes[i] === column) indices.push(i);
        if (indices.length === 0) continue;

        const totalGaps = (indices.length - 1) * GAP_SIZE;
        const availableHeight = maxColumnHeight - totalGaps;
        const totalPhotoHeight = indices.reduce((sum, i) => sum + heights[i]!, 0);
        const scaleRatio = availableHeight / totalPhotoHeight;

        let newColumnHeight = totalGaps;
        for (const i of indices) {
            result[i] = Math.max(1, Math.round(heights[i]! * scaleRatio));
            newColumnHeight += result[i]!;
        }

        // Distribute the rounding remainder one pixel at a time
        let cursor = 0;
        while (newColumnHeight < maxColumnHeight) {
            const i = indices[cursor % indices.length]!;
            result[i]! += 1;
            newColumnHeight += 1;
            cursor++;
        }
    }

    return result;
}

const MAX_EQUALIZE_PASSES = 8;

function spreadOf(columnHeights: number[]): number {
    return Math.max(...columnHeights) - Math.min(...columnHeights);
}

export function calculateGridLayout(photos: Photo[], containerWidth: number): GridLayout | null {
    if (photos.length === 0 || containerWidth === 0) return null;

    const columnCount = getColumnCount(containerWidth, photos.length);
    const availableWidth = containerWidth - GAP_SIZE * (columnCount - 1);
    const columnWidth = Math.floor(availableWidth / columnCount);

    // 1. Natural tile heights for the column width (+ stable pseudo-random variation)
    let heights = photos.map(photo => {
        const tileHeight = Math.round(columnWidth / (photo.width / photo.height));
        return columnCount >= 2
            ? Math.max(1, Math.round(tileHeight * (1 + getHeightAdjustment(photo.id))))
            : tileHeight;
    });

    // 2. Assign to columns and stretch shorter columns. Stretching changes the
    //    greedy assignment for the new heights, so try a few passes and keep
    //    the one where the columns (as the virtualizer will lay them out) end
    //    closest to each other.
    let assignment = assignLanes(heights, columnCount);
    if (columnCount > 1) {
        let best = { heights, assignment, spread: spreadOf(assignment.columnHeights) };
        for (let pass = 0; pass < MAX_EQUALIZE_PASSES && best.spread > 0; pass++) {
            heights = equalizeColumns(heights, assignment.lanes, assignment.columnHeights, columnCount);
            assignment = assignLanes(heights, columnCount);
            const spread = spreadOf(assignment.columnHeights);
            if (spread < best.spread) best = { heights, assignment, spread };
        }
        heights = [...best.heights];
        assignment = best.assignment;

        // 3. Close the remaining gap by growing the trailing tiles of every
        //    shorter column in a way that provably keeps the greedy assignment.
        const maxColumnHeight = Math.max(...assignment.columnHeights);
        for (let column = 0; column < columnCount; column++) {
            const deficit = maxColumnHeight - assignment.columnHeights[column]!;
            if (deficit <= 0) continue;
            const unclosed = growColumnTail(heights, assignment, column, deficit);
            assignment.columnHeights[column] = maxColumnHeight - unclosed;
        }
    }

    return {
        columnCount,
        columnWidth,
        heights,
        lanes: assignment.lanes,
        totalHeight: Math.max(...assignment.columnHeights),
    };
}
