import './ThemeToggle.css';

import cn from 'classnames';
import { type FC, useEffect, useState } from 'react';

import { themizationAPI } from '../../api/themizationAPI';
import { authSelectors, useAppSelector } from '../../store';
import { THEME_LIST, ThemeNames } from './data';
import { type toggleThemeArgs } from './typings';

/**
 * Чтобы добавить новую тему нужно:
 * 1. Описать ее стили в файле variables.css
 * 2. Описать свойства в THEME_LIST.
 * 3. Реализовать добавление записи о новой теме в БД в файле databaseUtils.ts
 * Имя темы в variables.css, THEME_LIST и db.ts должно совпадать.
 * Дефолтная тема устанавливается в index.html в теге <html>.
 */

/** Переключает темы визуального оформления сайта. */
export const ThemeToggle: FC = () => {
  const [themeName, setThemeName] = useState<string | null>(null);
  const userId = useAppSelector(authSelectors.userProfile)?.id;

  const getClassName = (currentThemeName: string): string => {
    return cn('theme-toggle__icon', {
      'theme-toggle__icon_selected': themeName === currentThemeName,
    });
  };

  /** Переключатель темы. */
  const toggleTheme = ({ currentThemeName, skipServerRequest }: toggleThemeArgs) => {
    const themeNameIsValid = currentThemeName && Object.values(ThemeNames).includes(currentThemeName);

    if (!themeNameIsValid) {
      return;
    }

    if (userId && currentThemeName !== themeName && !skipServerRequest) {
      themizationAPI.setUserTheme({ themeName: currentThemeName });
    }

    setThemeName(currentThemeName);
    localStorage.setItem('theme', currentThemeName);
    document.documentElement.dataset.theme = currentThemeName;
  };

  /** Начальная установка темы при открытии сайта извне. Берется значение из localStorage или дефолтное. */
  useEffect(() => {
    const defaultTheme = document.documentElement.dataset.theme;

    if (!themeName) {
      const initialThemeName = localStorage.getItem('theme') ?? defaultTheme;

      if (initialThemeName) {
        setThemeName(initialThemeName);
        document.documentElement.dataset.theme = initialThemeName;
      }
    }
  }, []);

  /** Если юзер авторизован проверяем есть ли запись о выбранной им теме в БД.
   * Если тема указана в localStorage - не ходим на сервер, т.к. предполагаем,
   * что на данном устройстве пользователь предпочитает настройку из localStorage.  */
  useEffect(() => {
    (async function getThemeFromAPI() {
      if (userId && !localStorage.getItem('theme')) {
        try {
          const themeNameFromDB = await themizationAPI.getUserTheme();

          const themeNameFromDBIsValid = typeof themeNameFromDB === 'string' && themeNameFromDB !== themeName;
          if (themeNameFromDBIsValid) {
            toggleTheme({ currentThemeName: themeNameFromDB, skipServerRequest: true });
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error('Get theme error. Server response:', error.message);
          }
        }
      }
    })();
  }, [userId]);

  const themeList = THEME_LIST.map(theme => (
    <svg
      onClick={() => {
        toggleTheme({ currentThemeName: theme.name });
      }}
      key={theme.name}
      className={getClassName(theme.name)}
      data-testid={theme.name}
      viewBox={theme.viewBox}
      width="25px">
      <path d={theme.svgPath}></path>
    </svg>
  ));

  return (
    <div className="theme-toggle__wrapper" aria-hidden="true">
      <div data-testid="theme-toggle" className="theme-toggle" title="Переключатель темы визуального оформления сайта.">
        {themeList}
      </div>
    </div>
  );
};
