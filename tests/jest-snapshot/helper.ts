import { Series } from "highcharts";
import { SeriesColoredPoint, SeriesColoredSegment } from "types";

export const generateFormattedSeries = (
    series: Series,
    data: SeriesColoredPoint[]
) => ({
    seriesType: series.type,
    data: data.map((point) => ({
        segmentColor: point?.segmentColor,
        x: point.x,
        y: point.y
    }))
});

export const generateFormattedSegments = (segments: SeriesColoredSegment[]) =>
    segments.map((segment) => ({
        color: segment.color,
        points: segment.points.map((point) => ({
            segmentColor: point?.segmentColor,
            x: point.x,
            y: point.y
        }))
    }));
