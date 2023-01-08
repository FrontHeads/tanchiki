import { Color } from '../data/colors';
import {
  Animations,
  AnimationSettings,
  CancelAnimation,
  Direction,
  EntityEvent,
  EntityRole,
  EntitySettings,
  EntityType,
  Pos,
  PosState,
  Rect,
  SpriteCoordinatesNoAnimations,
  SpriteCoordinatesWithAnimations,
} from '../typings';
import { EventEmitter } from '../utils';

export abstract class Entity extends EventEmitter<EntityEvent> {
  posX = 0;
  posY = 0;
  width = 0;
  height = 0;
  direction = Direction.UP;
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
    this.emit(EntityEvent.SHOULD_UPDATE, newState);
    Object.assign(this, newState);
    this.emit(EntityEvent.DID_UPDATE, newState);
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
    this.emit(EntityEvent.WILL_HAVE_NEW_POS, posState);
    if (!posState.hasCollision) {
      this.setState({ posX, posY });
      this.spawned = true;
      this.emit(EntityEvent.SPAWN);
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
    this.emit(EntityEvent.SHOULD_BE_DESTROYED);
    this.emit(EntityEvent.DESPAWN);
    this.spawned = false;
  }

  explode() {
    this.emit(EntityEvent.EXPLODING);
    this.despawn();
  }

  takeDamage(source: Entity, rect: Rect) {
    this.emit(EntityEvent.DAMAGED, { ...rect, source });
    if (this.type === 'projectile') {
      this.explode();
    } else if (this.type === 'tank' && !this.invincible) {
      if (this.role !== source.role) {
        this.explode();
        this.destroyedBy = source;
        this.emit(EntityEvent.DESTROYED, source);
      }
    }
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

    this.emit(EntityEvent.ANIMATION_STARTED, settings.name);

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

    this.emit(EntityEvent.ANIMATION_ENDED, name);

    // Обновляем вид сущности и оставляем видимой на канвасе после завершения анимации.
    if (type === 'showEntity') {
      this.refreshSprite();
      return;
    }

    // Стираем сущность с канваса после завершения анимации.
    if (type === 'eraseEntity') {
      this.emit(EntityEvent.SHOULD_UPDATE);
    }
  }

  /** Стирает и заново отрисовывает сущность на канвасе. Т.е. обновляет вид сущности в игре. */
  refreshSprite() {
    this.emit(EntityEvent.SHOULD_UPDATE);
    this.emit(EntityEvent.DID_UPDATE);
  }

  /** Аналог setInterval. Метод описан в Game. */
  setLoopInterval(callback: () => void, delay: number, name: string | number) {
    this.emit(EntityEvent.SET_LOOP_INTERVAL, callback, delay, name);
  }

  /** Удаляет интервал по его имени. Метод описан в Game. */
  clearLoopInterval(name: string | number) {
    this.emit(EntityEvent.CLEAR_LOOP_INTERVAL, name);
  }

  /** Аналог setTimeout. Метод описан в Game. */
  setLoopDelay(callback: () => void, delay: number) {
    this.emit(EntityEvent.SET_LOOP_DELAY, callback, delay);
  }
}
