import Highcharts from 'highcharts/ts/masters/highcharts.src';
import multicolorModule from './../../js/multicolor_series';
import { isSeriesColored } from './../../typeguards';
import { generateFormattedSegments, generateFormattedSeries } from './helper';

multicolorModule(Highcharts);

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
                        y: 60,
                        segmentColor: 'blue'
                    },
                    {
                        y: 30,
                        segmentColor: 'yellow'
                    },
                    {
                        y: 10,
                        segmentColor: 'green'
                    },
                    {
                        y: 50,
                        segmentColor: 'green'
                    },
                    {
                        y: 20,
                        segmentColor: 'brown'
                    },
                    {
                        y: 70,
                        segmentColor: 'pink'
                    }
                ]
            }
        ]
    });

    const series = chart.series[0];

    if (!series) {
        throw Error('Series should be defined.');
    }

    if (!isSeriesColored(series, 'coloredline')) {
        throw Error('Series type should be coloredline.');
    }

    const graph = series.graph;

    describe('Graph element tests.', () => {
        test('The graph element should be an five elements array.', () => {
            expect(graph.length).toEqual(5);
        });

        test('The graph paths should match the snapshot.', () => {
            const paths = graph.map((graph) => graph.element.outerHTML);
            expect(paths).toMatchSnapshot();
        });
    });

    test('The tracker element should match the snapshot.', () => {
        expect(series.tracker.element).toMatchSnapshot();
    });

    test('The series data should match the snapshot.', () => {
        const formattedSeries = generateFormattedSeries(series, series.data);
        expect(formattedSeries).toMatchSnapshot();
    });

    test('The segments data should match the snapshot.', () => {
        const formattedSegments = generateFormattedSegments(series.segments);
        expect(formattedSegments).toMatchSnapshot();
    });
});
