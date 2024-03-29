import { type Entity } from '../../entities';
import { type EntityEvent, type Rect } from '../../entities/Entity/typings';
import { type UIElement } from '../../ui';
import { type SpriteName } from '../Resources/data';
import { type GameThemeName } from './data';

/** Типизирует сущности привязанные к слою и обязывает хранить все свойства и listeners сущностей */
export type LayerEntity = {
  instance: Entity;
  listeners: Record<string, (...args: Array<Rect>) => void>;
};

/** Список canvas-слоев и прикрепленных к ним сущностей. */
export type LayerList = Record<
  string,
  {
    context: CanvasRenderingContext2D;
    entities: Set<LayerEntity>;
  }
>;

export type GetSpriteCoordinates = {
  entity: Entity;
  animation?: AnimationSettings;
};

export type SpriteCoordinatesNoAnimations = null | number[][];
export type SpriteCoordinatesWithAnimations = Record<string, number[][]>;

export type Animations = AnimationSettings[];

export type AnimationSettings = {
  /** Задержка смены кадров. Чем меньше число - тем быстрее анимация.*/
  delay: number;
  /** Координаты спрайта для конкретной анимации. */
  spriteCoordinates: SpriteCoordinatesWithAnimations | SpriteCoordinatesNoAnimations;
  /** Показывать анимацию бесконечно или однократно. False = однократно. */
  looped: boolean;
  /** Показывать ли основной спрайт сущности во время анимации. */
  showMainSprite?: boolean;
  /** Указывает через какой промежуток времени остановить анимацию. */
  stopTimer?: number;
  /** Имя анимации, оно же имя loopInterval который крутит анимацию. */
  name?: string;
  /** Фрейм (кадр) который будет показан при следующем вызове анимации. */
  spriteFrame?: number;
  /** Время последней отрисовки анимации */
  lastTime?: number;
};

export type CancelAnimation =
  /** Убирает анимацию, но спрайт остается видимым. */
  | 'showEntity'
  /** Убирает анимацию и стирает спрайт. */
  | 'eraseEntity';

export type Coordinates = Record<GameThemeName, Record<string, any>>;

export type GameTheme = Record<GameThemeName, GameThemeItem>;

type GameThemeItem = {
  spriteName: SpriteName;
  menuTitle: string;
  floorBg: string;
  brickBg: SpriteName;
};

export type LayerObject<T extends Entity | UIElement> = {
  instance: T;
  listeners: {
    [K in EntityEvent]?: (rect: Rect) => void;
  };
};
