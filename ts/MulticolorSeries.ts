import SeriesRegistry from 'highcharts-github/ts/Core/Series/SeriesRegistry';
import Utilities from 'highcharts-github/ts/Core/Utilities';
import Series from 'highcharts-github/ts/Core/Series/Series';
import LineSeries from 'highcharts-github/ts/Series/Line/LineSeries';
import type LinePoint from 'highcharts-github/ts/Series/Line/LinePoint';
import type AreaPoint from 'highcharts-github/ts/Series/Area/AreaPoint';
import type PointerEvent from 'highcharts-github/ts/Core/PointerEvent';
import type SVGElement from 'highcharts-github/ts/Core/Renderer/SVG/SVGElement';
import type SVGAttributes from 
    'highcharts-github/ts/Core/Renderer/SVG/SVGAttributes';
import type ColorType from 'highcharts-github/ts/Core/Color/ColorType';
import type SVGPath from 'highcharts-github/ts/Core/Renderer/SVG/SVGPath';
import { type StatesOptionsKey } from 
    'highcharts-github/ts/Core/Series/StatesOptions';
import type { SeriesTypeOptions } from
    'highcharts-github/ts/Core/Series/SeriesType';
import type Chart from 'highcharts-github/ts/Core/Chart/Chart';
import {
    type SeriesColoredPoint,
    type SeriesColoredSegment,
    type SeriesColoredSegmentPath,
    type SeriesColoredGraphPath
} from 'types';

/**
 *
 *  Helpers
 *
 */

const { isArray, pick } = Utilities;

const containsStringNumberNumberSequence = (
    sequenceValue: SeriesColoredSegmentPath[]
): boolean => {
    let isSequenceFound = false;

    for (let index = 0; index < sequenceValue.length; index++) {
        if (
            typeof sequenceValue[index] === 'string' &&
            typeof sequenceValue[index + 1] === 'number' &&
            typeof sequenceValue[index + 2] === 'number'
        ) {
            isSequenceFound = true;
        } else {
            isSequenceFound = false;
            break;
        }

        index += 2;
    }

    return isSequenceFound;
};

/**
 *
 *  Type guards
 *
 */

const isSVGPathSegment = (
    value: SeriesColoredSegmentPath[]
): value is SVGPath.Segment[] => containsStringNumberNumberSequence(value);

/**
 *
 *  Coloredline series
 *
 */

/**
 *
 *  Declarations
 *
 */

type SeriesColoredlinePoint = SeriesColoredPoint<LinePoint>;

type SeriesColoredlineSegment = SeriesColoredSegment<SeriesColoredlinePoint>;

/**
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.coloredline
 *
 */

class ColoredlineSeries extends LineSeries {

    /**
     *
     *  Constructor
     *
     */

    constructor() {
        super();

        this.segments = [];
        this.singlePoints = [];
        this.graphPaths = [];
        this.areaPaths = [];
        this.graphs = [];
    }

    /**
     *
     *  Properties
     *
     */

    public pointRange: number | undefined;

    public singlePoints: SeriesColoredlinePoint[];

    public points!: SeriesColoredlinePoint[];

    public segments: SeriesColoredlineSegment[];

    // Overrides graphPath property from the Series type.
    public graphPaths: SeriesColoredGraphPath[] | undefined;

    // Overrides areaPath property from the Series type.
    public areaPaths: SeriesColoredSegmentPath[];

    // Overrides graph property from Series type.
    public graphs: SVGElement[] | [];

    /**
     *
     *  Functions
     *
     */

    public getPath (
        graphPaths: SeriesColoredGraphPath[] | undefined
    ): SeriesColoredSegmentPath[] {
        let segmentPath: SeriesColoredSegmentPath[] = [];

        if (graphPaths) {
            graphPaths.forEach((graphPath): void => {
                if (isArray(graphPath[0])) {
                    segmentPath = segmentPath.concat(graphPath[0]);
                }
            });
        }

        return segmentPath;
    }

    public getSegmentPath (
        segment: SeriesColoredlinePoint[]
    ): SeriesColoredSegmentPath[] {
        const series = this,
            segmentPath: SeriesColoredSegmentPath[] = [],
            step = series.options.step;

        // Build the segment line
        segment.forEach((point, index: number): void => {
            const plotX = Number(point.plotX),
                plotY = Number(point.plotY);

            let lastPoint;

            // Declarations: moveTo or lineTo
            segmentPath.push(index ? 'L' : 'M');

            // Step line?
            if (step && index) {
                lastPoint = segment[index - 1];
                const lastPointPlotX = Number(lastPoint.plotX);

                if (step === 'right') {
                    segmentPath.push(
                        lastPoint.plotX,
                        plotY,
                        'L'
                    );
                } else if (step === 'center') {
                    segmentPath.push(
                        (lastPointPlotX + plotX) / 2,
                        lastPoint.plotY,
                        'L',
                        (lastPointPlotX + plotX) / 2,
                        plotY,
                        'L'
                    );
                } else {
                    segmentPath.push(
                        plotX,
                        lastPoint.plotY,
                        'L'
                    );
                }
            }

            // Normal line to next point
            segmentPath.push(
                plotX,
                plotY
            );
        });

        return segmentPath;
    }

    // Handle unsorted data, throw error anyway
    public error (code: number, stop?: boolean): void {
        const msg =
            'Highcharts error #' + code + ': www.highcharts.com/errors/' + code;

        if (stop) {
            throw msg;
        } else if (window.console) {
            console.error(msg);
        }
    }

    public processData (force?: boolean): boolean {
        const series = this,
            processedXData = series.xData, // Copied during slice operation below
            processedYData = series.yData,
            cropStart = 0,
            xAxis = series.xAxis,
            options = series.options,
            isCartesian = series.isCartesian;

        let cropped,
            distance,
            closestPointRange: undefined | number;

        // If the series data or axes haven't changed, don't go through this. Return false to pass
        // the message on to override methods like in data grouping.
        if (
            isCartesian &&
            !series.isDirty &&
            !xAxis.isDirty &&
            !series.yAxis.isDirty && 
            !force
        ) {
            return false;
        }

        if (processedXData && processedYData) {
            // Find the closest distance between processed points
            for (let index = processedXData.length - 1; index >= 0; index--) {
                distance = processedXData[index] - processedXData[index - 1];

                if (
                    distance > 0 &&
                    (typeof closestPointRange === 'undefined' ||
                    distance < closestPointRange)
                ) {
                    closestPointRange = distance;

                    // Unsorted data is not supported by the line tooltip, as well as data grouping and
                    // navigation in Stock charts (#725) and width calculation of columns (#1900)
                } else if (distance < 0 && series.requireSorting) {
                    this.error(15);
                }
            }

            // Record the properties
            series.cropped = cropped; // Type: undefined or true
            series.cropStart = cropStart;
            series.processedXData = processedXData;
            series.processedYData = processedYData;

            if (options.pointRange === null) { // Type: null means auto, as for columns, candlesticks and OHLC
                series.pointRange = closestPointRange || 1;
            }

            series.closestPointRange = closestPointRange;
        }

        return true;
    }

    public formatTrackerPath (
        trackerPath: SeriesColoredSegmentPath[]
    ): SeriesColoredSegmentPath[] {
        const series = this,
            options = series.options,
            trackerPathLength = trackerPath.length,
            singlePoints = series.singlePoints,
            snap = series.chart.options.tooltip?.snap ?? 0;

        let singlePoint,
            index;

        // Extend end points. A better way would be to use round linecaps,
        // but those are not clickable in VML.
        if (trackerPathLength && !options.trackByArea) {
            index = trackerPathLength + 1;

            while (index--) {
                if (trackerPath[index]?.toString() === 'M') { // Extend left side
                    const nextTrackerPath = trackerPath[index + 1];

                    if (typeof nextTrackerPath === 'number') {
                        trackerPath.splice(
                            index + 1,
                            0,
                            nextTrackerPath - snap,
                            trackerPath[index + 2],
                            'L'
                        );
                    }
                }

                if (
                    (
                        index &&
                        trackerPath[index]?.toString() === 'M'
                    ) ||
                    index === trackerPathLength
                ) { // Extend right side
                    const subPreviousTrackerPath = trackerPath[index - 2];

                    if (typeof subPreviousTrackerPath === 'number') {
                        trackerPath.splice(
                            index,
                            0,
                            'L',
                            subPreviousTrackerPath + snap,
                            trackerPath[index - 1]
                        );
                    }
                }
            }
        }

        // Handle single points
        for (index = 0; index < singlePoints.length; index++) {
            singlePoint = singlePoints[index];
            const singlePointPlotX = Number(singlePoint.plotX);

            trackerPath.push(
                'M',
                singlePointPlotX - snap,
                singlePoint.plotY,
                'L',
                singlePointPlotX + snap,
                singlePoint.plotY
            );
        }

        return trackerPath;
    }

    public drawTracker(): void {
        const series = this,
            options = series.options,
            trackByArea = options.trackByArea,
            trackerPath =
                trackByArea ? series.areaPaths :
                    this.getPath(series.graphPaths),
            chart = series.chart,
            pointer = chart.pointer,
            renderer = chart.renderer,
            snap = chart.options.tooltip?.snap ?? 0,
            tracker = series.tracker,
            cursor = options.cursor,
            css = cursor && { cursor },
            trackerFill = 'rgba(192,192,192,0.002)';

        const onMouseOver = (): void => {
            if (chart.hoverSeries !== series) {
                series.onMouseOver();
            }
        };

        const formattedTrackerPath = this.formatTrackerPath(trackerPath);

        // Draw the tracker
        if (isSVGPathSegment(formattedTrackerPath)) {
            if (tracker) {
                tracker.attr({ d: formattedTrackerPath });
            } else { // Create a tracker
                series.tracker = renderer.path(formattedTrackerPath)
                    .attr({
                        'stroke-linejoin': 'round', // #1225
                        visibility: series.visible ? 'visible' : 'hidden',
                        stroke: trackerFill,
                        fill: trackByArea ? trackerFill : 'none',
                        'stroke-width': options.lineWidth ?? 0 +
                            (trackByArea ? 0 : 2 * snap),
                        zIndex: 2
                    })
                    .add(series.group);

                // The tracker is added to the series group, which is clipped, but is covered
                // by the marker group. So the marker group also needs to capture events.
                [series.tracker, series.markerGroup]
                    .forEach((track): void => {
                        if (track) {
                            track.addClass('highcharts-tracker')
                                .on('mouseover', onMouseOver)
                                .on('mouseout', (event: PointerEvent): void => {
                                    if (pointer) {
                                        pointer.onTrackerMouseOut(event);
                                    }
                                });

                            if (css) {
                                track.css(css);
                            }

                            if (
                                typeof document.documentElement.ontouchstart !==
                                    'undefined'
                            ) {
                                track.on('touchstart', onMouseOver);
                            }
                        }
                    });
            }
        }
    }

    public setState (state?: (StatesOptionsKey | '')): void {
        const series = this,
            options = series.options,
            graphs = series.graphs,
            stateOptions = options.states;

        let lineWidth = options.lineWidth ?? 0;

        state = state || '';

        if (series.state !== state) {
            series.state = state;

            if (
                stateOptions &&
                state &&
                (
                    stateOptions.hover?.enabled === false ||
                    stateOptions.inactive?.enabled === false
                )
            ) {
                return;
            }

            if (stateOptions && state) {
                lineWidth = stateOptions[state]?.lineWidth || lineWidth + 1;
            }

            if (graphs) { // Hover is turned off for dashed lines in VML
                // use attr because animate will cause any other animation on the graph to stop
                graphs.forEach((graph: SVGElement): void => {
                    if (!graph.dashstyle) {
                        graph.attr({ 'stroke-width': lineWidth });
                    }
                });
            }
        }
    }

    public getSegments(): void {
        const series = this,
            points = series.points;

        let segments: SeriesColoredlineSegment[] = [],
            lastColor = 0,
            pointsLength = points.length;

        if (pointsLength) { // No action required for []
            // if connect nulls, just remove null points
            if (series.options.connectNulls) {
                // Iterate backwars for secure point removal
                for (let index = pointsLength - 1; index >= 0; --index) {
                    if (points[index].y === null) {
                        points.splice(index, 1);
                    }
                }
                pointsLength = points.length;

                points.forEach((_point, pointIndex): void => {
                    if (
                        pointIndex > 0 &&
                        points[pointIndex].segmentColor !==
                            points[pointIndex - 1].segmentColor
                    ) {
                        segments.push({
                            points: points.slice(lastColor, pointIndex + 1),
                            color: points[pointIndex - 1].segmentColor ?? ''
                        });

                        lastColor = pointIndex;
                    }
                });

                if (pointsLength) {
                    // Add the last segment (only single-point last segement is added)
                    if (lastColor !== pointsLength - 1) {
                        segments.push({
                            points: points.slice(lastColor, pointsLength),
                            color: points[pointsLength - 1].segmentColor ?? ''
                        });
                    }
                }

                if ((points.length > 0) && segments.length === 0) {
                    segments = [
                        {
                            color: points[0].segmentColor ?? '',
                            points
                        }
                    ];
                }

                // Else, split on null points or different colors
            } else {
                let previousColor: string | null = null;

                points.forEach((point, pointIndex): void => {
                    const colorChanged = pointIndex > 0 && (
                            point.y === null ||
                            points[pointIndex - 1].y === null ||
                            (
                                point.segmentColor !==
                                    points[pointIndex - 1].segmentColor &&
                                points[pointIndex].segmentColor !==
                                    previousColor
                            )
                        ),
                        colorExists = !!(points[pointIndex - 1]?.segmentColor &&
                            points[pointIndex - 1].y !== null);

                    let formattedPoints =
                        points.slice(lastColor, pointIndex + 1);

                    if (colorChanged) {
                        if (formattedPoints.length > 0) {
                            // Do not create segments with null ponits
                            formattedPoints.forEach((pointObject, k): void => {
                                if (pointObject.y === null) {
                                    // Remove null points (might be on edges)
                                    formattedPoints.splice(k, 1);
                                }
                            });

                            segments.push({
                                points: formattedPoints,
                                color: (
                                    colorExists ?
                                        points[pointIndex - 1].segmentColor :
                                        previousColor
                                ) ?? ''
                            });

                            lastColor = pointIndex;
                        }
                    } else if (pointIndex === pointsLength - 1) {
                        let next = pointIndex + 1;

                        if (point.y === null) {
                            next--;
                        }

                        formattedPoints = points.slice(lastColor, next);

                        if (formattedPoints.length > 0) {
                            // Do not create segments with null ponits
                            formattedPoints.forEach((
                                formattedPoint, formattedPointIndex
                            ): void => {
                                if (formattedPoint.y === null) {
                                    // Remove null points (might be on edges)
                                    formattedPoints.splice(
                                        formattedPointIndex, 1
                                    );
                                }
                            });

                            segments.push({
                                points: formattedPoints,
                                color: (
                                    colorExists ?
                                        points[pointIndex - 1].segmentColor :
                                        previousColor
                                ) ?? ''
                            });

                            lastColor = pointIndex;
                        }
                    }

                    // Store previous color
                    if (point) {
                        previousColor = point.segmentColor ?? '';
                    }
                });
            }
        }

        // Register it
        series.segments = segments;
    }

    public setSeriesGraphPathsAndSinglePoints(): SeriesColoredGraphPath[] {
        const series = this,
            graphPaths: SeriesColoredGraphPath[] = [];

        let singlePoints: SeriesColoredlinePoint[] = [], // Used in drawTracker
            segmentPath;

        // Divide into segments and build graph and area paths
        series.segments.forEach((segment): void => {
            segmentPath = series.getSegmentPath(segment.points);

            // Add the segment to the graph, or a single point for tracking
            if (segment.points.length > 1) {
                graphPaths.push([segmentPath, segment.color]);
            } else {
                singlePoints = [...singlePoints, ...segment.points];
            }
        });

        // Record it for use in drawGraph and drawTracker, and return graphPaths
        series.singlePoints = singlePoints;
        series.graphPaths = graphPaths;

        return graphPaths;
    }

    public getSegment = (
        segment: SeriesColoredGraphPath,
        colorType: ColorType
    ): SVGElement | undefined => {
        const series = this,
            options = series.options,
            lineWidth = options.lineWidth,
            dashStyle = options.dashStyle,
            roundCap = options.linecap !== 'square',
            attribs: SVGAttributes = {
                stroke: colorType,
                'stroke-width': lineWidth,
                fill: 'none',
                zIndex: 1 // #1069
            };

        let item;

        if (dashStyle) {
            attribs.dashstyle = dashStyle;
        } else if (roundCap) {
            attribs['stroke-linecap'] =
                attribs['stroke-linejoin'] = 'round';
        }

        if (segment[1]) {
            attribs.stroke = segment[1];
        }

        if (isSVGPathSegment(segment[0])) {
            item = series.chart.renderer.path(segment[0])
                .attr(attribs)
                .add(series.group);
        }

        if (item?.shadow) {
            item.shadow(!!options.shadow);
        }

        return item;
    };

    public drawGraph(): void {
        const series = this,
            options = series.options,
            colorType = options.lineColor || series.color || '',
            graphPaths = series.setSeriesGraphPathsAndSinglePoints(),
            graphPathLength = graphPaths.length;

        let graphSegmentsLength = 0;

        // Draw the graphs
        let graphs = series.graphs;

        if (graphs) { // Cancel running animations, #459
            // do we have animation
            graphPaths.forEach((segment, segmentIndex): void => {
                // Update color and path
                if (
                    series.graphs[segmentIndex] && isSVGPathSegment(segment[0])
                ) {
                    series.graphs[segmentIndex].attr({
                        d: segment[0],
                        stroke: segment[1]
                    });
                } else {
                    const formattedSegment =
                        this.getSegment(segment, colorType);

                    if (formattedSegment) {
                        series.graphs[segmentIndex] = formattedSegment;
                    }
                }
            });
        } else if (graphPaths.length > 0) { // #1487
            graphs = [];
            graphPaths.forEach((segment, segmentIndex): void => {
                const formattedSegment = this.getSegment(segment, colorType);

                if (formattedSegment) {
                    graphs[segmentIndex] = formattedSegment;
                }
            });

            series.graphs = graphs;
        }
        // Checks if series.graphs exists. #3
        graphSegmentsLength = (series.graphs && series.graphs.length) || -1;

        for (
            let index = graphSegmentsLength;
            index >= graphPathLength;
            index--
        ) {
            if (series.graphs && series.graphs[index]) {
                series.graphs[index].destroy();
                series.graphs.splice(index, 1);
            }
        }
    }

    /**
     *
     *  Events
     *
     */

    public translate(): void {
        super.translate.apply(this, arguments);

        if (this.getSegments) {
            this.getSegments();
        }
    }
}

/**
 *
 *  Registry
 *
 */

SeriesRegistry.registerSeriesType('coloredline', ColoredlineSeries);

/**
 *
 *  Coloredarea series
 *
 */

/**
 *
 *  Declarations
 *
 */

type SeriesColoredareaPoint = SeriesColoredPoint<AreaPoint>;

type SeriesColoredareaSegment = SeriesColoredSegment<SeriesColoredareaPoint>;

/**
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.coloredarea
 *
 */

class ColoredareaSeries extends ColoredlineSeries {

    /**
     *
     *  Constructor
     *
     */

    constructor() {
        super();

        this.segments = [];
        this.singlePoints = [];
    }

    /**
     *
     *  Properties
     *
     */

    public singlePoints: SeriesColoredareaPoint[];

    public points!: SeriesColoredareaPoint[];

    public segments: SeriesColoredareaSegment[];

    /**
     *
     *  Functions
     *
     */

    public init(chart: Chart, options: DeepPartial<SeriesTypeOptions>): void {
        options.threshold = options.threshold || null;
        Series.prototype.init.call(this, chart, options);
    }

    public closeSegment(
        path: SeriesColoredSegmentPath[],
        segment: SeriesColoredareaPoint[],
        translatedThreshold: number
    ): void {
        path.push(
            'L',
            segment[segment.length - 1].plotX,
            translatedThreshold,
            'L',
            segment[0].plotX,
            translatedThreshold
        );
    }

    public drawGraph(): void {
        ColoredlineSeries.prototype.drawGraph.call(this);

        const series = this,
            graphs = series.graphs;

        if (graphs) { // Cancel running animations, #459
            // do we have animation
            series?.graphPaths?.forEach((segment, index): void => {

                // Update color and path
                if (series.graphs[index]) {
                    series.graphs[index].attr({ fill: segment[1] });
                }
            });
        }
    }

    public getSegmentPath(
        segment: SeriesColoredareaPoint[]
    ): SeriesColoredSegmentPath[] {
        const segmentPath = 
            ColoredlineSeries.prototype.getSegmentPath.call(this, segment), // Call base method
            areaSegmentPath = [...segmentPath], // Work on a copy for the area path
            options = this.options,
            segLength = segmentPath.length,
            translatedThreshold =
                this.yAxis.getThreshold(options.threshold ?? 0); // #2181

        let yBottom;

        if (segLength === 3) { // For animation from 1 to two points
            areaSegmentPath.push('L', segmentPath[1], segmentPath[2]);
        }

        if (options.stacking) {
            for (let index = segment.length - 1; index >= 0; index--) {
                yBottom = pick(segment[index].yBottom, translatedThreshold);

                // Step line?
                if (index < segment.length - 1 && options.step) {
                    areaSegmentPath.push(segment[index + 1].plotX, yBottom);
                }

                areaSegmentPath.push(segment[index].plotX, yBottom);
            }
        } else { // Follow zero line back
            this.closeSegment(areaSegmentPath, segment, translatedThreshold);
        }

        return areaSegmentPath;
    }

    public setSeriesGraphPathsAndSinglePoints(): SeriesColoredGraphPath[] {
        const series = this,
            graphPaths: SeriesColoredGraphPath[] = [];

        let singlePoints: SeriesColoredareaPoint[] = [], // Used in drawTracker
            segmentPaths;

        // Divide into segments and build graph and area paths
        this.areaPaths = [];
        series.segments.forEach((segment): void => {
            segmentPaths = series.getSegmentPath(segment.points);

            // Add the segment to the graph, or a single point for tracking
            if (segment.points.length > 1) {
                graphPaths.push([segmentPaths, segment.color]);
            } else {
                singlePoints = [...singlePoints, ...segment.points];
            }
        });

        // Record it for use in drawGraph and drawTracker, and return graphPaths
        series.singlePoints = singlePoints;
        series.graphPaths = graphPaths;

        return graphPaths;

    }
}

/**
 *
 *  Registry
 *
 */

SeriesRegistry.registerSeriesType('coloredarea', ColoredareaSeries);

export { ColoredlineSeries, ColoredareaSeries };
