import SeriesRegistry from "highcharts/ts/Core/Series/SeriesRegistry";
import Utilities from "highcharts/ts/Core/Utilities";
import LineSeries from "highcharts/ts/Series/Line/LineSeries";
import PointerEvent from "highcharts/ts/Core/PointerEvent";
import SVGElement from "highcharts/ts/Core/Renderer/SVG/SVGElement";
import SVGAttributes from "highcharts/ts/Core/Renderer/SVG/SVGAttributes";
import ColorType from "highcharts/ts/Core/Color/ColorType";
import SVGPath from "highcharts/ts/Core/Renderer/SVG/SVGPath";
import { StatesOptionsKey } from "highcharts/ts/Core/Series/StatesOptions";
import {
	ColoredlineSeriesOptions,
	SeriesColoredGraphPath,
	SeriesColoredPoint,
	SeriesColoredSegment,
	 SeriesColoredSegmentPath
} from 'types';

const { area: AreaSeries } = SeriesRegistry.seriesTypes;
const { extend, isArray } = Utilities;

/**
 *
 *  Type guards
 *
 */

const isSVGPathSegment = (value: SeriesColoredSegmentPath[]): value is SVGPath.Segment[] => true;

/**
 *
 *  Functions
 *
 */

function getPath(graphPaths: SeriesColoredGraphPath[]) {
    let segmentPath: SeriesColoredSegmentPath[] = [];

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
     *  Properties
     *
     */

    public pointRange: number | undefined;

    public singlePoints!: SeriesColoredPoint[];

    public points!: Array<SeriesColoredPoint>;

    public segments!: SeriesColoredSegment[];

	public options!: ColoredlineSeriesOptions;

	// Overrides graphPath property from Series type
    public graphPaths: SeriesColoredGraphPath[];

	// Overrides areaPath property from Series type
    public areaPaths: SeriesColoredSegmentPath[];

	// Overrides graph property from Series type
	public graphs: SVGElement[] | [];

    /**
     *
     *  Functions
     *
     */

    public getSegmentPath(segment: SeriesColoredPoint[]) {
        const series = this,
            segmentPath: SeriesColoredSegmentPath[] = [],
            step = series.options.step;
    
        // build the segment line
        segment.forEach(function (point, i: number) {
            const plotX = point.plotX,
                plotY = point.plotY;

            let lastPoint;
    
            if (series.getPointSpline) {
                // generate the spline as defined in the SplineSeries object
                segmentPath.push.apply(segmentPath, series.getPointSpline(segment, point, i));
            } else {
                // moveTo or lineTo
                segmentPath.push(i ? 'L' : 'M');
    
                // step line?
                if (step && i) {
                    lastPoint = segment[i - 1];
    
                    if (plotX && plotY && lastPoint?.plotX && lastPoint?.plotY) {
                        if (step === 'right') {
                            segmentPath.push(            
                                lastPoint.plotX,
                                plotY,
                                'L'
                            );
                        } else if (step === 'center') {
                            segmentPath.push(  
                                (lastPoint.plotX + plotX) / 2,
                                lastPoint.plotY,
                                'L',
                                (lastPoint.plotX + plotX) / 2,
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
                }
    
                // normal line to next point
                if (point?.plotX && point.plotY) {
                    segmentPath.push(
                        point.plotX,
                        point.plotY
                    );
                }
            }
        });
    
        return segmentPath;
    }

    // handle unsorted data, throw error anyway
    public error(code: number, stop?: boolean) {
        const msg = 'Highcharts error #' + code + ': www.highcharts.com/errors/' + code;

        if (stop) {
            throw msg;
        } else if (window.console) {
            console.error(msg);
        }
    }

    public processData(force?: boolean | undefined) {
		const series = this,
			processedXData = series.xData, // copied during slice operation below
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
                } else if (distance < 0 && series.requireSorting) {
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
	};

    public drawTracker() {
		const series = this,
			options = series.options,
			trackByArea = options.trackByArea,
			trackerPath: SeriesColoredSegmentPath[] = trackByArea ? series.areaPaths : getPath(series.graphPaths),
			trackerPathLength = isArray(trackerPath) && trackerPath.length,
			chart = series.chart,
			pointer = chart.pointer,
			renderer = chart.renderer,
			snap = chart.options.tooltip?.snap ?? 0,
			tracker = series.tracker,
			cursor = options.cursor,
			css = cursor && { cursor: cursor },
			singlePoints = series.singlePoints,
            trackerFill = 'rgba(192,192,192,0.002';
            
        let singlePoint,
            i;

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
				if (trackerPath[i]?.toString() === 'M') { // extend left side
					const nextTrackerPath = trackerPath[i + 1];
					
					if (typeof nextTrackerPath === 'number') {
						trackerPath.splice(i + 1, 0, nextTrackerPath - snap, trackerPath[i + 2], 'L');
					}
				}
				if ((i && trackerPath[i]?.toString() === 'M') || i === trackerPathLength) { // extend right side
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
				trackerPath.push('M', singlePoint.plotX - snap, singlePoint.plotY,
					'L', singlePoint.plotX + snap, singlePoint.plotY);
			}
		}
		
		// draw the tracker
		if (isSVGPathSegment(trackerPath)) {
			if (tracker) {
				tracker.attr({ d: trackerPath });
			} else { // create
				series.tracker = renderer.path(trackerPath)
				.attr({
					'stroke-linejoin': 'round', // #1225
					visibility: series.visible ? 'visible' : 'hidden',
					stroke: trackerFill,
					fill: trackByArea ? trackerFill : 'none',
					'stroke-width': options.lineWidth ?? 0 + (trackByArea ? 0 : 2 * snap),
					zIndex: 2
				})
				.add(series.group);
				
				// The tracker is added to the series group, which is clipped, but is covered
				// by the marker group. So the marker group also needs to capture events.
				[series.tracker, series.markerGroup].forEach(function (track) {
					if (track) {
						track.addClass('highcharts-tracker')
						.on('mouseover', onMouseOver)
						.on('mouseout', function (e: PointerEvent) { pointer.onTrackerMouseOut(e); });
	
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
		
	};

    public setState(state?: (StatesOptionsKey | '')) {
		const series = this,
			options = series.options,
			graphs = series.graphs,
			stateOptions = options.states;

        let lineWidth = options.lineWidth ?? 0;
		
		state = state || '';
		
		if (series.state !== state) {
			series.state = state;
			
			if (stateOptions && state && stateOptions[state]?.enabled === false) {
				return;
			}
			
			if (stateOptions && state) {
				lineWidth = stateOptions[state]?.lineWidth || lineWidth + 1;
			}
			
			if (graphs) { // hover is turned off for dashed lines in VML
				// use attr because animate will cause any other animation on the graph to stop
				graphs.forEach(function (seg: SVGElement) {
					if (!seg.dashstyle) {
						seg.attr({ 'stroke-width': lineWidth });
					}
				});
			}
		}
	};

    public getSegments() {
		const series = this,
			points: SeriesColoredPoint[] = series.points;

        let segments: SeriesColoredSegment[] = [],
			lastColor = 0,
            pointsLength = points.length,
            i;
		
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
					if (j > 0 && points[j].segmentColor !== points[j - 1].segmentColor) {
						segments.push({
							points: points.slice(lastColor, j + 1),
							color: points[j - 1].segmentColor ?? ''
						});
						lastColor = j;
					}
				});

				if (pointsLength) {
					// add the last segment (only single-point last segement is added)
					if (lastColor !== pointsLength - 1) {
						segments.push({
							points: points.slice(lastColor, pointsLength),
							color: points[pointsLength - 1].segmentColor ?? ''
						});
					}
				}
				
				if (points.length && segments.length === 0) {
					segments = [{ color: points[0].segmentColor ?? '', points }];
				}
				
				// else, split on null points or different colors
			} else {
				let previousColor: string | null = null;
				points.forEach(function (point, j) {
					var colorChanged = j > 0 && (point.y === null || points[j - 1].y === null || (point.segmentColor !== points[j - 1].segmentColor && points[j].segmentColor !== previousColor)),
						colorExists = points[j - 1] && points[j - 1].segmentColor && points[j - 1].y !== null ? true : false;
					
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
								color: (colorExists ? points[j - 1].segmentColor : previousColor) ?? ''
							});
							lastColor = j;
						}
					} else if (j === pointsLength - 1) {
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
								color: (colorExists ? points[j - 1].segmentColor : previousColor) ?? ''
							});
							lastColor = j;
						}
						
					}
					
					// store previous color
					if (point) {
						previousColor = point.segmentColor ?? '';
					}
				});
			}
		}
		// register it
		series.segments = segments;
	};

    public getGraphPaths() {
		const series = this,
			graphPaths: SeriesColoredGraphPath[] = [];
			

        let singlePoints: SeriesColoredPoint[] = [], // used in drawTracker,
			segmentPath;
            
		// Divide into segments and build graph and area paths
		series.segments.forEach(function (segment) {
			segmentPath = series.getSegmentPath(segment.points);
			// add the segment to the graph, or a single point for tracking
			if (graphPaths && segment.points.length > 1 && isSVGPathSegment(segmentPath)) {
				graphPaths.push([segmentPath, segment.color]);
			} else {
				singlePoints = [...singlePoints, ...segment.points];
			}
		});
		
		// Record it for use in drawGraph and drawTracker, and return graphPaths
		series.singlePoints = singlePoints;
		series.graphPaths = graphPaths;
		
		return graphPaths;
	};

    public drawGraph() {
		const series = this,
			options = series.options,
			colorType = options.lineColor || series.color || '',
			lineWidth = options.lineWidth,
			dashStyle = options.dashStyle,
			roundCap = options.linecap !== 'square',
			graphPaths: SeriesColoredGraphPath[] = series.getGraphPaths(),
			graphPathLength = graphPaths.length;
            
		let graphSegmentsLength = 0;
		
		function getSegment(segment: SeriesColoredGraphPath, colorType: ColorType) {
			var attribs: SVGAttributes = {
					stroke: colorType,
					'stroke-width': lineWidth,
					fill: 'none',
					zIndex: 1 // #1069
				},
				item;
			if (dashStyle) {
				attribs.dashstyle = dashStyle;
			} else if (roundCap) {
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
				} else {
					const formattedSegment = getSegment(segment, colorType);

					if (formattedSegment) {
						series.graphs[j] = formattedSegment;
					}
				}
			});
			
		} else if (graphPaths.length) { // #1487
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
	};

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
 *  Class Prototype
 *
 */

interface ColoredlineSeries extends LineSeries {
    getPointSpline: 
        (segment: SeriesColoredPoint[], point: SeriesColoredPoint, i: number) => SeriesColoredSegmentPath[];
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
