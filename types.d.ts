import { SeriesOptions, PointOptionsObject, Point } from "highcharts";

/**
 * Shared types.
 */
type SeriesColoredSegment = {
    color: string;
};

/**
 * Represents data for chart options.
 */
interface SeriesColoredPointOptions extends PointOptionsObject {
    segmentColor?: string;
}

type SeriesColoredType = 'coloredline' | 'coloredarea';

interface SeriesColoredOptions<Type extends SeriesColoredType> extends SeriesOptions {
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

    interface Series {
        tracker: SVGElement;
        segments: SeriesColoredSegment[];
    }
}

/**
 * Represents created chart data.
 */
interface SeriesColoredPoint extends Point {
    segmentColor?: string;
}

export { SeriesColoredSegment, SeriesColoredPoint };
