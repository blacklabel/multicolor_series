$(function () {
    var colors = Highcharts.getOptions().colors;


    function color(i) {
        if (i < colors.length) return colors[i];
        else {
            var idx = i % colors.length;
            return colors[idx];
        }
    }

    function genData(n) {
        var d = [],
            i = 0;
        while (i < n) {
            var v = Math.round(i / 16);
            d.push({
                y: Math.random() * 100,
                segmentColor: color(v),
            });
            i++;
        }
        return d;
    }

    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container-line',
            type: 'coloredline',
            zoomType: 'xy',
            borderWidth: 5,
            borderColor: '#e8eaeb',
            borderRadius: 0,
            backgroundColor: '#f7f7f7'
        },
        title: {
            style: {
                'fontSize': '1em'
            },
            useHTML: true,
            x: -27,
            y: 8,
            text: '<span class="chart-title">Multicolor (line) series<span class="chart-href"> <a href="http://www.blacklabel.pl/highcharts" target="_blank"> Black Label </a> </span> <span class="chart-subtitle">plugin by </span></span>'
        },
        series: [{
            data: genData(256)
        }]
    });
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container-area',
            type: 'coloredarea',
            zoomType: 'xy',
            borderWidth: 5,
            borderColor: '#e8eaeb',
            borderRadius: 0,
            backgroundColor: '#f7f7f7'
        },
        title: {
            style: {
                'fontSize': '1em'
            },
            useHTML: true,
            x: -27,
            y: 8,
            text: '<span class="chart-title">Multicolor (area) series<span class="chart-href"> <a href="http://www.blacklabel.pl/highcharts" target="_blank"> Black Label </a> </span> <span class="chart-subtitle">plugin by </span></span>'
        },
        series: [{
            data: genData(256)
        }]
    });
});
