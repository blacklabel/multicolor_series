import type SVGPath from "highcharts-github/ts/Core/Renderer/SVG/SVGPath";
import type ColorType from "highcharts-github/ts/Core/Color/ColorType";
import type {
    SeriesOptions,
    PointOptionsObject,
    Point,
    Series,
    SVGElement
} from 'highcharts';

/**
 * 
 * Shared types
 * 
 */

type SeriesColoredPoint<T> = T & {
    segmentColor?: string;
};

type SeriesColoredSegment<T> = {
    color: string;
    points: SeriesColoredPoint<T>[];
};

/**
 * 
 * Core code types
 * 
 */

type SeriesColoredSegmentPath = SVGPath.Segment | string | number | undefined;

type SeriesColoredGraphPath = [SeriesColoredSegmentPath[], ColorType];

/**
 * 
 * Extended Highcharts module types
 * 
 */

interface SeriesColoredPointOptions extends PointOptionsObject {
    segmentColor?: string;
}

type SeriesColoredType = 'coloredline' | 'coloredarea';

interface SeriesColoredOptions<
    Type extends SeriesColoredType
> extends SeriesOptions {
    type: Type;
    data?: SeriesColoredPointOptions[];
}

type SeriesColoredlineOptions = SeriesColoredOptions<'coloredline'>;
type SeriesColoredareaOptions = SeriesColoredOptions<'coloredarea'>;

declare module "highcharts" {
    interface SeriesOptionsRegistry {
        SeriesColoredlineOptions?: SeriesColoredlineOptions;
        SeriesColoredareaOptions?: SeriesColoredareaOptions;
    }
}

export {
    SeriesColoredPoint,
    SeriesColoredSegment,
    SeriesColoredSegmentPath,
    SeriesColoredGraphPath
};
