import type { Highcharts } from 'ts/config/highcharts-config';
import Series from 'highcharts/ts/Core/Series/Series';
import H from 'highcharts/ts/Core/Globals';

export const someModule = {
  someMethod (series: Series) {
    const { win } = H;

    const timeout: number = setTimeout(() => {}, 1000);

    win.jspdf;

    const labelBySeries = series.labelBySeries;
    return labelBySeries;
  }
}
