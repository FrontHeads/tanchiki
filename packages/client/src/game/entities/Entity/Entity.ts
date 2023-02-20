import { Color } from '../../services/View/colors';
import {
  type Animations,
  type AnimationSettings,
  type CancelAnimation,
  type SpriteCoordinatesNoAnimations,
  type SpriteCoordinatesWithAnimations,
} from '../../services/View/typings';
import { EventEmitter } from '../../utils';
import {
  type EntityRole,
  type EntitySettings,
  type EntityType,
  type Pos,
  type PosState,
  type Rect,
  Direction,
  EntityEvent,
} from './typings';

export { EntityEvent };

export abstract class Entity extends EventEmitter<EntityEvent> {
  /** Расположение объекта по оси X в игровых клетках. */
  posX = 0;
  /** Расположение объекта по оси Y в игровых клетках. */
  posY = 0;
  /** Ширина объекта в игровых клетках. */
  width = 0;
  /** Высота объекта в игровых клетках. */
  height = 0;
  /** Направление, куда смотрит или движется объект. */
  direction = Direction.Up;
  /** Принадлежность объекта (игрок, враг, нейтральная сущность). */
  role: EntityRole = 'neutral';
  /** Тип объекта (например: танк, снаряд, дерево). */
  type: EntityType = 'custom';
  /** Находится ли объект в игре. При уничтожении - false. */
  spawned = false;
  /** Стоит ли объект ровно по сетке в соответствии с матрицей Zone
   * (для отрисовки плавных движений объект может иметь дробные координаты). */
  alignedToGrid = true;
  /** Может ли объект двигаться (к примеру, танки - могут). */
  movable = false;
  /** Может ли объект летать (к примеру, снаряды - могут). */
  flying = false;
  /** Можно ли переезжать через сущность (к примеру, через деревья - можно). */
  crossable = false;
  /** Можно ли подбить объект снарядом (к примеру, лёд - нельзя). */
  hittable = true;
  /** Цвет объекта, если вдруг спрайты не подгрузятся или сбросятся. */
  color: Color | string = Color.Grey;
  /** Должен ли объект быть убран из игры. */
  shouldBeDestroyed = false;
  /** Кем атакован объект. */
  damagedBy: Entity | null = null;
  /** Кем уничтожен объект. */
  destroyedBy: Entity | null = null;
  /** Значение true делает танк неуязвимым для снарядов. */
  invincible = false;
  /** Хранит координаты сущности на спрайте. Это основной спрайт, на который сверху могут накладываться анимации. */
  mainSpriteCoordinates: SpriteCoordinatesNoAnimations | SpriteCoordinatesWithAnimations = null;
  /** Указывает какой фрейм анимации показывать. */
  mainSpriteFrame = 0;
  /** Список анимаций для данной сущности. Хранит настройки необходимые для работы анимации. */
  animationList: Animations = [];
  /** Фоновое изображение под основной спрайт */
  backImg: HTMLImageElement | HTMLCanvasElement | null = null;
  /** Фоновый цвет под основной спрайт */
  backColor: Color | null = null;

  constructor(props: EntitySettings) {
    super();
    Object.assign(this, props);
  }

  /** Изменяет состояние объекта и вызывает события, которые отлавливаются в сервисах. */
  setState(newState: Partial<Entity>) {
    this.emit(EntityEvent.ShouldUpdate, newState);
    Object.assign(this, newState);
    this.emit(EntityEvent.DidUpdate, newState);
  }

  /** Возвращает прямоугольник, на котором находится объект. */
  getRect() {
    return { posX: this.posX, posY: this.posY, width: this.width, height: this.height };
  }

  /** Вводит объект в игру, размещая его по заданным координатам. */
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

  /** Убирает объект из игры. */
  despawn() {
    if (!this.spawned) {
      return;
    }
    this.shouldBeDestroyed = true;
    this.emit(EntityEvent.ShouldBeDestroyed);
    this.emit(EntityEvent.Despawn);
    this.spawned = false;
  }

  /** Взрывает объект. */
  explode() {
    this.emit(EntityEvent.Exploding);
    this.despawn();
  }

  /** Уничтожает объект. */
  beDestroyed(source: Entity) {
    this.explode();
    this.destroyedBy = source;
    this.emit(EntityEvent.Destroyed, source);
  }

  /** Наносит урон по объекту. */
  takeDamage(source: Entity, rect: Rect) {
    if (this.type === 'tank' && this.damagedBy === source) {
      return; // Чтобы танк не взрывался несколько раз от одного попадания
    }
    this.damagedBy = source;
    this.emit(EntityEvent.Damaged, { ...rect, source });
  }

  /** Запускает анимацию  */
  startAnimation(settings: AnimationSettings) {
    settings.name ??= Math.random().toString();
    settings.spriteFrame ??= 0;
    this.animationList.push(settings);

    this.refreshSprite();
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
