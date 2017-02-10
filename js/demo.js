/* global Highcharts $:true */
$(function () {
	var colors = Highcharts.getOptions().colors || [
		'#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
		'#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'
	];

	function color(i) {
		var ret;
		if (i < colors.length) {
			ret = colors[i];
		} else {
			ret = colors[i % colors.length];
		}
		return ret;
	}

	function genData(n) {
		var d = [],
			i = 0;
		while (i < n) {
			var v = Math.round(i / 16);
			d.push({
				y: Math.random() * 100,
				segmentColor: color(v)
			});
			i++;
		}
		return d;
	}

	Highcharts.chart('container-line', {
		chart: {
			type: 'coloredline',
			zoomType: 'xy'
		},
		title: {
			useHTML: true,
			x: -10,
			y: 8,
			text: '<span class="chart-title">Multicolor (line) series<span class="chart-href"> <a href="http://www.blacklabel.pl/highcharts" target="_blank"> Black Label </a> </span> <span class="chart-subtitle">plugin by </span></span>'
		},
		series: [{
			data: genData(256)
		}]
	});
	Highcharts.chart('container-area', {
		chart: {
			type: 'coloredarea',
			zoomType: 'xy'
		},
		title: {
			style: {
				'fontSize': '1em'
			},
			useHTML: true,
			x: -10,
			y: 8,
			text: '<span class="chart-title">Multicolor (area) series<span class="chart-href"> <a href="http://www.blacklabel.pl/highcharts" target="_blank"> Black Label </a> </span> <span class="chart-subtitle">plugin by </span></span>'
		},
		series: [{
			data: genData(256)
		}]
	});
});
