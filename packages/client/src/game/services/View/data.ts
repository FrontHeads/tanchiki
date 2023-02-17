import { ImagePathList, SpriteName } from '../Resources/data';
import { Color } from './colors';
import { type GameTheme } from './typings';

export enum ViewEvents {
  ToggleVisibilityServiceBtn = 'TOGGLE_VISIBILITY_SERVICE_BUTTONS',
  ToggleColorServiceBtn = 'TOGGLE_COLOR_SERVICE_BUTTONS',
}

/* Варианты названий дизайна игры. */
export enum GameThemeName {
  Classic = 'CLASSIC',
  Modern = 'MODERN',
}

/** Имя ключа в local storage, где хранится имя выбранного юзером дизайна игры. */
export const gameThemeInLS = 'GameDesignName';

export const gameTheme: GameTheme = {
  [GameThemeName.Classic]: {
    spriteName: SpriteName.ClassicDesignSprite,
    menuTitle: '1990',
    // Если не писать 'url("")', то магии не произойдет - фон не поменяется.
    floorBg: 'url("")' + Color.Black,
    brickBg: SpriteName.BrickBgClassic,
  },
  [GameThemeName.Modern]: {
    spriteName: SpriteName.ModernDesignSprite,
    menuTitle: '2023',
    floorBg: `url(${ImagePathList[SpriteName.Tarmac]}) center/15%`,
    brickBg: SpriteName.BrickBgModern,
  },
};
