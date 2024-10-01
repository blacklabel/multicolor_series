/**
 *
 * Static file (not generated during the compilation).
 *
 */

import * as _Highcharts from "highcharts";

interface SeriesColoredPoint extends _Highcharts.Point {
    segmentColor?: string;
}

type GraphPaths = SeriesColoredGraphPath[] | undefined;
type SeriesColoredSegmentPath =
    | _Highcharts.SVGPathArray
    | string
    | number
    | undefined;

type SeriesColoredGraphPath = [
    SeriesColoredSegmentPath[],
    _Highcharts.ColorType
];

declare module "highcharts" {
    interface Series {
        pointRange?: number | undefined;
        singlePoints?: SeriesColoredPoint[];
        segments?: {
            color: string;
            points: SeriesColoredPoint[];
        }[];
        graphPaths?: GraphPaths;
        areaPaths?: SeriesColoredSegmentPath[];
        graphs?: _Highcharts.SVGElement[] | [];
        getPath?: (graphPaths: GraphPaths) => SeriesColoredSegmentPath[];
        getSegmentPath?: (
            segment: SeriesColoredPoint[]
        ) => SeriesColoredSegmentPath[];
        processData?: (force?: boolean) => boolean;
        formatTrackerPath?: (
            trackerPath: SeriesColoredSegmentPath[]
        ) => SeriesColoredSegmentPath[];
        drawTracker?: () => void;
        getSegments?: () => void;
        setSeriesGraphPathsAndSinglePoints?: () => SeriesColoredGraphPath[];
        getSegment?: (
            segment: SeriesColoredGraphPath,
            colorType: _Highcharts.ColorType
        ) => SVGElement | undefined;
        closeSegment?: (
            path: SeriesColoredSegmentPath[],
            segment: SeriesColoredPoint[],
            translatedThreshold: number
        ) => void;
    }
    
    interface Point {
        segmentColor?: string;
    }

    interface PointOptionsObject {
        segmentColor?: string;
    }

    interface SeriesMulticolorLineOptions extends _Highcharts.PlotLineOptions, _Highcharts.SeriesOptions {
        type: 'coloredline',
        data?: Array<(number|[(number|string), (number|null)]|null|PointOptionsObject)>;
    }

    interface SeriesMulticolorAreaOptions extends _Highcharts.PlotAreaOptions, _Highcharts.SeriesOptions {
        type: 'coloredarea',
        data?: Array<(number|[(number|string), (number|null)]|null|PointOptionsObject)>;
    }

    interface SeriesOptionsRegistry {
        SeriesMulticolorLineOptions: SeriesMulticolorLineOptions;
        SeriesMulticolorAreaOptions: SeriesMulticolorAreaOptions;
    }
}

export function factory(highcharts: typeof _Highcharts): void;
export default factory;
export let Highcharts: typeof _Highcharts;
