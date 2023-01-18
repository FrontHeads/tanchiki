import { type Entity } from '../../entities';
import { type AnimationSettings } from '../../typings';

/** Типизирует сущности привязанные к слою и обязывает хранить все свойства и listeners сущностей */
export type LayerEntity = {
  instance: Entity;
  listeners: Record<string, (...args: Array<any>) => void>;
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
