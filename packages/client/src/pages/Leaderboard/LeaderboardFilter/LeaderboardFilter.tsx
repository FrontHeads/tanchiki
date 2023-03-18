import './LeaderboardFilter.css';

import { type FC, useState } from 'react';

import { type LeaderboardFilterProps } from './typings';

export const LeaderboardFilter: FC<LeaderboardFilterProps> = ({ setFilters }) => {
  const [showFilters, setShowFilters] = useState(false);

  const showFiltersHandler = () => {
    setShowFilters(!showFilters);
  };

  const inputFilterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'username') {
      setFilters(prevState => ({
        ...prevState,
        [name]: value.toLowerCase(),
      }));
      return;
    }

    const [fieldName, type] = name.split('_');

    setFilters(prevState => ({
      ...prevState,
      [fieldName]: { [type]: type === 'max' ? value || Infinity : value },
    }));
  };

  const filterFormClassName = `form ${showFilters ? 'leaderboard__section_show' : 'leaderboard__section_hide'}`;

  return (
    <div className="leaderboard__section leaderboard__filter">
      <h3 className="leaderboard__section_title" onClick={showFiltersHandler}>
        ФИЛЬТР
      </h3>
      <form className={filterFormClassName}>
        <div className="form__field">
          <label className="form__field-label">Имя игрока:</label>
          <input
            className="input form__field-input"
            type="text"
            name={'username'}
            onInput={inputFilterHandler}
            placeholder="Имя игрока"
          />
        </div>
        <div className="form__field">
          <label className="form__field-label">Очки:</label>
          <div className="form__field_double-input">
            <input
              className="input form__field-input"
              type="number"
              onInput={inputFilterHandler}
              name="score_min"
              placeholder="Не менее"
            />
            <div className="input__delimiter">–</div>
            <input
              className="input form__field-input"
              type="number"
              onInput={inputFilterHandler}
              name="score_max"
              placeholder="Не более"
            />
          </div>
        </div>
        <div className="form__field">
          <label className="form__field-label">Очки/минута:</label>
          <div className="form__field_double-input">
            <input
              className="input form__field-input"
              type="number"
              onInput={inputFilterHandler}
              name="rate_min"
              placeholder="Не менее"
            />
            <div className="input__delimiter">–</div>
            <input
              className="input form__field-input"
              type="number"
              onInput={inputFilterHandler}
              name="rate_max"
              placeholder="Не более"
            />
          </div>
        </div>
        <div className="form__field">
          <label className="form__field-label">Уровни:</label>
          <div className="form__field_double-input">
            <input
              className="input form__field-input"
              type="number"
              onInput={inputFilterHandler}
              name="match_min"
              placeholder="Не менее"
            />
            <div className="input__delimiter">–</div>
            <input
              className="input form__field-input"
              type="number"
              onInput={inputFilterHandler}
              name="match_max"
              placeholder="Не более"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
