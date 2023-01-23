import './ThemeToggle.css';

import cn from 'classnames';
import { type FC, useEffect, useState } from 'react';

import { THEME_LIST, ThemeNames } from './data';

/**
 * Чтобы добавить новую тему нужно описать ее стили в файле variables.css и свойства в THEME_LIST.
 * Имя темы в variables.css и в THEME_LIST должно совпадать.
 * Дефолтная тема устанавливается в index.html в теге <html>.
 */

/** Переключает темы визуального оформления сайта. */
export const ThemeToggle: FC = () => {
  // Из-за SSR и ошибок гидрации нельзя задать здесь значения из localStorage или document, т.к. на сервере их нет.
  const [themeName, setThemeName] = useState<string | null>(null);

  const getClassName = (currentThemeName: string): string => {
    return cn('theme-toggle__icon', {
      'theme-toggle__icon_selected': themeName === currentThemeName,
    });
  };

  useEffect(() => {
    if (!themeName) {
      const initialThemeName = localStorage.getItem('theme') ?? document.documentElement.getAttribute('theme');
      setThemeName(initialThemeName);
    }

    if (!themeName || !Object.values(ThemeNames).includes(themeName as ThemeNames)) {
      return;
    }

    localStorage.setItem('theme', themeName);
    document.documentElement.setAttribute('theme', themeName);
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
