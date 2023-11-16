import { PointOptionsObject } from "highcharts";
import Series from 'highcharts/ts/Core/Series/Series';
import LinePoint from 'highcharts/ts/Series/Line/LinePoint';
import SVGElement from 'highcharts/ts/Core/Renderer/SVG/SVGElement';
import type SVGPath from "highcharts/ts/Core/Renderer/SVG/SVGPath";
import type ColorType from "highcharts/ts/Core/Color/ColorType";
import type DataLabelOptions from 'highcharts/ts/Core/Series/DataLabelOptions';
import type AnimationOptions from 'highcharts/ts/Core/Animation/AnimationOptions';
import type StatesOptions, {
    StateGenericOptions
} from 'highcharts/ts/Core/Series/StatesOptions';
import type SeriesOptions, {
    SeriesStateHoverOptions,
    SeriesStateInactiveOptions,
    SeriesStateNormalOptions,
    SeriesStateSelectOptions
} from 'highcharts/ts/Core/Series/SeriesOptions';

/**
 *
 * Shared types
 * 
 */

interface SeriesColored extends Omit<Series, 'graph'> {
    tracker: SVGElement;
    segments: SeriesColoredSegment[];
    graph: SVGElement[];
}

interface SeriesColoredPoint extends LinePoint {
    segmentColor?: string;
}

type SeriesColoredSegment = {
    color: string;
    points: SeriesColoredPoint[];
};

type SeriesColoredSegmentPath = SVGPath.Segment | string | number;

type SeriesColoredGraphPath = [SeriesColoredSegmentPath[], ColorType];

/**
 *
 * Coloredline series options
 * 
 */

interface SeriesStatesOptions extends StatesOptions {
    hover?: SeriesStateHoverOptions&StateGenericOptions;
    inactive?: SeriesStateInactiveOptions&StateGenericOptions;
    normal?: SeriesStateNormalOptions&StateGenericOptions;
    select?: SeriesStateSelectOptions&StateGenericOptions;
}

interface ColoredlineSeriesOptions extends SeriesOptions {
    allAreas?: boolean;
    animation?: (boolean|DeepPartial<AnimationOptions>);
    animationLimit?: number;
    boostThreshold?: number;
    borderColor?: ColorType;
    borderWidth?: number;
    colorAxis?: boolean;
    connectEnds?: boolean;
    dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);
    description?: string;
    linkedTo?: string;
    pointDescriptionFormatter?: Function;
    pointStart?: number;
    skipKeyboardNavigation?: boolean;
    states?: SeriesStatesOptions;
    supportingColor?: ColorType;
}

/**
 *
 * Represents data for chart options
 * 
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
 *
 * Globally accessible on the Highcharts module
 * 
 */

declare module "highcharts" {
    interface SeriesOptionsRegistry {
        SeriesColoredlineOptions?: SeriesColoredlineOptions;
        SeriesColoredareaOptions?: SeriesColoredareaOptions;
    }
}

export {
    ColoredlineSeriesOptions,
    SeriesColored,
    SeriesColoredPoint,
    SeriesColoredSegment,
    SeriesColoredSegmentPath,
    SeriesColoredGraphPath
};
