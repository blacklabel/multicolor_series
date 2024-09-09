Highcharts.chart('showcase-demo', {
  chart: {
    spacing: [30, 30, 20, 30]
  },
  title: {
    text: 'Multicolor Series'
  },
  subtitle: {
    useHTML: true,
    align: 'right',
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
		`
  },
  credits: {
    position: {
      x: -35,
      y: -30
    }
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false
      }
    }
  },
  yAxis: {
    title: {
      text: ''
    },
    labels: {
      enabled: false
    }
  },
  series: [
    {
      type: 'coloredline',
      name: 'Line series',
      data: [
        {
          y: 12,
          segmentColor: '#7cb5ec'
        },
        {
          y: 15,
          segmentColor: '#7cb5ec'
        },
        {
          y: 18,
          segmentColor: '#90ed7d'
        },
        {
          y: 23,
          segmentColor: '#90ed7d'
        },
        {
          y: 29,
          segmentColor: '#90ed7d'
        },
        {
          y: 24,
          segmentColor: '#f7a35c'
        },
        {
          y: 11,
          segmentColor: '#f7a35c'
        },
        {
          y: 8,
          segmentColor: '#8085e9'
        },
        {
          y: 9,
          segmentColor: '#8085e9'
        }
      ]
    },
    {
      type: 'coloredarea',
      name: 'Area series',
      pointStart: 9,
      data: [
        {
          y: 10,
          segmentColor: '#f15c80'
        },
        {
          y: 13,
          segmentColor: '#e4d354'
        },
        {
          y: 19,
          segmentColor: '#e4d354'
        },
        {
          y: 22,
          segmentColor: '#2b908f'
        },
        {
          y: 20,
          segmentColor: '#91e8e1'
        },
        {
          y: 18,
          segmentColor: '#91e8e1'
        },
        {
          y: 17,
          segmentColor: '#91e8e1'
        },
        {
          y: 14,
          segmentColor: '#f45b5b'
        },
        {
          y: 15,
          segmentColor: '#f45b5b'
        }
      ]
    }
  ]
});

Highcharts.chart('coloredline', {
  title: {
    text: 'Colored line series'
  },
  subtitle: {
    useHTML: true,
    align: 'right',
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
		`
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false
      }
    }
  },
  series: [
    {
      type: 'coloredline',
      name: 'Line series',
      data: [
        {
          y: 12,
          segmentColor: '#7cb5ec'
        },
        {
          y: 15,
          segmentColor: '#7cb5ec'
        },
        {
          y: 18,
          segmentColor: '#90ed7d'
        },
        {
          y: 23,
          segmentColor: '#90ed7d'
        },
        {
          y: 29,
          segmentColor: '#90ed7d'
        },
        {
          y: 24,
          segmentColor: '#f7a35c'
        },
        {
          y: 11,
          segmentColor: '#f7a35c'
        },
        {
          y: 8,
          segmentColor: '#8085e9'
        },
        {
          y: 9,
          segmentColor: '#8085e9'
        }
      ]
    }
  ]
});

Highcharts.chart('coloredarea', {
  title: {
    text: 'Colored area series'
  },
  subtitle: {
    useHTML: true,
    align: 'right',
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
		`
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false
      }
    }
  },
  series: [
    {
      type: 'coloredarea',
      name: 'Area series',
      data: [
        {
          y: 10,
          segmentColor: '#f15c80'
        },
        {
          y: 13,
          segmentColor: '#e4d354'
        },
        {
          y: 19,
          segmentColor: '#e4d354'
        },
        {
          y: 22,
          segmentColor: '#2b908f'
        },
        {
          y: 20,
          segmentColor: '#91e8e1'
        },
        {
          y: 18,
          segmentColor: '#91e8e1'
        },
        {
          y: 17,
          segmentColor: '#91e8e1'
        },
        {
          y: 14,
          segmentColor: '#f45b5b'
        },
        {
          y: 15,
          segmentColor: '#f45b5b'
        }
      ]
    }
  ]
});
