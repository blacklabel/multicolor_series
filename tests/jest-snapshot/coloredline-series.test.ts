import Highcharts, { SVGElement } from 'highcharts';
import multicolorModule from 'js/multicolor_series';
import { generateFormattedSegments, generateFormattedSeries } from './helper';

multicolorModule(Highcharts);
Highcharts.useSerialIds(true);

describe('Refactoring regression tests - series coloredline.', () => {
    const containerElement = document.createElement('div');
    const chart = Highcharts.chart(containerElement, {
        chart: {
            animation: false
        },

        plotOptions: {
            series: {
              animation: false
            }
        },

        accessibility: {
            enabled: false
        },

        series: [
            {
                type: 'coloredline',
                data: [
                    {
                        y: 40,
                        segmentColor: 'red'
                    },
                    {
                        y: 20,
                        segmentColor: 'blue'
                    },
                    {
                        y: 30,
                        segmentColor: 'yellow'
                    },
                    {
                        y: 10,
                        segmentColor: 'brown'
                    },
                    {
                        y: 50
                    }
                ]
            },
            {
                type: 'coloredline',
                data: [
                    {
                        y: 10,
                        segmentColor: 'lime'
                    },
                    {
                        y: 30,
                        segmentColor: 'pink'
                    },
                    {
                        y: 20,
                        segmentColor: 'navy'
                    },
                    {
                        y: 50,
                        segmentColor: 'olive'
                    },
                    {
                        y: 40
                    }
                ]
            }
        ]
    });

    const series = chart.series[0];

    if (!series) {
        test('Chart series should be defined.', () => {
            expect(series).toBeDefined();
        });

        return;
    }

    const data = series.data,
        graph = series.graph as unknown as SVGElement[];

    describe('Colored series graph element tests.', () => {
        test('The graph element should be an four elements array.', () => {
            expect(graph.length).toEqual(4);
        });

        test('The graph paths should match the snapshot.', () => {
            const paths = graph.map((graph) => graph.element.outerHTML);
            expect(paths).toMatchSnapshot();
        });
    });

    test('The tracker element should match the snapshot.', () => {
        expect(series.tracker).toMatchSnapshot();
    });

    test('The series data should match the snapshot.', () => {
        const formattedSeries = generateFormattedSeries(series, data);
        expect(formattedSeries).toMatchSnapshot();
    });

    test('The segments data should match the snapshot.', () => {
        const formattedSegments = generateFormattedSegments(series.segments, data);
        expect(formattedSegments).toMatchSnapshot();
    });
});
