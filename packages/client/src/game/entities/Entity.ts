import {
  Animations,
  AnimationSettings,
  CancelAnimation,
  Direction,
  EntityRole,
  EntitySettings,
  EntityType,
  Pos,
  PosState,
  SpriteCoordinatesNoAnimations,
  SpriteCoordinatesWithAnimations,
} from '../typings';
import { EventEmitter } from '../utils';

export class Entity extends EventEmitter {
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
  color = 'grey';
  shouldBeDestroyed = false;
  /** Значение true делает танк неуязвимым для снарядов. */
  invincible = false;
  /** Хранит координаты сущности на спрайте. Это основной спрайт, на который сверху могут накладываться анимации. */
  mainSpriteCoordinates: SpriteCoordinatesNoAnimations | SpriteCoordinatesWithAnimations = null;
  /** Указывает какой фрейм анимации показывать. */
  mainSpriteFrame = 0;
  /** Данные необходимые для работы анимации */
  animations: Animations = [];

  constructor(props: EntitySettings) {
    super();
    Object.assign(this, props);
  }

  setState(newState: Partial<Entity>) {
    this.emit('entityShouldUpdate', newState);
    Object.assign(this, newState);
    this.emit('entityDidUpdate', newState);
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
    this.emit('entityWillHaveNewPos', posState);
    if (!posState.hasCollision) {
      this.setState({ posX, posY });
      this.spawned = true;
      this.emit('spawn');
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
    this.emit('entityShouldBeDestroyed');
    this.spawned = false;
  }

  explode() {
    this.emit('exploding');
    this.despawn();
  }

  takeDamage(source: Entity, pos: Pos) {
    this.emit('damaged', pos);
    if (this.type === 'projectile') {
      this.explode();
    } else if (this.type === 'tank' && !this.invincible) {
      if (this.role !== source.role) {
        this.explode();
        this.emit('destroyed', source);
      }
    }
  }

  startAnimation(settings: AnimationSettings) {
    settings.name ??= Math.random().toString();
    settings.spriteFrame ??= 0;
    this.animations.push(settings);

    this.setLoopInterval(
      () => {
        /** Сущность будет перерисована на канвасе. Так работает анимация.*/
        this.refreshSprite();
      },
      settings.delay,
      settings.name
    );

    // По умолчанию анимации убиваются в Game.reset()
    if (settings.stopTimer) {
      this.setLoopDelay(this.cancelAnimation.bind(this, 'showEntity', settings.name), settings.stopTimer);
    }
  }

  cancelAnimation(type: CancelAnimation = 'eraseEntity', name: string) {
    this.clearLoopInterval(name);

    const animationIndex = this.animations.findIndex(animation => animation.name === name);
    this.animations.splice(animationIndex, 1);

    if (type === 'showEntity') {
      this.refreshSprite();
      return;
    }

    this.emit('entityShouldUpdate');
  }

  refreshSprite() {
    this.emit('entityShouldUpdate');
    this.emit('entityDidUpdate');
  }

  setLoopInterval(callback: () => void, delay: number, name: string | number) {
    this.emit('setLoopInterval', callback, delay, name);
  }

  clearLoopInterval(name: string | number) {
    this.emit('clearLoopInterval', name);
  }

  setLoopDelay(callback: () => void, delay: number) {
    this.emit('setLoopDelay', callback, delay);
  }
}
