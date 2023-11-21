import { Point, Series } from "highcharts";
import { SeriesColoredPoint, SeriesColoredSegment } from "../../types";

type SeriesColoredDefaultPoint = SeriesColoredPoint<Point>;

type FormattedSeries = {
    seriesType: string;
    data: FormattedSeriesPoints[];
};

type FormattedSegments = {
    color: string;
    points: FormattedSeriesPoints[];
};

interface FormattedSeriesPoints {
    segmentColor: string | undefined;
    x: number;
    y: number | undefined;
}

export const generateFormattedSeries = (
    series: Series,
    data: SeriesColoredDefaultPoint[]
): FormattedSeries => ({
    seriesType: series.type,
    data: data.map((point): FormattedSeriesPoints => ({
        segmentColor: point?.segmentColor,
        x: point.x,
        y: point.y
    }))
});

export const generateFormattedSegments = (
    segments: SeriesColoredSegment<SeriesColoredDefaultPoint>[]
): FormattedSegments[] =>
    segments.map((segment): FormattedSegments => ({
        color: segment.color,
        points: segment.points.map((point): FormattedSeriesPoints => ({
            segmentColor: point?.segmentColor,
            x: point.x,
            y: point.y
        }))
    }));
