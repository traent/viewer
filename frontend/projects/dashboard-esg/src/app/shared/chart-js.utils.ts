import { ChartConfiguration } from 'chart.js';

export const getBarChartOptions =
  (paddingBottom: number, maximum: number): ChartConfiguration['options'] => ({
    responsive: true,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        max: maximum,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      // @ts-ignore
      datalabels: {
        color: 'white',
      },
    },
    layout: {
      padding: {
        bottom: paddingBottom,
        top: 10,
      },
    },
    maintainAspectRatio: false,
});

export const getDatasetDataLabels = (title: string, valueLabel: string | null): any => ({
    labels: {
      value: {
        align: 'start',
        anchor: 'start',
        textAlign: 'center',
        formatter: () => valueLabel,
        font: {
          weight: 500,
          size: 20,
          family: 'DM Sans',
          lineHeight: 1.7,
        },
        color: valueLabel === 'Redacted' || valueLabel === 'No Data' ? '#828282' : 'white',
      },
      title: {
        align: 'start',
        anchor: 'start',
        textAlign: 'center',
        formatter: () => title,
        offset: 40,
        color: '#828282',
        font: {
          weight: 400,
          size: 16,
          family: 'Source Sans Pro',
          lineHeight: 1.3,
        },
      },
    },
  });

export const colorMapper = (type: 'env' | 'soc' | 'gov' | 'average' | undefined, value: number | undefined): string => {
  if (value === undefined) {
    return '#4F4F4F';
  }
  switch (type) {
    case 'env':
      return '#41A368';
    case 'soc':
      return '#64A5F5';
    case 'gov':
      return '#865FDA';
    case 'average':
      return '#CCCCCC';
    default:
      return '#CCCCCC';
  }
};

