/**
----
*
* (c) 2012-2024 Black Label
*
* License: Creative Commons Attribution (CC)
*/
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (Highcharts) {
	const _modules = Highcharts ? Highcharts._modules : {},
		_registerModule = (obj, path, args, fn) => {
			if (!obj.hasOwnProperty(path)) {
				obj[path] = fn.apply(null, args);

				if (typeof CustomEvent === 'function') {
					window.dispatchEvent(new CustomEvent(
						'HighchartsModuleLoaded',
						{ detail: { path: path, module: obj[path] } }
					));
				}
			}
		}

		_registerModule(
			_modules,
			'Extensions/MulticolorSeries.js',
			[_modules['Core/Series/SeriesRegistry.js'],_modules['Core/Utilities.js'],_modules['Series/Line/LineSeries.js']],
			(SeriesRegistry,Utilities,LineSeries) => {
				


/**
 *
 *  Helpers
 *
 */
const { isArray, pick, error } = Utilities;
const containsStringNumberNumberSequence = (sequenceValue) => {
    let isSequenceFound = false;
    for (let index = 0; index < sequenceValue.length; index++) {
        if (typeof sequenceValue[index] === 'string' &&
            typeof sequenceValue[index + 1] === 'number' &&
            typeof sequenceValue[index + 2] === 'number') {
            isSequenceFound = true;
        }
        else {
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
const isSVGPathSegment = (value) => containsStringNumberNumberSequence(value);
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
        this.getSegment = (segment, colorType) => {
            const series = this, options = series.options, lineWidth = options.lineWidth, dashStyle = options.dashStyle, roundCap = options.linecap !== 'square', attribs = {
                stroke: colorType,
                'stroke-width': lineWidth,
                fill: 'none',
                zIndex: 1 // #1069
            };
            let item;
            if (dashStyle) {
                attribs.dashstyle = dashStyle;
            }
            else if (roundCap) {
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
            if (item === null || item === void 0 ? void 0 : item.shadow) {
                item.shadow(!!options.shadow);
            }
            return item;
        };
        this.segments = [];
        this.singlePoints = [];
        this.graphPaths = [];
        this.areaPaths = [];
        this.graphs = [];
    }
    /**
     *
     *  Functions
     *
     */
    getPath(graphPaths) {
        let segmentPath = [];
        if (graphPaths) {
            graphPaths.forEach((graphPath) => {
                if (isArray(graphPath[0])) {
                    segmentPath = segmentPath.concat(graphPath[0]);
                }
            });
        }
        return segmentPath;
    }
    getSegmentPath(segment) {
        const series = this, segmentPath = [], step = series.options.step;
        // Build the segment line
        segment.forEach((point, index) => {
            const plotX = Number(point.plotX), plotY = Number(point.plotY);
            let lastPoint;
            // Declarations: moveTo or lineTo
            segmentPath.push(index ? 'L' : 'M');
            // Step line?
            if (step && index) {
                lastPoint = segment[index - 1];
                const lastPointPlotX = Number(lastPoint.plotX);
                if (step === 'right') {
                    segmentPath.push(lastPoint.plotX, plotY, 'L');
                }
                else if (step === 'center') {
                    segmentPath.push((lastPointPlotX + plotX) / 2, lastPoint.plotY, 'L', (lastPointPlotX + plotX) / 2, plotY, 'L');
                }
                else {
                    segmentPath.push(plotX, lastPoint.plotY, 'L');
                }
            }
            // Normal line to next point
            segmentPath.push(plotX, plotY);
        });
        return segmentPath;
    }
    processData(force) {
        const series = this, processedXData = series.xData, // Copied during slice operation below
        processedYData = series.yData, cropStart = 0, xAxis = series.xAxis, options = series.options, isCartesian = series.isCartesian;
        let cropped, distance, closestPointRange;
        // If the series data or axes haven't changed, don't go through this. Return false to pass
        // the message on to override methods like in data grouping.
        if (isCartesian &&
            !series.isDirty &&
            !xAxis.isDirty &&
            !series.yAxis.isDirty &&
            !force) {
            return false;
        }
        if (processedXData && processedYData) {
            // Find the closest distance between processed points
            for (let index = processedXData.length - 1; index >= 0; index--) {
                distance = processedXData[index] - processedXData[index - 1];
                if (distance > 0 &&
                    (typeof closestPointRange === 'undefined' ||
                        distance < closestPointRange)) {
                    closestPointRange = distance;
                    // Unsorted data is not supported by the line tooltip, as well as data grouping and
                    // navigation in Stock charts (#725) and width calculation of columns (#1900)
                }
                else if (distance < 0 && series.requireSorting) {
                    error(15);
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
    formatTrackerPath(trackerPath) {
        var _a, _b, _c, _d;
        const series = this, options = series.options, trackerPathLength = trackerPath.length, singlePoints = series.singlePoints, snap = (_b = (_a = series.chart.options.tooltip) === null || _a === void 0 ? void 0 : _a.snap) !== null && _b !== void 0 ? _b : 0;
        let singlePoint, index;
        // Extend end points. A better way would be to use round linecaps,
        // but those are not clickable in VML.
        if (trackerPathLength && !options.trackByArea) {
            index = trackerPathLength + 1;
            while (index--) {
                if (((_c = trackerPath[index]) === null || _c === void 0 ? void 0 : _c.toString()) === 'M') { // Extend left side
                    const nextTrackerPath = trackerPath[index + 1];
                    if (typeof nextTrackerPath === 'number') {
                        trackerPath.splice(index + 1, 0, nextTrackerPath - snap, trackerPath[index + 2], 'L');
                    }
                }
                if ((index &&
                    ((_d = trackerPath[index]) === null || _d === void 0 ? void 0 : _d.toString()) === 'M') ||
                    index === trackerPathLength) { // Extend right side
                    const subPreviousTrackerPath = trackerPath[index - 2];
                    if (typeof subPreviousTrackerPath === 'number') {
                        trackerPath.splice(index, 0, 'L', subPreviousTrackerPath + snap, trackerPath[index - 1]);
                    }
                }
            }
        }
        // Handle single points
        for (index = 0; index < singlePoints.length; index++) {
            singlePoint = singlePoints[index];
            const singlePointPlotX = Number(singlePoint.plotX);
            trackerPath.push('M', singlePointPlotX - snap, singlePoint.plotY, 'L', singlePointPlotX + snap, singlePoint.plotY);
        }
        return trackerPath;
    }
    drawTracker() {
        var _a, _b, _c;
        const series = this, options = series.options, trackByArea = options.trackByArea, trackerPath = trackByArea ? series.areaPaths :
            this.getPath(series.graphPaths), chart = series.chart, pointer = chart.pointer, renderer = chart.renderer, snap = (_b = (_a = chart.options.tooltip) === null || _a === void 0 ? void 0 : _a.snap) !== null && _b !== void 0 ? _b : 0, tracker = series.tracker, cursor = options.cursor, css = cursor && { cursor }, trackerFill = 'rgba(192,192,192,0.002)';
        const onMouseOver = () => {
            if (chart.hoverSeries !== series) {
                series.onMouseOver();
            }
        };
        const formattedTrackerPath = this.formatTrackerPath(trackerPath);
        // Draw the tracker
        if (isSVGPathSegment(formattedTrackerPath)) {
            if (tracker) {
                tracker.attr({ d: formattedTrackerPath });
            }
            else { // Create a tracker
                series.tracker = renderer.path(formattedTrackerPath)
                    .attr({
                    'stroke-linejoin': 'round',
                    visibility: series.visible ? 'visible' : 'hidden',
                    stroke: trackerFill,
                    fill: trackByArea ? trackerFill : 'none',
                    'stroke-width': (_c = options.lineWidth) !== null && _c !== void 0 ? _c : 0 +
                        (trackByArea ? 0 : 2 * snap),
                    zIndex: 2
                })
                    .add(series.group);
                // The tracker is added to the series group, which is clipped, but is covered
                // by the marker group. So the marker group also needs to capture events.
                [series.tracker, series.markerGroup]
                    .forEach((track) => {
                    if (track) {
                        track.addClass('highcharts-tracker')
                            .on('mouseover', onMouseOver)
                            .on('mouseout', (event) => {
                            if (pointer) {
                                pointer.onTrackerMouseOut(event);
                            }
                        });
                        if (css) {
                            track.css(css);
                        }
                        if (typeof document.documentElement.ontouchstart !==
                            'undefined') {
                            track.on('touchstart', onMouseOver);
                        }
                    }
                });
            }
        }
    }
    setState(state, 
    // Unused inherit argument added to keep the same type as in the Series.
    _inherit) {
        var _a, _b, _c, _d;
        const series = this, options = series.options, graphs = series.graphs, stateOptions = options.states;
        let lineWidth = (_a = options.lineWidth) !== null && _a !== void 0 ? _a : 0;
        state = state || '';
        if (series.state !== state) {
            series.state = state;
            if (stateOptions &&
                state &&
                (((_b = stateOptions.hover) === null || _b === void 0 ? void 0 : _b.enabled) === false ||
                    ((_c = stateOptions.inactive) === null || _c === void 0 ? void 0 : _c.enabled) === false)) {
                return;
            }
            if (stateOptions && state) {
                lineWidth = ((_d = stateOptions[state]) === null || _d === void 0 ? void 0 : _d.lineWidth) || lineWidth + 1;
            }
            if (graphs) { // Hover is turned off for dashed lines in VML
                // use attr because animate will cause any other animation on the graph to stop
                graphs.forEach((graph) => {
                    if (!graph.dashstyle) {
                        graph.attr({ 'stroke-width': lineWidth });
                    }
                });
            }
        }
    }
    getSegments() {
        var _a, _b;
        const series = this, points = series.points;
        let segments = [], lastColor = 0, pointsLength = points.length;
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
                points.forEach((_point, pointIndex) => {
                    var _a;
                    if (pointIndex > 0 &&
                        points[pointIndex].segmentColor !==
                            points[pointIndex - 1].segmentColor) {
                        segments.push({
                            points: points.slice(lastColor, pointIndex + 1),
                            color: (_a = points[pointIndex - 1].segmentColor) !== null && _a !== void 0 ? _a : ''
                        });
                        lastColor = pointIndex;
                    }
                });
                if (pointsLength) {
                    // Add the last segment (only single-point last segement is added)
                    if (lastColor !== pointsLength - 1) {
                        segments.push({
                            points: points.slice(lastColor, pointsLength),
                            color: (_a = points[pointsLength - 1].segmentColor) !== null && _a !== void 0 ? _a : ''
                        });
                    }
                }
                if ((points.length > 0) && segments.length === 0) {
                    segments = [
                        {
                            color: (_b = points[0].segmentColor) !== null && _b !== void 0 ? _b : '',
                            points
                        }
                    ];
                }
                // Else, split on null points or different colors
            }
            else {
                let previousColor = null;
                points.forEach((point, pointIndex) => {
                    var _a, _b, _c, _d;
                    const colorChanged = pointIndex > 0 && (point.y === null ||
                        points[pointIndex - 1].y === null ||
                        (point.segmentColor !==
                            points[pointIndex - 1].segmentColor &&
                            points[pointIndex].segmentColor !==
                                previousColor)), colorExists = !!(((_a = points[pointIndex - 1]) === null || _a === void 0 ? void 0 : _a.segmentColor) &&
                        points[pointIndex - 1].y !== null);
                    let formattedPoints = points.slice(lastColor, pointIndex + 1);
                    if (colorChanged) {
                        if (formattedPoints.length > 0) {
                            // Do not create segments with null ponits
                            formattedPoints.forEach((pointObject, k) => {
                                if (pointObject.y === null) {
                                    // Remove null points (might be on edges)
                                    formattedPoints.splice(k, 1);
                                }
                            });
                            segments.push({
                                points: formattedPoints,
                                color: (_b = (colorExists ?
                                    points[pointIndex - 1].segmentColor :
                                    previousColor)) !== null && _b !== void 0 ? _b : ''
                            });
                            lastColor = pointIndex;
                        }
                    }
                    else if (pointIndex === pointsLength - 1) {
                        let next = pointIndex + 1;
                        if (point.y === null) {
                            next--;
                        }
                        formattedPoints = points.slice(lastColor, next);
                        if (formattedPoints.length > 0) {
                            // Do not create segments with null ponits
                            formattedPoints.forEach((formattedPoint, formattedPointIndex) => {
                                if (formattedPoint.y === null) {
                                    // Remove null points (might be on edges)
                                    formattedPoints.splice(formattedPointIndex, 1);
                                }
                            });
                            segments.push({
                                points: formattedPoints,
                                color: (_c = (colorExists ?
                                    points[pointIndex - 1].segmentColor :
                                    previousColor)) !== null && _c !== void 0 ? _c : ''
                            });
                            lastColor = pointIndex;
                        }
                    }
                    // Store previous color
                    if (point) {
                        previousColor = (_d = point.segmentColor) !== null && _d !== void 0 ? _d : '';
                    }
                });
            }
        }
        // Register it
        series.segments = segments;
    }
    setSeriesGraphPathsAndSinglePoints() {
        const series = this, graphPaths = [];
        let singlePoints = [], // Used in drawTracker
        segmentPath;
        // Divide into segments and build graph and area paths
        series.segments.forEach((segment) => {
            segmentPath = series.getSegmentPath(segment.points);
            // Add the segment to the graph, or a single point for tracking
            if (segment.points.length > 1) {
                graphPaths.push([segmentPath, segment.color]);
            }
            else {
                singlePoints = [...singlePoints, ...segment.points];
            }
        });
        // Record it for use in drawGraph and drawTracker, and return graphPaths
        series.singlePoints = singlePoints;
        series.graphPaths = graphPaths;
        return graphPaths;
    }
    drawGraph() {
        const series = this, options = series.options, colorType = options.lineColor || series.color || '', graphPaths = series.setSeriesGraphPathsAndSinglePoints(), graphPathLength = graphPaths.length;
        let graphSegmentsLength = 0;
        // Draw the graphs
        let graphs = series.graphs;
        if (graphs) { // Cancel running animations, #459
            // do we have animation
            graphPaths.forEach((segment, segmentIndex) => {
                // Update color and path
                if (series.graphs[segmentIndex] && isSVGPathSegment(segment[0])) {
                    series.graphs[segmentIndex].attr({
                        d: segment[0],
                        stroke: segment[1]
                    });
                }
                else {
                    const formattedSegment = this.getSegment(segment, colorType);
                    if (formattedSegment) {
                        series.graphs[segmentIndex] = formattedSegment;
                    }
                }
            });
        }
        else if (graphPaths.length > 0) { // #1487
            graphs = [];
            graphPaths.forEach((segment, segmentIndex) => {
                const formattedSegment = this.getSegment(segment, colorType);
                if (formattedSegment) {
                    graphs[segmentIndex] = formattedSegment;
                }
            });
            series.graphs = graphs;
        }
        // Checks if series.graphs exists. #3
        graphSegmentsLength = (series.graphs && series.graphs.length) || -1;
        for (let index = graphSegmentsLength; index >= graphPathLength; index--) {
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
    translate() {
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
     *  Functions
     *
     */
    closeSegment(path, segment, translatedThreshold) {
        path.push('L', segment[segment.length - 1].plotX, translatedThreshold, 'L', segment[0].plotX, translatedThreshold);
    }
    drawGraph() {
        var _a;
        super.drawGraph.call(this);
        const series = this, graphs = series.graphs;
        if (graphs) { // Cancel running animations, #459
            // do we have animation
            (_a = series === null || series === void 0 ? void 0 : series.graphPaths) === null || _a === void 0 ? void 0 : _a.forEach((segment, index) => {
                // Update color and path
                if (series.graphs[index]) {
                    series.graphs[index].attr({ fill: segment[1] });
                }
            });
        }
    }
    getSegmentPath(segment) {
        var _a;
        const segmentPath = super.getSegmentPath.call(this, segment), // Call base method
        areaSegmentPath = [...segmentPath], // Work on a copy for the area path
        options = this.options, segLength = segmentPath.length, translatedThreshold = this.yAxis.getThreshold((_a = options.threshold) !== null && _a !== void 0 ? _a : 0); // #2181
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
        }
        else { // Follow zero line back
            this.closeSegment(areaSegmentPath, segment, translatedThreshold);
        }
        return areaSegmentPath;
    }
    setSeriesGraphPathsAndSinglePoints() {
        const series = this, graphPaths = [];
        let singlePoints = [], // Used in drawTracker
        segmentPaths;
        // Divide into segments and build graph and area paths
        this.areaPaths = [];
        series.segments.forEach((segment) => {
            segmentPaths = series.getSegmentPath(segment.points);
            // Add the segment to the graph, or a single point for tracking
            if (segment.points.length > 1) {
                graphPaths.push([segmentPaths, segment.color]);
            }
            else {
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


			}
		)
}));