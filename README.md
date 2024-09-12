# Multicolor series - Highcharts module

Go to project page to see this module in action: [http://blacklabel.github.io/multicolor_series/](http://blacklabel.github.io/multicolor_series/)

### Requirements

* Plugin requires the latest Highcharts (v11.0.0+)

### Installation

* Like any other Highcharts module (e.g. exporting), add `<script>` tag pointing to `multicolor_series.js` below Highcharts script tag.


* For NPM users:
```
var Highcharts = require('highcharts');

require('multicolor_series')(Highcharts);
```


### Code

The latest code is available on github: [https://github.com/blacklabel/multicolor_series/](https://github.com/blacklabel/multicolor_series/)

### Usage and demos


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
			<td align="left">Set it to "coloredline" or "coloredarea" to use multicolor series.</td>
		</tr>
  </tbody>
</table>


### Demo

Demos are available at project's github page: [http://blacklabel.github.io/multicolor_series/](http://blacklabel.github.io/multicolor_series/)

### Releases

- Versions v3.0.0: compatible with Highcharts v11.0.0+

- Versions v2.4.0+: compatible with Highcharts v10.0.0+

- Version v2.3.0: compatible with Highcharts v9.2.0 - v9.3.3

- Versions v2.0.0 - v2.2.7: compatible with Highcharts v4.2.2 - v9.2.0

- Versions v1.0.0 - v1.1.3: compatible with Highcharts v4.0.0 - v4.2.2
