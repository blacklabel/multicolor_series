import { Series, Point } from 'highcharts';
import { ColoredlineSeries } from './ts/MulticolorSeries';
import { SeriesColoredPoint, SeriesColoredSegment } from './types';

type ExtendedColoredlineSeries = ColoredlineSeries & {
    segments: SeriesColoredSegment<SeriesColoredPoint<Point>>[];
};

export const isSeriesColored = (
    series: Series | ExtendedColoredlineSeries,
    type: 'coloredline' | 'coloredarea'
): series is ExtendedColoredlineSeries => true;
