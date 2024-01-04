const colors = ['red', 'blue', 'yellow', 'green', 'brown', 'pink'],
    chartColoredline = Highcharts.chart('coloredline-container', {
        chart: {
            spacing: [0, 0, 0 ,0]
        },
        series: [
            {
                type: 'coloredline',
                data: [
                    {
                        y: 40,
                        segmentColor: colors[0]
                    },
                    {
                        y: 60,
                        segmentColor: colors[1]
                    },
                    {
                        y: 30,
                        segmentColor: colors[2]
                    },
                    {
                        y: 10,
                        segmentColor: colors[3]
                    },
                    {
                        y: 50,
                        segmentColor: colors[3]
                    },
                    {
                        y: 20,
                        segmentColor: colors[4]
                    },
                    {
                        y: 70,
                        segmentColor: colors[5]
                    }
                ]
            }
        ]
    }),
    series = chartColoredline.series[0];

QUnit.test('Coloredline series render.', (assert) => {
    assert.equal(
        series.type,
        'coloredline',
        'Coloredline series should render properly.'
    );
});

QUnit.test('Coloredline series points.', (assert) => {
    assert.deepEqual(
        series.points.map((point) => ({ segmentColor: point.segmentColor })),
        window.seriesPointsTestData,
        "The series's points property should match the snapshot data."
    );
});

QUnit.test('Coloredline series tracker property.', (assert) => {
    assert.deepEqual(
        series.tracker.pathArray,
        window.trackerPathArrayTestData,
        "The tracker's pathArray property should match the snapshot data."
    );
});

QUnit.test('Coloredline series graphs property.', (assert) => {
    assert.deepEqual(
        series.graphs.map((graph) => ({
            stroke: graph.attr('stroke'),
            "stroke-width": graph["stroke-width"],
            pathArray: graph.pathArray
        })),
        window.graphsTestData,
        'The graphs property should match the snapshot data.'
    );
});

QUnit.test('Coloredline series segments property.', (assert) => {
    assert.deepEqual(
        series.segments.map((segment) => ({
            color: segment.color,
            points: segment.points.map((point) => ({
                graphicPathArray: point.graphic.pathArray
            }))
        })),
        window.segmentsTestData,
        'The segments property should match the snapshot data.'
    );
});

QUnit.test('Coloredline series graphPaths property.', (assert) => {
    assert.deepEqual(
        series.graphPaths,
        window.graphPathsTestData,
        'The graphPaths property should match the snapshot data.'
    );
});
