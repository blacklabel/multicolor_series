const chartColoredline = Highcharts.chart('coloredline-container', {
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

QUnit.test('Should be coloredline series.', (assert) => {
    assert.equal(chartColoredline.series[0].type, 'coloredline', 'Coloredline series rendered properly!');
});
