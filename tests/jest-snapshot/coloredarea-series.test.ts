import Highcharts from 'highcharts';
import multicolorModule from '../../dist/multicolor-series';
import { isSeriesColored } from './../../typeguards';
import { generateFormattedSegments, generateFormattedSeries } from './helper';

multicolorModule(Highcharts);

describe('Refactoring regression tests - series coloredarea.', (): void => {
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
                type: 'coloredarea',
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

    if (!isSeriesColored(series)) {
        throw Error('Series type should be coloredarea.');
    }

    const graphs = series.graphs;

    describe('Graphs element tests.', (): void => {
        test(
            'The graphs element should be an five elements array.',
            (): void => {
                expect(graphs.length).toEqual(5);
            }
        );

        test('The graphs paths should match the snapshot.', (): void => {
            const paths = graphs.map((graph): string =>
                graph.element.outerHTML
            );
            expect(paths).toMatchSnapshot();
        });
    });

    test('The tracker element should match the snapshot.', (): void => {
        expect(series?.tracker?.element).toMatchSnapshot();
    });

    test('The series data should match the snapshot.', (): void => {
        const formattedSeries = generateFormattedSeries(series, series.data);
        expect(formattedSeries).toMatchSnapshot();
    });

    test('The segments data should match the snapshot.', (): void => {
        const formattedSegments = generateFormattedSegments(series.segments);
        expect(formattedSegments).toMatchSnapshot();
    });
});
