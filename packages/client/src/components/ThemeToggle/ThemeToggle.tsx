import './ThemeToggle.css';

import cn from 'classnames';
import { type FC, useEffect, useState } from 'react';

import { themizationAPI } from '../../api/themizationAPI';
import { authSelectors, useAppSelector } from '../../store';
import { THEME_LIST, ThemeNames } from './data';

/**
 * Чтобы добавить новую тему нужно:
 * 1. Описать ее стили в файле variables.css
 * 2. Описать свойства в THEME_LIST.
 * 3. Реализовать добавление записи о новой теме в БД в файле db.ts
 * Имя темы в variables.css, THEME_LIST и db.ts должно совпадать.
 * Дефолтная тема устанавливается в index.html в теге <html>.
 */

/** Переключает темы визуального оформления сайта. */
export const ThemeToggle: FC = () => {
  // Из-за SSR и ошибок гидрации нельзя задать здесь значения из localStorage или document, т.к. на сервере их нет.
  const [themeName, setThemeName] = useState<string | null>(null);
  const userId = useAppSelector(authSelectors.userProfile)?.id;

  const getClassName = (currentThemeName: string): string => {
    return cn('theme-toggle__icon', {
      'theme-toggle__icon_selected': themeName === currentThemeName,
    });
  };

  useEffect(() => {
    (async function getThemeFromAPI() {
      if (userId) {
        const response = await themizationAPI.getUserTheme(userId);
        const themeNameFromDB = response.data;

        const themeNameFromDBIsValid = typeof themeNameFromDB === 'string' && themeNameFromDB !== themeName;
        if (themeNameFromDBIsValid) {
          setThemeName(themeNameFromDB);
        }
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!themeName) {
      const initialThemeName = localStorage.getItem('theme') ?? document.documentElement.getAttribute('theme');
      setThemeName(initialThemeName);
    }

    const themeNameIsValid = themeName && Object.values(ThemeNames).includes(themeName as ThemeNames);
    if (!themeNameIsValid) {
      return;
    }

    localStorage.setItem('theme', themeName);
    document.documentElement.setAttribute('theme', themeName);

    if (userId) {
      themizationAPI.setUserTheme({ themeName, userId });
    }
  }, [themeName]);

  const themeList = THEME_LIST.map(theme => (
    <svg
      onClick={() => {
        setThemeName(theme.name);
      }}
      key={theme.name}
      className={getClassName(theme.name)}
      viewBox={theme.viewBox}
      width="25px">
      <path d={theme.svgPath}></path>
    </svg>
  ));

  return (
    <div className="theme-toggle__wrapper">
      <div data-testid="theme-toggle" className="theme-toggle">
        {themeList}
      </div>
    </div>
  );
};
