import './LeaderboardChart.css';

import {
  type ChartOptions,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { type FC, useState } from 'react';
import { Chart } from 'react-chartjs-2';

import { type LeaderboardChartProps } from './typings';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

export const LeaderboardChart: FC<LeaderboardChartProps> = ({ data }) => {
  const [showChart, setShowChart] = useState(false);
  const usernames: string[] = [];
  const scores: number[] = [];
  const rates: number[] = [];
  const matches: number[] = [];
  const maxLimitUsersOnChart = 20;

  const showChartClickHandler = () => {
    setShowChart(!showChart);
  };

  data.every(({ data }, index) => {
    if (index > maxLimitUsersOnChart) {
      return false;
    }
    usernames.push(data.username);
    scores.push(data.score);
    rates.push(data.rate);
    matches.push(data.matches);
    return true;
  });

  const chartClassName = `leaderboard__chart ${
    showChart ? 'leaderboard__chart_show leaderboard__section_show' : 'leaderboard__section_hide'
  }`;

  const dataOutput = {
    labels: usernames,
    datasets: [
      {
        type: 'line' as const,
        label: 'Очки/минута',
        data: rates,
        borderColor: '#d84000',
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
        borderColor: '#ffa825',
        borderWidth: 2,
        fill: false,
        yAxisID: 'matches',
        pointRadius: 3,
        pointHoverRadius: 2,
      },
      {
        type: 'bar' as const,
        label: 'Очки',
        backgroundColor: 'gray',
        data: scores,
        borderColor: 'white',
        borderWidth: 1,
        yAxisID: 'score',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    layout: {
      padding: 10,
    },
    scales: {
      score: {
        position: 'left',
        grid: { color: '#343434' },
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

  return (
    <div className="leaderboard__section leaderboard__chart">
      <h3 className="leaderboard__section_title" onClick={showChartClickHandler}>
        ГРАФИК
      </h3>
      <div className={chartClassName}>
        <p className="leaderboard__chart_top20">ТОП-20 игроков</p>
        <Chart type="bar" data={dataOutput} options={options} plugins={[legendMargin]} />
      </div>
    </div>
  );
};

/**  Плагин для увеличения отступа между легендой и графиком */
const legendMargin = {
  id: 'increase-legend-spacing',
  beforeInit(chart: any) {
    const originalFit = chart.legend.fit;
    chart.legend.fit = function fit() {
      originalFit.bind(chart.legend)();
      this.height += 20;
    };
  },
};
