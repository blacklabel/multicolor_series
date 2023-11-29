import Highcharts from 'highcharts';
import multicolorModule from '../../js/multicolor_series';
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

    if (!isSeriesColored(series, 'coloredarea')) {
        throw Error('Series type should be coloredarea.');
    }

    // TO DO: change to graphs once refactored the coloredarea series.
    const graph = series.graph;

    describe('Graph element tests.', (): void => {
        test(
            'The graph element should be an five elements array.',
            (): void => {
                // TO DO: check not needed once refactored the coloredarea series.
                expect(graph?.length).toEqual(5);
            }
        );

        test('The graph paths should match the snapshot.', (): void => {
            // TO DO: check not needed once refactored the coloredarea series.
            const paths = graph?.map((graph): string =>
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
