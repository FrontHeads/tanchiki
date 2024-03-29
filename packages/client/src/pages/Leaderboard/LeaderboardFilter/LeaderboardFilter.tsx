import './LeaderboardFilter.css';

import { type FC, useRef, useState } from 'react';

import { hasKey } from '../../../app.typings';
import { Button } from '../../../components/Button';
import { ButtonVariant } from '../../../components/Button/data';
import { filtersInitialState } from '../data';
import { type Filters, type LeaderboardFilterProps } from './typings';

export const LeaderboardFilter: FC<LeaderboardFilterProps> = ({ setFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const inputsRef = useRef([]) as React.MutableRefObject<HTMLInputElement[]>;

  const showFiltersHandler = () => {
    setShowFilters(!showFilters);
  };

  const inputFilterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputsRef.current = [...inputsRef.current, event.target];
    const { name, value } = event.target;
    const [fieldName, type] = name.split('_');

    if (!hasKey(filtersInitialState, fieldName)) {
      return;
    }

    if (fieldName === 'username') {
      setFilters(prevState => ({
        ...prevState,
        [name]: value.toLowerCase(),
      }));
    } else {
      setFilters((prevState: Filters) => ({
        ...prevState,
        [fieldName]: {
          ...prevState[fieldName],
          [type]: type === 'max' ? value || Infinity : value,
        },
      }));
    }
  };

  const clickClearBtnHandler = () => {
    setFilters(filtersInitialState);
    inputsRef.current.forEach(input => (input.value = ''));
    inputsRef.current = [];
  };

  const filterFormClassName = `${
    showFilters ? 'leaderboard__section_show' : 'leaderboard__section_hide leaderboard__filter_no-margin'
  }`;

  return (
    <div className="leaderboard__section leaderboard__filter">
      <h3 className="leaderboard__section_title" onClick={showFiltersHandler}>
        ФИЛЬТР
      </h3>
      <form className={`form ${filterFormClassName}`} data-testid="leaderboard__filter__form">
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
              data-testid="leaderboard__filter__score-input-min"
            />
            <div className="input__delimiter">–</div>
            <input
              className="input form__field-input"
              type="number"
              onInput={inputFilterHandler}
              name="score_max"
              placeholder="Не более"
              data-testid="leaderboard__filter__score-input-max"
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
      <div className={`leaderboard__filter_clear-btn-wrapper ${filterFormClassName}`}>
        <Button
          text="Очистить"
          variant={ButtonVariant.Secondary}
          onClick={clickClearBtnHandler}
          data-testid="leaderboard__filter__clear-btn"
        />
      </div>
    </div>
  );
};
