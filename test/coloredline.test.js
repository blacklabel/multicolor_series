const colorsColoredline = ['red', 'blue', 'yellow', 'green', 'brown', 'pink'],
    chartColoredline = Highcharts.chart('coloredline-container', {
        chart: {
            width: 640,
            height: 400,
            spacing: [0, 0, 0, 0]
        },
        series: [
            {
                type: 'coloredline',
                data: [
                    {
                        y: 40,
                        segmentColor: colorsColoredline[0]
                    },
                    {
                        y: 60,
                        segmentColor: colorsColoredline[1]
                    },
                    {
                        y: 30,
                        segmentColor: colorsColoredline[2]
                    },
                    {
                        y: 10,
                        segmentColor: colorsColoredline[3]
                    },
                    {
                        y: 50,
                        segmentColor: colorsColoredline[3]
                    },
                    {
                        y: 20,
                        segmentColor: colorsColoredline[4]
                    },
                    {
                        y: 70,
                        segmentColor: colorsColoredline[5]
                    }
                ]
            }
        ]
    }),
    seriesColoredline = chartColoredline.series[0];

QUnit.test('Coloredline series render.', (assert) => {
    assert.equal(
        seriesColoredline.type,
        'coloredline',
        'Coloredline series should render properly.'
    );
});

QUnit.test('Coloredline series points.', (assert) => {
    assert.deepEqual(
        seriesColoredline.points.map((point) =>
            ({ segmentColor: point.segmentColor })
        ),
        coloredlineSeriesPointsTestData,
        "The series's points property should match the snapshot data."
    );
});

QUnit.test('Coloredline series tracker property.', (assert) => {
    const differences = objectsEqualWithBuffer(
        seriesColoredline.tracker.pathArray,
        coloredlineTrackerPathArrayTestData,
        5
    );
    const isError = differences.length > 0;

      assert.ok(
        !isError,
        `The tracker's pathArray property should match the snapshot data.${
            isError ? `Differences:\n${differences.join('\n')}` : ''
        }`
    );
});

QUnit.test('Coloredline series graphs property.', (assert) => {
    const differences = objectsEqualWithBuffer(
        seriesColoredline.graphs.map((graph) => ({
            stroke: graph.attr('stroke'),
            "stroke-width": graph["stroke-width"],
            pathArray: graph.pathArray
        })),
        coloredlineGraphsTestData,
        5,
    );
    const isError = differences.length > 0;

    assert.ok(
        !isError,
        `The graphs property should match the snapshot data.${
            isError ? `Differences:\n${differences.join('\n')}` : ''
        }`
    );
});

QUnit.test('Coloredline series graphPaths property.', (assert) => {
    const differences = objectsEqualWithBuffer(
        seriesColoredline.graphPaths,
        coloredlineGraphPathsTestData,
        5,
    );
    const isError = differences.length > 0;

    assert.ok(
        !isError,
        `The graphPaths property should match the snapshot data.${
            isError ? `Differences:\n${differences.join('\n')}` : ''
        }`
    );
});

QUnit.test('Coloredline series segments property.', (assert) => {
    const differences = objectsEqualWithBuffer(
        seriesColoredline.segments.map((segment) => ({
            color: segment.color,
            points: segment.points.map((point) => ({
                graphicPathArray: point.graphic.pathArray
            }))
        })),
        coloredlineSegmentsTestData,
        5,
    );
    const isError = differences.length > 0;

    assert.ok(
        !isError,
        `The segments property should match the snapshot data.${
            isError ? `Differences:\n${differences.join('\n')}` : ''
        }`
    );
});
