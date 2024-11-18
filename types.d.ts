import type SVGPath from "highcharts-github/ts/Core/Renderer/SVG/SVGPath";
import type ColorType from "highcharts-github/ts/Core/Color/ColorType";

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
    points: Array<SeriesColoredPoint<T>>;
};

type SeriesColoredSegmentPath = SVGPath.Segment | string | number | undefined;

type SeriesColoredGraphPath = [SeriesColoredSegmentPath[], ColorType];

export {
    SeriesColoredPoint,
    SeriesColoredSegment,
    SeriesColoredSegmentPath,
    SeriesColoredGraphPath
};
