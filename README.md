# Multicolor series - Highcharts module

Plugin developed by [Black Label](https://blacklabel.net/highcharts).

Go to project page to see this module in action: [https://blacklabel.github.io/multicolor_series/](https://blacklabel.github.io/multicolor_series/).

## General prerequisites

- For version **3.0.0**: Highcharts **v11.3.0+**
- For version **2.4.0 - 3.0.0**: Highcharts **v10.0.0 - v11.2.0**
- For version **2.3.0**: Highcharts **v9.2.0 - v9.3.3**
- For version **2.x.x**: Highcharts **v4.2.2 - v9.2.0**
- For version **1.x.x**: Highcharts **v4.0.0 - v4.2.2**

## Installation

### NPM

Get the package from NPM in your app:
```
npm install highcharts-multicolor-series
```
If Highcharts is not already installed, get the package with Highcharts:
```
npm install highcharts highcharts-multicolor-series
```

### CDN
Add a `script` tag below the Highcharts script tag:
```HTML
<script src="https://cdn.jsdelivr.net/npm/highcharts-multicolor-series"></script>
```

## Usage and demos

### Basic usage example:
The Live example is available [here](https://jsfiddle.net/BlackLabel/ou4L32cn/).

```JS
Highcharts.chart('container', {
  series: [{
    type: 'coloredline',
    data: [{
      y: 70,
      segmentColor: 'blue'
    }, {
      y: 20,
      segmentColor: 'green'
    }, {
      y: 40,
      segmentColor: 'yellow'
    }, {
      y: 50,
      segmentColor: 'red'
    }, {
      y: 10,
      segmentColor: 'pink'
    }]
  }]
});
```

### Basic usage example with Typescript (React):
The Live example is available [here](https://codesandbox.io/p/sandbox/highcharts-multicolor-series-forked-6m6dd9?file=%2Fsrc%2FApp.tsx&workspaceId=e204a32a-9996-4c96-b99d-9fe3d6fc96d0).

```tsx
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Implement the package module.
import MulticolorSeries from "highcharts-multicolor-series";
MulticolorSeries(Highcharts);

// The package allows you to import both `Highcharts.SeriesMulticolorLineOptions` and
// `Highcharts.SeriesMulticolorAreaOptions` interfaces, accordingly to the series.
// Interfaces extend the default series options.

const App = () => {
  // Type the chart options.
  const options: Highcharts.Options = {
    series: [
      {
        type: "coloredarea",
        data: [
          {
            y: 40,
            segmentColor: "red"
          },
          {
            y: 60,
            segmentColor: "blue"
          },
          {
            y: 30,
            segmentColor: "yellow"
          },
          {
            y: 10,
            segmentColor: "green"
          },
          {
            y: 50,
            segmentColor: "brown"
          },
          {
            y: 20,
            segmentColor: "pink"
          },
          {
            y: 70,
            segmentColor: "orange"
          }
        ]
      }
    ]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default App;
```

## Parameters

| Parameter | Type | Required | Defaults | Description |
| --------- | :----: | :--------: | :--------: | ----------- |
| `series.type` | String | yes | - | Set it to "coloredline" or "coloredarea" to use multicolor series. |
| `point.segmentColor` | String | no | - | Controls line color between n and n+1 point, independent from point.color, which changes marker color. |

## Changelog

The changelog is available [here](https://github.com/blacklabel/multicolor_series/blob/master/CHANGELOG.md).

## Development

To ensure best compatibility, it is recommended to use `pnpm` as a package manager.

## Tests

This package contains tests for the proper elements rendering. To run tests, type:
```
npm run test
```

## License

This package is licensed under [MIT](https://github.com/blacklabel/multicolor_series/blob/master/license.txt).

The package is built on top of the Highcharts library which requires a commercial license. Non-commercial use may qualify for a free educational or personal license. Read more about licenses [here](https://shop.highcharts.com/?utm_source=npmjs&utm_medium=referral&utm_campaign=highchartspage&utm_content=licenseinfo").
