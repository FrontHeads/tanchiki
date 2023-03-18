import './LeaderboardFilter.css';

import { type FC, useRef, useState } from 'react';

import { Button } from '../../../components/Button';
import { ButtonVariant } from '../../../components/Button/data';
import { type LeaderboardFilterProps } from './typings';

export const LeaderboardFilter: FC<LeaderboardFilterProps> = ({ setFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const inputsRef = useRef([]) as React.MutableRefObject<HTMLInputElement[]>;

  const showFiltersHandler = () => {
    setShowFilters(!showFilters);
  };

  const inputFilterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputsRef.current = [...inputsRef.current, event.target];
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

  const clickClearBtnHandler = () => {
    setFilters({
      username: '',
      score: { min: 0, max: Infinity },
      rate: { min: 0, max: Infinity },
      match: { min: 0, max: Infinity },
    });

    inputsRef.current.forEach(input => (input.value = ''));
  };

  const filterFormClassName = `${
    showFilters ? 'leaderboard__section_show' : 'leaderboard__section_hide leaderboard__filter_no-margin'
  }`;

  return (
    <div className="leaderboard__section leaderboard__filter">
      <h3 className="leaderboard__section_title" onClick={showFiltersHandler}>
        ФИЛЬТР
      </h3>
      <form className={`form ${filterFormClassName}`}>
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
      <div className={`leaderboard__filter_clear-btn-wrapper ${filterFormClassName}`}>
        <Button text="Очистить" variant={ButtonVariant.Secondary} onClick={clickClearBtnHandler} />
      </div>
    </div>
  );
};
