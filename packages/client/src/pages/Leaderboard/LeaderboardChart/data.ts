import { type ChartOptions } from 'chart.js';

import { type ChartDataArgs } from './typings';

enum Color {
  orange = '#d84000',
  yellow = '#ffa825',
  gray = 'gray',
  darkgray = '#343434',
  white = 'white',
}

export const getChartData = ({ usernames, rates, matches, scores }: ChartDataArgs) => {
  return {
    labels: usernames,
    datasets: [
      {
        type: 'line' as const,
        label: 'Очки/минута',
        data: rates,
        borderColor: Color.orange,
        borderWidth: 2,
        fill: false,
        offset: 10,
        yAxisID: 'rate',
        pointRadius: 3,
        pointHoverRadius: 2,
      },
      {
        type: 'line' as const,
        label: 'Уровни',
        data: matches,
        borderColor: Color.yellow,
        borderWidth: 2,
        fill: false,
        yAxisID: 'matches',
        pointRadius: 3,
        pointHoverRadius: 2,
      },
      {
        type: 'bar' as const,
        label: 'Очки',
        backgroundColor: Color.gray,
        data: scores,
        borderColor: Color.white,
        borderWidth: 1,
        yAxisID: 'score',
      },
    ],
  };
};

export const options = {
  maintainAspectRatio: false,
  layout: {
    padding: 10,
  },
  scales: {
    score: {
      position: 'left',
      grid: { color: Color.darkgray },
      ticks: {
        beginAtZero: true,
      },
    },
    rate: {
      position: 'right',
      ticks: {
        beginAtZero: true,
      },
    },
    matches: {
      position: 'right',
      ticks: {
        beginAtZero: true,
      },
    },
  },
} as ChartOptions;

/**  Плагин для увеличения отступа между легендой и графиком */
export const legendMargin = {
  id: 'increase-legend-spacing',
  beforeInit(chart: any) {
    const originalFit = chart.legend.fit;
    chart.legend.fit = function fit() {
      originalFit.bind(chart.legend)();
      this.height += 20;
    };
  },
};
