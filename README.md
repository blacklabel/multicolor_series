# Multicolor series - Highcharts module

Go to project page to see this module in action: [http://blacklabel.github.io/multicolor_series/](http://blacklabel.github.io/multicolor_series/)

### Requirements

* Plugin requires the latest Highcharts (4+)

### Installation

* Like any other Highcharts module (e.g. exporting), add `<script>` tag pointing to `multicolor_series.js` below Highcharts script tag.


* For NPM users: 
```
var Highcharts = require('highcharts');

require('multicolor_series')(Highcharts);
```

* For BOWER users:

```
bower install highcharts-multicolor-series
```


### Code

The latest code is available on github: [https://github.com/blacklabel/multicolor_series/](https://github.com/blacklabel/multicolor_series/)

### Usage and demos

* 

```
	series: [{
            type: 'coloredline',
            data: [{
            		y: 200,
            		segmentColor: 'red'
            },{
            		y: 210,
            		segmentColor: 'red'
            },{
            		y: 210,
            		segmentColor: 'red'
            },{
            		y: 100,
            		segmentColor: 'green'
            }, {
            		y: 100,
            		segmentColor: 'red'
            }]
	}]
```

### Parameters
<table>
  <thead>
    <tr>
      <th align="left">Property</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
    	<td align="left">point.segmentColor</td>
			<td align="left">Controls line color between N and N+1 point, independent from point.color, which changes marker color.</td>
		</tr>
    <tr>
    	<td align="left">series.type</td>
			<td align="left">Set it to "coloredline" or "coloreadarea" to use multicolor series.</td>
		</tr>
  </tbody>
</table>


### Demo

Demos are available at project's github page: [http://blacklabel.github.io/multicolor_series/](http://blacklabel.github.io/multicolor_series/)

### Releases

- Versions 2.x.y: compatible with Highcharts >= 4.2.2

- Versions 1.x.y: compatible with Highcharts < 4.2.2 
