export enum ViewEvents {
  ToggleVisibilityServiceBtn = 'TOGGLE_VISIBILITY_SERVICE_BUTTONS',
  ToggleColorServiceBtn = 'TOGGLE_COLOR_SERVICE_BUTTONS',
}

/* Варианты названий дизайна игры. */
export enum DesignName {
  Classic = 'CLASSIC',
  Modern = 'MODERN',
}

/** Имя ключа в local storage, где хранится имя выбранного юзером дизайна игры. */
export const gameDesignInLS = 'GameDesignName';
