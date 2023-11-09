(function (factory) {
  if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (Highcharts) {
  const _modules = Highcharts ? Highcharts._modules : {};

  function _registerModule(obj, path, args, fn) {
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
    'Extensions/ColoredLineSeries.js',
    [_modules['Core/Series/SeriesRegistry.js']],
    function (SeriesRegistry) {

      // ----- Module code ----- //
      const { line: LineSeries } = SeriesRegistry.seriesTypes;

      class ColoredLineSeries extends LineSeries {
        drawGraph() {  
          // Call the base method
          super.drawGraph.apply(this);

          console.log('Inside coloredline drawGraph method!');
        }
      }

      SeriesRegistry.registerSeriesType('coloredline', ColoredLineSeries);
      // ----- Module code ----- //

    }
  );
}));
