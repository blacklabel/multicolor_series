const colorsColoredarea = ['red', 'blue', 'yellow', 'green', 'brown', 'pink'],
    chartColoredarea = Highcharts.chart('coloredarea-container', {
        chart: {
            width: 640,
            height: 400,
            spacing: [0, 0, 0, 0]
        },
        series: [
            {
                type: 'coloredarea',
                data: [
                    {
                        y: 40,
                        segmentColor: colorsColoredarea[0]
                    },
                    {
                        y: 60,
                        segmentColor: colorsColoredarea[1]
                    },
                    {
                        y: 30,
                        segmentColor: colorsColoredarea[2]
                    },
                    {
                        y: 10,
                        segmentColor: colorsColoredarea[3]
                    },
                    {
                        y: 50,
                        segmentColor: colorsColoredarea[3]
                    },
                    {
                        y: 20,
                        segmentColor: colorsColoredarea[4]
                    },
                    {
                        y: 70,
                        segmentColor: colorsColoredarea[5]
                    }
                ]
            }
        ]
    }),
    seriesColoredarea = chartColoredarea.series[0];

QUnit.test('Coloredarea series render.', (assert) => {
    assert.equal(
        seriesColoredarea.type,
        'coloredarea',
        'Coloredarea series should render properly.'
    );
});

QUnit.test('Coloredarea series points.', (assert) => {
    assert.deepEqual(
        seriesColoredarea.points.map((point) =>
            ({ segmentColor: point.segmentColor })
        ),
        coloredareaSeriesPointsTestData,
        "The series's points property should match the snapshot data."
    );
});

QUnit.test('Coloredarea series tracker property.', (assert) => {
    const differences = objectsEqualWithBuffer(
        seriesColoredarea.tracker.pathArray,
        coloredareaTrackerPathArrayTestData,
        1
    );
    const isError = differences.length > 0;

    assert.ok(
        !isError,
        `The tracker's pathArray property should match the snapshot data.${
            isError ? `Differences:\n${differences.join('\n')}` : ''
        }`
    );
});

QUnit.test('Coloredarea series graphs property.', (assert) => {
    const differences = objectsEqualWithBuffer(
        seriesColoredarea.graphs.map((graph) => ({
            stroke: graph.attr('stroke'),
            "stroke-width": graph["stroke-width"],
            pathArray: graph.pathArray
        })),
        coloredareaGraphsTestData,
        1
    );
    const isError = differences.length > 0;

    assert.ok(
        !isError,
        `The graphs property should match the snapshot data.${
            isError ? `Differences:\n${differences.join('\n')}` : ''
        }`
    );
});

QUnit.test('Coloredarea series graphPaths property.', (assert) => {
    const differences = objectsEqualWithBuffer(
        seriesColoredarea.graphPaths,
        coloredareaGraphPathsTestData,
        1
    );
    const isError = differences.length > 0;

    assert.ok(
        !isError,
        `The graphPaths property should match the snapshot data.${
            isError ? `Differences:\n${differences.join('\n')}` : ''
        }`
    );
});

QUnit.test('Coloredarea series segments property.', (assert) => {
    const differences = objectsEqualWithBuffer(
        seriesColoredarea.segments.map((segment) => ({
            color: segment.color,
            points: segment.points.map((point) => ({
                graphicPathArray: point.graphic.pathArray
            }))
        })),
        coloredareaSegmentsTestData,
        1
    );
    const isError = differences.length > 0;

    assert.ok(
        !isError,
        `The segments property should match the snapshot data.${
            isError ? `Differences:\n${differences.join('\n')}` : ''
        }`
    );
});
