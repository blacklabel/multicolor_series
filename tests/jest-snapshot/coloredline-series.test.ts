import Highcharts from 'highcharts';
import multicolorModule from '../../js/multicolor_series.js';
import { ChartSeriesColored } from '../../types.js';
import { generateFormattedSegments, generateFormattedSeries } from './helper';

multicolorModule(Highcharts);

describe("The data structure for coloredline series should be appropriate.", () => {
    const containerElement = document.createElement("div");
    const chart = Highcharts.chart(containerElement, {
        accessibility: {
          enabled: false
        },

        series: [
            {
                type: "coloredline",
                data: [
                    {
                        y: 10,
                        segmentColor: "red"
                    },
                    {
                        y: 20,
                        segmentColor: "blue"
                    },
                    {
                        y: 30,
                        segmentColor: "yellow"
                    },
                    {
                        y: 40,
                        segmentColor: "green"
                    },
                    {
                        y: 50,
                        segmentColor: "pink"
                    }
                ]
            }
        ]
    }) as ChartSeriesColored;

    const series = chart.series[0];

    if (series) {
        const data = series.data;

        test('The series data should be appropriate.', () => {
            const formattedSeries = generateFormattedSeries(series, data);
            expect(formattedSeries).toMatchSnapshot();
        });

        test('The segments data should be appropriate.', () => {
            const formattedSegments = generateFormattedSegments(series.segments, data);
            expect(formattedSegments).toMatchSnapshot();
        });
    }
});
