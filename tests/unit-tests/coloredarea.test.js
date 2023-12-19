const chartColoredarea = Highcharts.chart('coloredarea-container', {
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

QUnit.test('Should be coloredarea series.', (assert) => {
    assert.equal(chartColoredarea.series[0].type, 'coloredarea', 'Coloredarea series rendered properly!');
});
