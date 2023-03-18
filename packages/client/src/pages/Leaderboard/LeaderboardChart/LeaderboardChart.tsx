import './LeaderboardChart.css';

import {
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

import { getChartData, legendMargin, options } from './data';
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

export const LeaderboardChart: FC<LeaderboardChartProps> = ({ filteredData }) => {
  const [showChart, setShowChart] = useState(false);
  const usernames: string[] = [];
  const scores: number[] = [];
  const rates: number[] = [];
  const matches: number[] = [];
  const maxLimitUsersOnChart = 20;

  const showChartClickHandler = () => {
    setShowChart(!showChart);
  };

  filteredData.every(item => {
    if (usernames.length >= maxLimitUsersOnChart) {
      return false;
    }

    if (!item) {
      return true;
    }

    const data = item.props.data;

    usernames.push(data.username);
    scores.push(data.score);
    rates.push(data.rate);
    matches.push(data.matches);

    return true;
  });

  const chartClassName = `leaderboard__chart ${
    showChart ? 'leaderboard__chart_show leaderboard__section_show' : 'leaderboard__section_hide'
  }`;

  return (
    <div className="leaderboard__section leaderboard__chart">
      <h3 className="leaderboard__section_title" onClick={showChartClickHandler}>
        ГРАФИК
      </h3>
      <div className={chartClassName}>
        <p className="leaderboard__chart_top20">ТОП-{maxLimitUsersOnChart} игроков</p>
        <Chart
          type="bar"
          data={getChartData({ usernames, rates, matches, scores })}
          options={options}
          plugins={[legendMargin]}
        />
      </div>
    </div>
  );
};
