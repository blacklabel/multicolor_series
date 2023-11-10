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
			[_modules['Core/Series/SeriesRegistry.js'],_modules['Core/Utilities.js']],
			(SeriesRegistry,Utilities) => {
				

const { line: LineSeries, area: AreaSeries } = SeriesRegistry.seriesTypes;
const { extend, pick } = Utilities;
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.coloredline
 *
 */
class ColoredLineSeries extends LineSeries {
    drawGraph() {
        super.drawGraph.apply(this);
        console.log('Inside coloredline drawGraph method!');
    }
}
SeriesRegistry.registerSeriesType('coloredline', ColoredLineSeries);
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.coloredarea
 *
 */
class ColoredAreaSeries extends AreaSeries {
    drawGraph() {
        super.drawGraph.apply(this);
        console.log('Inside coloredarea drawGraph method!');
    }
}
SeriesRegistry.registerSeriesType('coloredarea', ColoredAreaSeries);

			}
		)
}));