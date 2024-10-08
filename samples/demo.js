Highcharts.setOptions({
  chart: {
    style: {
      fontFamily: "Montserrat, sans-serif"
    }
  }
});

const linearGradient = { x1: 0, x2: 1, y1: 0, y2: 0 };

Highcharts.chart("showcase-demo", {
  chart: {
    spacing: [30, 30, 20, 30],
  },
  title: {
    text: "Multicolor Series",
  },
  subtitle: {
    useHTML: true,
    align: "right",
    floating: true,
    x: 5,
    y: 5,
    text: `
			<a
				href="https://blacklabel.net/highcharts"
				title="blacklabel.net"
			>
				<img
					src="https://blacklabel.net/wp-content/uploads/2023/09/blacklabel_logo_white.png"
					title="BlackLabel"
					alt="BlackLabel"
					style="height: 29px; filter: brightness(0%);"
				>
			</a>
		`,
  },
  credits: {
    position: {
      x: -35,
      y: -30,
    },
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false,
      },
    },
  },
  tooltip: {
    outside: true
  },
  yAxis: [
    {
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
      height: "50%",
      top: "0%",
    },
    {
      title: {
        text: "",
      },
      labels: {
        enabled: false,
      },
      height: "50%",
      top: "50%",
    },
  ],
  series: [
    {
      type: "coloredline",
      name: "Line series",
      data: [
        {
          y: 20,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#191632"],
              [1, "#1D1736"],
            ],
          },
        },
        {
          y: 30,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#1D1736"],
              [1, "#281940"],
            ],
          },
        },
        {
          y: 50,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#281940"],
              [1, "#331B4C"],
            ],
          },
        },
        {
          y: 40,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#331B4C"],
              [1, "#3F1F59"],
            ],
          },
        },
        {
          y: 30,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#3F1F59"],
              [1, "#4B2165"],
            ],
          },
        },
        {
          y: 40,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#4B2165"],
              [1, "#562470"],
            ],
          },
        },
        {
          y: 50,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#562470"],
              [1, "#64287D"],
            ],
          },
        },
        {
          y: 40,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#64287D"],
              [1, "#692982"],
            ],
          },
        },
      ],
    },
    {
      type: "coloredarea",
      name: "Area series",
      data: [
        {
          y: 20,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#191632"],
              [1, "#1D1736"],
            ],
          },
        },
        {
          y: 30,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#1D1736"],
              [1, "#281940"],
            ],
          },
        },
        {
          y: 50,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#281940"],
              [1, "#331B4C"],
            ],
          },
        },
        {
          y: 40,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#331B4C"],
              [1, "#3F1F59"],
            ],
          },
        },
        {
          y: 30,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#3F1F59"],
              [1, "#4B2165"],
            ],
          },
        },
        {
          y: 40,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#4B2165"],
              [1, "#562470"],
            ],
          },
        },
        {
          y: 50,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#562470"],
              [1, "#64287D"],
            ],
          },
        },
        {
          y: 40,
          segmentColor: {
            linearGradient,
            stops: [
              [0, "#64287D"],
              [1, "#692982"],
            ],
          },
        },
      ],
      yAxis: 1,
    },
  ],
});

Highcharts.chart("coloredline", {
  title: {
    text: "Colored line series",
  },
  subtitle: {
    useHTML: true,
    align: "right",
    floating: true,
    x: 5,
    y: 5,
    text: `
			<a
				href="https://blacklabel.net/highcharts"
				title="blacklabel.net"
			>
				<img
					src="https://blacklabel.net/wp-content/uploads/2023/09/blacklabel_logo_white.png"
					title="BlackLabel"
					alt="BlackLabel"
					style="height: 29px; filter: brightness(0%);"
				>
			</a>
		`,
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false,
      },
    },
  },
  series: [
    {
      type: "coloredline",
      name: "Line series",
      data: [
        {
          y: 12,
          segmentColor: "#2caffe"
        },
        {
          y: 15,
          segmentColor: "#544fc5"
        },
        {
          y: 18,
          segmentColor: "#00e272"
        },
        {
          y: 23,
          segmentColor: "#fe6a35"
        },
        {
          y: 29,
          segmentColor: "#6b8abc"
        },
        {
          y: 24,
          segmentColor: "#d568fb"
        },
        {
          y: 11,
          segmentColor: "#2ee0ca"
        },
        {
          y: 8,
          segmentColor: "#fa4b42"
        },
        {
          y: 9,
          segmentColor: "#feb56a"
        },
      ],
    },
  ],
});

Highcharts.chart("coloredarea", {
  title: {
    text: "Colored area series",
  },
  subtitle: {
    useHTML: true,
    align: "right",
    floating: true,
    x: 5,
    y: 5,
    text: `
			<a
				href="https://blacklabel.net/highcharts"
				title="blacklabel.net"
			>
				<img
					src="https://blacklabel.net/wp-content/uploads/2023/09/blacklabel_logo_white.png"
					title="BlackLabel"
					alt="BlackLabel"
					style="height: 29px; filter: brightness(0%);"
				>
			</a>
		`,
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false,
      },
    },
  },
  series: [
    {
      type: "coloredarea",
      name: "Area series",
      data: [
        {
          y: 10,
          segmentColor: "#2caffe"
        },
        {
          y: 13,
          segmentColor: "#544fc5"
        },
        {
          y: 19,
          segmentColor: "#00e272"
        },
        {
          y: 22,
          segmentColor: "#fe6a35"
        },
        {
          y: 20,
          segmentColor: "#6b8abc"
        },
        {
          y: 18,
          segmentColor: "#d568fb"
        },
        {
          y: 17,
          segmentColor: "#2ee0ca"
        },
        {
          y: 14,
          segmentColor: "#fa4b42"
        },
        {
          y: 15,
          segmentColor: "#feb56a"
        },
      ],
    },
  ],
});
