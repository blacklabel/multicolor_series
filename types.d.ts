import Highcharts, { SeriesOptions, PointOptionsObject } from "highcharts";

/**
 * Represents data for chart options.
 */
interface SeriesColoredPointOptions extends PointOptionsObject {
    segmentColor?: string;
}

interface SeriesColoredOptions<Type extends string> extends SeriesOptions {
    type: Type;
    data?: SeriesColoredPointOptions[];
}

type SeriesColoredlineOptions = SeriesColoredOptions<'coloredline'>;
type SeriesColoredareaOptions = SeriesColoredOptions<'coloredarea'>;

/**
 * Globally accessible on the Highcharts module.
 */
declare module "highcharts" {
    interface SeriesOptionsRegistry {
        SeriesColoredlineOptions?: SeriesColoredlineOptions;
        SeriesColoredareaOptions?: SeriesColoredareaOptions;
    }
}

/**
 * Represents created chart data.
 */
interface SeriesColoredPoint extends Highcharts.Point {
    segmentColor: string;
}

interface SeriesColoredSegment {
    color: string;
    points: SeriesColoredPointOptions[];
}

interface SeriesColored extends Highcharts.Series {
    data: SeriesColoredPoint[];
    segments: SeriesColoredSegment[];
    tracker: SVGPathElement;
}

interface ChartSeriesColored extends Highcharts.Chart {
    series: SeriesColored[];
}

export { ChartSeriesColored, SeriesColored, SeriesColoredSegment, SeriesColoredPoint };
