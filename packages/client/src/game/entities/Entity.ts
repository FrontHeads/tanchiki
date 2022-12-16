import { Game } from '../services';
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
  /** Хранит координаты сущности на спрайте. */
  spriteCoordinates: SpriteCoordinatesNoAnimations | SpriteCoordinatesWithAnimations = null;
  /** Указывает какой фрейм анимации показывать. */
  spriteFrame = 0;
  /** Данные необходимые для работы анимации */
  animations: Animations = [
    // //TODO этот массив обьектов нужно передавать при создании анимации чтобы он записывался конкретной сущности.
    // {
    //   /** Координаты спрайта для конкретной анимации */
    //   spriteCoordinates: [],
    //   /** Имя анимации и отвечающего за нее setLoopInterval. */
    //   name: '',
    //   /** Указывает какой фрейм анимации показывать (какие координаты брать из массива координат). */
    //   spriteFrame: 0,
    //   /** Указывает после какого фрейма анимация считается законченной. */
    //   finishSpriteFrame: 0,
    //   isPlay: false,
    // },
  ];

  constructor(props: EntitySettings) {
    super();
    Object.assign(this, props);
    Game.getInstance().registerLoopDelays(this);
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
    } else if (this.type === 'tank') {
      if (this.role !== source.role) {
        this.explode();
        this.emit('destroyed', source);
      }
    }
  }

  startAnimation(settings: AnimationSettings) {
    settings.name ??= Math.random();
    settings.spriteFrame ??= 0;
    settings.finishSpriteFrame ??= 0;
    settings.isPlay ??= true;
    this.animations.push(settings);
    this.setLoopInterval(this.redraw.bind(this), settings.delay, settings.name);
    // По умолчанию интервалы анимаций убиваются в Game.reset()
  }

  cancelAnimation(type: CancelAnimation = 'showEntity', name: string | number) {
    this.clearLoopInterval(name);

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
