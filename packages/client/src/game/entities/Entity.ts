import { Color } from '../data/colors';
import {
  type Animations,
  type AnimationSettings,
  type CancelAnimation,
  type EntityRole,
  type EntitySettings,
  type EntityType,
  type Pos,
  type PosState,
  type Rect,
  type SpriteCoordinatesNoAnimations,
  type SpriteCoordinatesWithAnimations,
  Direction,
  EntityEvent,
} from '../typings';
import { EventEmitter } from '../utils';

export abstract class Entity extends EventEmitter<EntityEvent> {
  posX = 0;
  posY = 0;
  width = 0;
  height = 0;
  direction = Direction.Up;
  role: EntityRole = 'neutral';
  type: EntityType = 'custom';
  alignedToGrid = true;
  spawned = false;
  movable = false;
  flying = false;
  crossable = false;
  hittable = true;

  color: Color | string = Color.Grey;
  shouldBeDestroyed = false;
  destroyedBy: Entity | null = null;
  /** Значение true делает танк неуязвимым для снарядов. */
  invincible = false;
  /** Хранит координаты сущности на спрайте. Это основной спрайт, на который сверху могут накладываться анимации. */
  mainSpriteCoordinates: SpriteCoordinatesNoAnimations | SpriteCoordinatesWithAnimations = null;
  /** Указывает какой фрейм анимации показывать. */
  mainSpriteFrame = 0;
  /** Список анимаций для данной сущности. Хранит настройки необходимые для работы анимации. */
  animationList: Animations = [];

  constructor(props: EntitySettings) {
    super();
    Object.assign(this, props);
  }

  setState(newState: Partial<Entity>) {
    this.emit(EntityEvent.ShouldUpdate, newState);
    Object.assign(this, newState);
    this.emit(EntityEvent.DidUpdate, newState);
  }

  getRect() {
    return { posX: this.posX, posY: this.posY, width: this.width, height: this.height };
  }

  spawn(coords?: Pos) {
    const { posX, posY } = coords || { posX: this.posX, posY: this.posY };

    const posState: PosState = {
      hasCollision: undefined,
      nextRect: { posX, posY, width: this.width, height: this.height },
    };
    this.emit(EntityEvent.WillHaveNewPos, posState);
    if (!posState.hasCollision) {
      this.setState({ posX, posY });
      this.spawned = true;
      this.emit(EntityEvent.Spawn);
    } else if (this.type === 'projectile') {
      this.explode();
    }

    return this.spawned;
  }

  despawn() {
    if (!this.spawned) {
      return;
    }
    this.shouldBeDestroyed = true;
    this.emit(EntityEvent.ShouldBeDestroyed);
    this.emit(EntityEvent.Despawn);
    this.spawned = false;
  }

  explode() {
    this.emit(EntityEvent.Exploding);
    this.despawn();
  }

  takeDamage(source: Entity, rect: Rect) {
    this.emit(EntityEvent.Damaged, { ...rect, source });
  }

  /** Запускает анимацию  */
  startAnimation(settings: AnimationSettings) {
    settings.name ??= Math.random().toString();
    settings.spriteFrame ??= 0;
    this.animationList.push(settings);

    this.setLoopInterval(
      () => {
        this.refreshSprite();
      },
      settings.delay,
      settings.name
    );

    this.emit(EntityEvent.AnimationStarted, settings.name);

    // По умолчанию анимации убиваются в Game.reset()
    if (settings.stopTimer) {
      this.setLoopDelay(this.cancelAnimation.bind(this, 'showEntity', settings.name), settings.stopTimer);
    }
  }

  /** Отмена (отключение) анимации. */
  cancelAnimation(type: CancelAnimation = 'eraseEntity', name: string) {
    this.clearLoopInterval(name);

    const animationIndex = this.animationList.findIndex(animation => animation.name === name);
    this.animationList.splice(animationIndex, 1);

    this.emit(EntityEvent.AnimationEnded, name);

    // Обновляем вид сущности и оставляем видимой на канвасе после завершения анимации.
    if (type === 'showEntity') {
      this.refreshSprite();
      return;
    }

    // Стираем сущность с канваса после завершения анимации.
    if (type === 'eraseEntity') {
      this.emit(EntityEvent.ShouldUpdate);
    }
  }

  /** Стирает и заново отрисовывает сущность на канвасе. Т.е. обновляет вид сущности в игре. */
  refreshSprite() {
    this.emit(EntityEvent.ShouldUpdate);
    this.emit(EntityEvent.DidUpdate);
  }

  /** Аналог setInterval. Метод описан в Game. */
  setLoopInterval(callback: () => void, delay: number, name: string | number) {
    this.emit(EntityEvent.SetLoopInterval, callback, delay, name);
  }

  /** Удаляет интервал по его имени. Метод описан в Game. */
  clearLoopInterval(name: string | number) {
    this.emit(EntityEvent.ClearLoopInterval, name);
  }

  /** Аналог setTimeout. Метод описан в Game. */
  setLoopDelay(callback: () => void, delay: number) {
    this.emit(EntityEvent.SetLoopDelay, callback, delay);
  }
}
