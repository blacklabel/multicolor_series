import { SeriesColored, SeriesColoredPoint, SeriesColoredSegment } from "../../types";

export const generateFormattedSeries = (
    series: SeriesColored,
    data: SeriesColoredPoint[]
) => ({
    seriesType: series.type,
    data: data.map((point) => ({
        segmentColor: point.segmentColor,
        x: point.x,
        y: point.y
    }))
});

const generateFormattedPoint = (point: SeriesColoredPoint | undefined) => ({
    index: point?.index,
    segmentColor: point?.segmentColor,
    x: point?.x,
    y: point?.y
});

export const generateFormattedSegments = (
    segments: SeriesColoredSegment[],
    data: SeriesColoredPoint[]
) =>
    segments.map((segment, index) => ({
        color: segment.color,
        points: [
            generateFormattedPoint(data[index]),
            generateFormattedPoint(data[index + 1])
        ]
    }));
