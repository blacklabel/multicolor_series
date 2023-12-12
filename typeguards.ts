import { Series, Point } from 'highcharts';
import { ColoredlineSeries, ColoredareaSeries } from './ts/MulticolorSeries';
import { SeriesColoredPoint, SeriesColoredSegment } from './types';

type ExtendedColoredlineSeries = ColoredlineSeries & {
    segments: SeriesColoredSegment<SeriesColoredPoint<Point>>[];
};

type ExtendedColoredareaSeries = ColoredareaSeries & {
    segments: SeriesColoredSegment<SeriesColoredPoint<Point>>[];
};

export const isSeriesColored = (
    series: Series | ExtendedColoredlineSeries | ExtendedColoredareaSeries
): series is ExtendedColoredlineSeries | ExtendedColoredareaSeries => true;
