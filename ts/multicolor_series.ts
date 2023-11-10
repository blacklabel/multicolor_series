import SeriesRegistry from "highcharts/ts/Core/Series/SeriesRegistry";
import Utilities from "highcharts/ts/Core/Utilities";

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
