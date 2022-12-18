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

  spawn({ posX = this.posX, posY = this.posY }: Pos) {
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

  takeDamage(source: Entity) {
    this.emit('damaged');
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
    settings.name ||= Math.random();
    settings.spriteFrame ??= 0;
    settings.isPlay ??= true;
    this.animations.push(settings);
    // По умолчанию интервалы анимаций убиваются в Game.reset()
    this.setLoopInterval(this.redraw.bind(this), settings.delay, settings.name);

    if (settings.stopTimer) {
      this.setLoopDelay(this.cancelAnimation.bind(this, 'showEntity', settings.name), settings.stopTimer);
    }
  }

  cancelAnimation(type: CancelAnimation = 'eraseEntity', name: string | number) {
    this.clearLoopInterval(name);

    const animationIndex = this.animations.findIndex(animation => animation.name === name);
    this.animations.splice(animationIndex, 1);

    if (type === 'showEntity') {
      this.emit('entityShouldUpdate');
      this.emit('entityDidUpdate');
    }

    if (type === 'deleteEntity') {
      this.despawn();
    }

    if (type !== 'showEntity') {
      this.emit('entityShouldUpdate');
    }
  }

  /** Сущность будет перерисована на канвасе. Так работает анимация.*/
  redraw() {
    this.emit('entityShouldUpdate');
    this.emit('entityDidUpdate');
  }

  setLoopInterval(callback: () => void, delay: number, name: string | number) {
    this.emit('loopInterval', callback, delay, name);
  }

  clearLoopInterval(name: string | number) {
    this.emit('clearLoopInterval', name);
  }

  setLoopDelay(callback: () => void, delay: number) {
    this.emit('loopDelay', callback, delay);
  }
}
