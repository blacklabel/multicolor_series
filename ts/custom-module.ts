import SeriesRegistry from "highcharts/ts/Core/Series/SeriesRegistry";

const { line: LineSeries } = SeriesRegistry.seriesTypes;

class ColoredLineSeries extends LineSeries {
  drawGraph() {  
    // Call the base method
    super.drawGraph.apply(this);

    console.log('Inside coloredline drawGraph method!');
  }
}

SeriesRegistry.registerSeriesType('coloredline', ColoredLineSeries);
