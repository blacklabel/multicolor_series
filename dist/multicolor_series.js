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
				


const { area: AreaSeries } = SeriesRegistry.seriesTypes;
const { extend, isArray } = Utilities;
/**
 *
 *  Type guards
 *
 */
const isSVGPathSegment = (value) => true;
/**
 *
 *  Functions
 *
 */
function getPath(graphPaths) {
    let segmentPath = [];
    if (graphPaths) {
        graphPaths.forEach(function (el) {
            if (isArray(segmentPath) && isArray(el[0])) {
                segmentPath = segmentPath.concat(el[0]);
            }
        });
    }
    return segmentPath;
}
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
    getSegmentPath(segment) {
        const series = this, segmentPath = [], step = series.options.step;
        // build the segment line
        segment.forEach(function (point, i) {
            const plotX = point.plotX, plotY = point.plotY;
            let lastPoint;
            if (series.getPointSpline) {
                // generate the spline as defined in the SplineSeries object
                segmentPath.push.apply(segmentPath, series.getPointSpline(segment, point, i));
            }
            else {
                // moveTo or lineTo
                segmentPath.push(i ? 'L' : 'M');
                // step line?
                if (step && i) {
                    lastPoint = segment[i - 1];
                    if (plotX && plotY && (lastPoint === null || lastPoint === void 0 ? void 0 : lastPoint.plotX) && (lastPoint === null || lastPoint === void 0 ? void 0 : lastPoint.plotY)) {
                        if (step === 'right') {
                            segmentPath.push(lastPoint.plotX, plotY, 'L');
                        }
                        else if (step === 'center') {
                            segmentPath.push((lastPoint.plotX + plotX) / 2, lastPoint.plotY, 'L', (lastPoint.plotX + plotX) / 2, plotY, 'L');
                        }
                        else {
                            segmentPath.push(plotX, lastPoint.plotY, 'L');
                        }
                    }
                }
                // normal line to next point
                if ((point === null || point === void 0 ? void 0 : point.plotX) && point.plotY) {
                    segmentPath.push(point.plotX, point.plotY);
                }
            }
        });
        return segmentPath;
    }
    // handle unsorted data, throw error anyway
    error(code, stop) {
        const msg = 'Highcharts error #' + code + ': www.highcharts.com/errors/' + code;
        if (stop) {
            throw msg;
        }
        else if (window.console) {
            console.error(msg);
        }
    }
    processData(force) {
        const series = this, processedXData = series.xData, // copied during slice operation below
        processedYData = series.yData, cropStart = 0, xAxis = series.xAxis, options = series.options, isCartesian = series.isCartesian;
        let cropped, distance, closestPointRange;
        // If the series data or axes haven't changed, don't go through this. Return false to pass
        // the message on to override methods like in data grouping.
        if (isCartesian && !series.isDirty && !xAxis.isDirty && !series.yAxis.isDirty && !force) {
            return false;
        }
        if (processedXData && processedYData) {
            // Find the closest distance between processed points
            for (let i = processedXData.length - 1; i >= 0; i--) {
                distance = processedXData[i] - processedXData[i - 1];
                if (distance > 0 && (typeof closestPointRange === 'undefined' || distance < closestPointRange)) {
                    closestPointRange = distance;
                    // Unsorted data is not supported by the line tooltip, as well as data grouping and
                    // navigation in Stock charts (#725) and width calculation of columns (#1900)
                }
                else if (distance < 0 && series.requireSorting) {
                    this.error(15);
                }
            }
            // Record the properties
            series.cropped = cropped; // undefined or true
            series.cropStart = cropStart;
            series.processedXData = processedXData;
            series.processedYData = processedYData;
            if (options.pointRange === null) { // null means auto, as for columns, candlesticks and OHLC
                series.pointRange = closestPointRange || 1;
            }
            series.closestPointRange = closestPointRange;
        }
        return true;
    }
    ;
    drawTracker() {
        var _a, _b, _c, _d, _e;
        const series = this, options = series.options, trackByArea = options.trackByArea, trackerPath = trackByArea ? series.areaPaths : getPath(series.graphPaths), trackerPathLength = isArray(trackerPath) && trackerPath.length, chart = series.chart, pointer = chart.pointer, renderer = chart.renderer, snap = (_b = (_a = chart.options.tooltip) === null || _a === void 0 ? void 0 : _a.snap) !== null && _b !== void 0 ? _b : 0, tracker = series.tracker, cursor = options.cursor, css = cursor && { cursor: cursor }, singlePoints = series.singlePoints, trackerFill = 'rgba(192,192,192,0.002';
        let singlePoint, i;
        const onMouseOver = function () {
            if (chart.hoverSeries !== series) {
                series.onMouseOver();
            }
        };
        // Extend end points. A better way would be to use round linecaps,
        // but those are not clickable in VML.
        if (trackerPathLength && !trackByArea) {
            i = trackerPathLength + 1;
            while (i--) {
                if (((_c = trackerPath[i]) === null || _c === void 0 ? void 0 : _c.toString()) === 'M') { // extend left side
                    const nextTrackerPath = trackerPath[i + 1];
                    if (typeof nextTrackerPath === 'number') {
                        trackerPath.splice(i + 1, 0, nextTrackerPath - snap, trackerPath[i + 2], 'L');
                    }
                }
                if ((i && ((_d = trackerPath[i]) === null || _d === void 0 ? void 0 : _d.toString()) === 'M') || i === trackerPathLength) { // extend right side
                    const subPreviousTrackerPath = trackerPath[i - 2];
                    if (typeof subPreviousTrackerPath === 'number') {
                        trackerPath.splice(i, 0, 'L', subPreviousTrackerPath + snap, trackerPath[i - 1]);
                    }
                }
            }
        }
        // handle single points
        for (i = 0; i < singlePoints.length; i++) {
            singlePoint = singlePoints[i];
            if (singlePoint.plotX && singlePoint.plotY) {
                trackerPath.push('M', singlePoint.plotX - snap, singlePoint.plotY, 'L', singlePoint.plotX + snap, singlePoint.plotY);
            }
        }
        // draw the tracker
        if (isSVGPathSegment(trackerPath)) {
            if (tracker) {
                tracker.attr({ d: trackerPath });
            }
            else { // create
                series.tracker = renderer.path(trackerPath)
                    .attr({
                    'stroke-linejoin': 'round',
                    visibility: series.visible ? 'visible' : 'hidden',
                    stroke: trackerFill,
                    fill: trackByArea ? trackerFill : 'none',
                    'stroke-width': (_e = options.lineWidth) !== null && _e !== void 0 ? _e : 0 + (trackByArea ? 0 : 2 * snap),
                    zIndex: 2
                })
                    .add(series.group);
                // The tracker is added to the series group, which is clipped, but is covered
                // by the marker group. So the marker group also needs to capture events.
                [series.tracker, series.markerGroup].forEach(function (track) {
                    if (track) {
                        track.addClass('highcharts-tracker')
                            .on('mouseover', onMouseOver)
                            .on('mouseout', function (e) { pointer.onTrackerMouseOut(e); });
                        if (css) {
                            track.css(css);
                        }
                        if (typeof document.documentElement.ontouchstart !== 'undefined') {
                            track.on('touchstart', onMouseOver);
                        }
                    }
                });
            }
        }
    }
    ;
    setState(state) {
        var _a, _b, _c;
        const series = this, options = series.options, graphs = series.graphs, stateOptions = options.states;
        let lineWidth = (_a = options.lineWidth) !== null && _a !== void 0 ? _a : 0;
        state = state || '';
        if (series.state !== state) {
            series.state = state;
            if (stateOptions && state && ((_b = stateOptions[state]) === null || _b === void 0 ? void 0 : _b.enabled) === false) {
                return;
            }
            if (stateOptions && state) {
                lineWidth = ((_c = stateOptions[state]) === null || _c === void 0 ? void 0 : _c.lineWidth) || lineWidth + 1;
            }
            if (graphs) { // hover is turned off for dashed lines in VML
                // use attr because animate will cause any other animation on the graph to stop
                graphs.forEach(function (seg) {
                    if (!seg.dashstyle) {
                        seg.attr({ 'stroke-width': lineWidth });
                    }
                });
            }
        }
    }
    ;
    getSegments() {
        var _a, _b;
        const series = this, points = series.points;
        let segments = [], lastColor = 0, pointsLength = points.length, i;
        if (pointsLength) { // no action required for []
            // if connect nulls, just remove null points
            if (series.options.connectNulls) {
                // iterate backwars for secure point removal
                for (i = pointsLength - 1; i >= 0; --i) {
                    if (points[i].y === null) {
                        points.splice(i, 1);
                    }
                }
                pointsLength = points.length;
                points.forEach(function (_point, j) {
                    var _a;
                    if (j > 0 && points[j].segmentColor !== points[j - 1].segmentColor) {
                        segments.push({
                            points: points.slice(lastColor, j + 1),
                            color: (_a = points[j - 1].segmentColor) !== null && _a !== void 0 ? _a : ''
                        });
                        lastColor = j;
                    }
                });
                if (pointsLength) {
                    // add the last segment (only single-point last segement is added)
                    if (lastColor !== pointsLength - 1) {
                        segments.push({
                            points: points.slice(lastColor, pointsLength),
                            color: (_a = points[pointsLength - 1].segmentColor) !== null && _a !== void 0 ? _a : ''
                        });
                    }
                }
                if (points.length && segments.length === 0) {
                    segments = [{ color: (_b = points[0].segmentColor) !== null && _b !== void 0 ? _b : '', points }];
                }
                // else, split on null points or different colors
            }
            else {
                let previousColor = null;
                points.forEach(function (point, j) {
                    var _a, _b, _c;
                    var colorChanged = j > 0 && (point.y === null || points[j - 1].y === null || (point.segmentColor !== points[j - 1].segmentColor && points[j].segmentColor !== previousColor)), colorExists = points[j - 1] && points[j - 1].segmentColor && points[j - 1].y !== null ? true : false;
                    if (colorChanged) {
                        var p = points.slice(lastColor, j + 1);
                        if (p.length > 0) {
                            // do not create segments with null ponits
                            p.forEach(function (pointObject, k) {
                                if (pointObject.y === null) {
                                    // remove null points (might be on edges)
                                    p.splice(k, 1);
                                }
                            });
                            segments.push({
                                points: p,
                                color: (_a = (colorExists ? points[j - 1].segmentColor : previousColor)) !== null && _a !== void 0 ? _a : ''
                            });
                            lastColor = j;
                        }
                    }
                    else if (j === pointsLength - 1) {
                        var next = j + 1;
                        if (point.y === null) {
                            next--;
                        }
                        p = points.slice(lastColor, next);
                        if (p.length > 0) {
                            // do not create segments with null ponits
                            p.forEach(function (pointObject, k) {
                                if (pointObject.y === null) {
                                    // remove null points (might be on edges)
                                    p.splice(k, 1);
                                }
                            });
                            segments.push({
                                points: p,
                                color: (_b = (colorExists ? points[j - 1].segmentColor : previousColor)) !== null && _b !== void 0 ? _b : ''
                            });
                            lastColor = j;
                        }
                    }
                    // store previous color
                    if (point) {
                        previousColor = (_c = point.segmentColor) !== null && _c !== void 0 ? _c : '';
                    }
                });
            }
        }
        // register it
        series.segments = segments;
    }
    ;
    getGraphPaths() {
        const series = this, graphPaths = [];
        let singlePoints = [], // used in drawTracker,
        segmentPath;
        // Divide into segments and build graph and area paths
        series.segments.forEach(function (segment) {
            segmentPath = series.getSegmentPath(segment.points);
            // add the segment to the graph, or a single point for tracking
            if (graphPaths && segment.points.length > 1 && isSVGPathSegment(segmentPath)) {
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
    ;
    drawGraph() {
        const series = this, options = series.options, colorType = options.lineColor || series.color || '', lineWidth = options.lineWidth, dashStyle = options.dashStyle, roundCap = options.linecap !== 'square', graphPaths = series.getGraphPaths(), graphPathLength = graphPaths.length;
        let graphSegmentsLength = 0;
        function getSegment(segment, colorType) {
            var attribs = {
                stroke: colorType,
                'stroke-width': lineWidth,
                fill: 'none',
                zIndex: 1 // #1069
            }, item;
            if (dashStyle) {
                attribs.dashstyle = dashStyle;
            }
            else if (roundCap) {
                attribs['stroke-linecap'] = attribs['stroke-linejoin'] = 'round';
            }
            if (segment[1]) {
                attribs.stroke = segment[1];
            }
            if (isSVGPathSegment(segment[0])) {
                item = series.chart.renderer.path(segment[0])
                    .attr(attribs)
                    .add(series.group);
            }
            if (item && item.shadow) {
                item.shadow(!!options.shadow);
            }
            return item;
        }
        // draw the graphs
        let graphs = series.graphs;
        if (graphs.length > 0) { // cancel running animations, #459
            // do we have animation
            graphPaths.forEach(function (segment, j) {
                // update color and path
                if (series.graphs[j] && isSVGPathSegment(segment[0])) {
                    series.graphs[j].attr({ d: segment[0], stroke: segment[1] });
                }
                else {
                    const formattedSegment = getSegment(segment, colorType);
                    if (formattedSegment) {
                        series.graphs[j] = formattedSegment;
                    }
                }
            });
        }
        else if (graphPaths.length) { // #1487
            graphs = [];
            graphPaths.forEach(function (segment, j) {
                const formattedSegment = getSegment(segment, colorType);
                if (formattedSegment) {
                    graphs[j] = formattedSegment;
                }
            });
            series.graphs = graphs;
        }
        // Checks if series.graphs exists. #3
        graphSegmentsLength = (series.graphs && series.graphs.length) || -1;
        for (let j = graphSegmentsLength; j >= graphPathLength; j--) {
            if (series.graphs && series.graphs[j]) {
                series.graphs[j].destroy();
                series.graphs.splice(j, 1);
            }
        }
    }
    ;
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
extend(ColoredlineSeries.prototype, {
    getPointSpline: ColoredlineSeries.prototype.getPointSpline
});
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
class ColoredAreaSeries extends AreaSeries {
    drawGraph() {
        super.drawGraph.apply(this);
        console.info('Inside coloredarea drawGraph method!');
    }
}
SeriesRegistry.registerSeriesType('coloredarea', ColoredAreaSeries);

			}
		)
}));