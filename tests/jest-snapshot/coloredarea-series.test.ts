import Highcharts from 'highcharts';
import multicolorModule from '../../js/multicolor_series.js';
import { ChartSeriesColored } from '../../types.js';
import { generateFormattedSegments, generateFormattedSeries } from './helper';

multicolorModule(Highcharts);
Highcharts.useSerialIds(true);

describe("The data structure for coloredarea series should be appropriate.", () => {
    const containerElement = document.createElement("div");
    const chart = Highcharts.chart(containerElement, {
        accessibility: {
          enabled: false
        },

        series: [
            {
                type: "coloredarea",
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

        test('The graph element should match to the snapshot.', () => {
            expect(series.graph).toMatchSnapshot();
        });

        test('The tracker element should match to the snapshot.', () => {
            expect(series.tracker).toMatchSnapshot();
        });

        test('The series data should match to the snapshot.', () => {
            const formattedSeries = generateFormattedSeries(series, data);
            expect(formattedSeries).toMatchSnapshot();
        });

        test('The segments data should match to the snapshot.', () => {
            const formattedSegments = generateFormattedSegments(series.segments, data);
            expect(formattedSegments).toMatchSnapshot();
        });
    }
});
