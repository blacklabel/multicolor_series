/**
 *
 * Static file (not generated during the compilation).
 *
 */

import * as _Highcharts from "highcharts";

interface SeriesColoredPoint extends Highcharts.Point {
    segmentColor?: string;
}

type SeriesColoredSegment = {
    color: string;
    points: SeriesColoredPoint[];
};
type GraphPaths = SeriesColoredGraphPath[] | undefined;
type SeriesColoredSegmentPath = _Highcharts.SVGPathArray | string | number| undefined;
type SeriesColoredGraphPath = [SeriesColoredSegmentPath[], _Highcharts.ColorType];

type SeriesMulticolor = {
    pointRange?: number | undefined;
    singlePoints?: SeriesColoredPoint[];
    segments?: SeriesColoredSegment[];
    graphPaths?: GraphPaths;
    areaPaths?: SeriesColoredSegmentPath[];
    graphs?: _Highcharts.SVGElement[] | [];
    getPath?: (graphPaths: GraphPaths) => SeriesColoredSegmentPath[];
    getSegmentPath?: (segment: SeriesColoredPoint[]) => SeriesColoredSegmentPath[];
    processData?: (force?: boolean) => boolean;
    formatTrackerPath?: (trackerPath: SeriesColoredSegmentPath[]) => SeriesColoredSegmentPath[];
    drawTracker?: () => void;
    getSegments?: () => void;
    setSeriesGraphPathsAndSinglePoints?: () => SeriesColoredGraphPath[];
    getSegment?: (segment: SeriesColoredGraphPath,colorType: _Highcharts.ColorType) => SVGElement | undefined;
    drawGraph?: () => void;
};

declare module "highcharts" {
    interface Point {
        segmentColor?: string;
    }
    interface Series extends SeriesMulticolor {}
    interface SeriesMulticolorLineOptions extends _Highcharts.SeriesOptions, SeriesMulticolor {}
    interface SeriesMulticolorAreaOptions extends _Highcharts.SeriesOptions, SeriesMulticolor {
        closeSegment?: (
            path: SeriesColoredSegmentPath[],
            segment: SeriesColoredPoint[],
            translatedThreshold: number
        ) => void;
    }
}

export function factory(highcharts: typeof _Highcharts): void;
export default factory;
export let Highcharts: typeof _Highcharts;
