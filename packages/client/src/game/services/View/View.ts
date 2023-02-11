import { type Game, ResourcesEvent } from '../';
import { type Entity, Tank } from '../../entities';
import { type Rect, EntityEvent } from '../../entities/Entity/typings';
import { type UIElement } from '../../ui';
import { EventEmitter } from '../../utils';
import { Color } from './colors';
import {
  type AnimationSettings,
  type GetSpriteCoordinates,
  type LayerEntity,
  type LayerList,
  type SpriteCoordinatesNoAnimations,
} from './typings';

export class View extends EventEmitter {
  width = 0;
  height = 0;
  pixelRatio = 10;
  gameBgColor = Color.Black;
  layerZIndexCount = 0;
  /** Содержит список canvas-слоев, canvasContext этих слоев, а также прикрепленные к слоям сущности. */
  layers: LayerList = {};
  /** Корневой элемент, в него вложены все созданные DOM-элементы canvas-слоев. */
  root!: HTMLElement;
  spriteImg: HTMLImageElement | null = null;
  /** Выясняем какая сторона окна меньше */
  windowSmallerSideSize = Math.min(window.innerWidth, window.innerHeight);
  /** Слушатель события изменения размера окна. Автоматически ресайзит размер канваса. */
  canvasResizeListener = this.canvasResizeHandler.bind(this);

  constructor(private game: Game) {
    super();
    const { width, height } = this.game.state;
    this.width = width;
    this.height = height;
    this.pixelRatio = this.getPixelRatio();

    this.game.resources.on(ResourcesEvent.Loaded, () => {
      this.spriteImg = this.game.resources.getImage('classicDesignSprite');
    });
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      this.root.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  /** Удаляет все сущности со всех слоев. */
  reset() {
    for (const id of Object.keys(this.layers)) {
      this.eraseAllEntitiesOnLayer(id);
    }
  }

  /** Инициализирует создание DOM-элементов canvas-слоев и их добавление в корневой DOM-элемент root. */
  load(root: HTMLElement | null) {
    if (root === null) {
      throw new Error('proper DOM root for the game should be set');
    }
    this.root = root;
    if (this.isRootEmpty()) {
      this.createLayer('floor').style.background = this.gameBgColor;
      this.createLayer('tanks');
      this.createLayer('projectiles');
      this.createLayer('ceiling');
      this.createLayer('explosions');
      this.createLayer('overlay').style.position = 'relative';
    }

    // Автоматический ресайз игрового поля. Изменяет размер канваса при изменении размера окна.
    window.addEventListener('resize', this.canvasResizeListener);
  }

  unload() {
    window.removeEventListener('resize', this.canvasResizeListener);
  }

  /** Создает DOM-элементы canvas-слоев и добавляет в корневой DOM-элемент root. */
  createLayer(id: string) {
    const layer = document.createElement('canvas');
    layer.id = id;
    layer.width = this.convertToPixels(this.width);
    layer.height = this.convertToPixels(this.height);
    layer.style.display = 'block';
    layer.style.position = 'absolute';
    layer.style.zIndex = (this.layerZIndexCount++).toString();
    this.root.appendChild(layer);
    if (this.layers[id]) {
      this.layers[id].context = layer.getContext('2d') as CanvasRenderingContext2D;
      this.redrawAllEntitiesOnLayer(id);
    } else {
      this.layers[id] = {
        context: layer.getContext('2d') as CanvasRenderingContext2D,
        entities: new Set(),
      };
    }
    return layer;
  }

  /** Определяет на какой слой необходимо добавить сущность и запускает bindEntityToLayer(). */
  add(entity: Entity | UIElement) {
    let layer = '';
    switch (entity.type) {
      case 'custom':
      case 'score':
        layer = 'overlay';
        break;
      case 'tank':
        layer = 'tanks';
        break;
      case 'projectile':
        layer = 'projectiles';
        break;
      case 'trees':
      case 'indicator':
        layer = 'ceiling';
        break;
      case 'explosion':
        layer = 'explosions';
        break;
      default:
        layer = 'floor';
        break;
    }
    this.bindEntityToLayer(entity, layer);
  }

  /** Привязывает сущность к конкретному слою, а к сущности привязывает listeners рендеринга. */
  bindEntityToLayer(entity: Entity | UIElement, layerId: keyof LayerList) {
    const layerObject = {
      instance: entity,
      listeners: {
        [EntityEvent.ShouldUpdate]: () => {
          if (!entity.spawned) {
            return;
          }
          this.eraseFromLayer(entity, layerId);
        },
        [EntityEvent.DidUpdate]: () => {
          this.drawOnLayer(entity, layerId);
        },
        [EntityEvent.ShouldRenderText]: () => {
          this.drawTextOnLayer(entity as UIElement, layerId);
        },
        [EntityEvent.ShouldBeDestroyed]: () => {
          this.eraseFromLayer(entity, layerId);
          this.removeEntityFromLayer(entity, layerId);
        },
        [EntityEvent.Damaged]: (rect: Rect) => {
          if (entity.type === 'brickWall') {
            this.eraseFromLayer(rect, layerId);
          }
        },
      },
    };
    this.layers[layerId]?.entities.add(layerObject);

    for (const [eventName, callback] of Object.entries(layerObject.listeners)) {
      entity.on(eventName as EntityEvent, callback);
    }
  }

  /** Удаляет сущность с canvas-слоя, очищает ее listeners. */
  removeEntityFromLayer(entity: Entity, layerId: keyof LayerList) {
    let entityToDelete: LayerEntity | null = null;

    for (const layerEntity of this.layers[layerId].entities) {
      if (layerEntity.instance === entity) {
        entityToDelete = layerEntity;
      }
    }

    if (entityToDelete) {
      this.layers[layerId].entities.delete(entityToDelete);
      for (const [eventName, callback] of Object.entries(entityToDelete.listeners)) {
        entity.off(eventName as EntityEvent, callback);
      }
    }
  }

  /** Рисует текст на canvas-слое. */
  drawTextOnLayer(elem: UIElement, layerId: keyof LayerList) {
    const context = this.layers[layerId].context;
    // Убавляем здесь 1 пиксель, чтобы ниже прибавить его к posY, - тем самым убираем баг с затиранием текста
    // (когда его верхняя часть остаётся на слое)
    context.font = `${this.convertToPixels(elem.height) - 1}px "Press Start 2P"`;
    context.textAlign = elem.align;
    context.textBaseline = 'top';
    if (elem.backImg) {
      const pattern = context.createPattern(elem.backImg, 'repeat');
      if (pattern !== null) {
        context.fillStyle = pattern;
      }
    } else {
      context.fillStyle = elem.color;
    }
    let posX = elem.posX;
    if (elem.align === 'center') {
      posX += Math.round(elem.width / 2);
    }
    if (elem.align === 'right') {
      posX += elem.width;
    }
    // Прибавляем к posY 1 пиксель, чтобы убрать баг с затиранием текста, когда его верхняя часть остаётся на слое
    context.fillText(elem.text, this.convertToPixels(posX), this.convertToPixels(elem.posY) + 1);
  }

  /** Рисует отображение сущности на canvas-слое. Заполняет цветом или отображает спрайт.*/
  drawOnLayer(entity: Entity, layerId: keyof LayerList) {
    const context = this.layers[layerId].context;

    // Отрисовка сущностей без спрайта
    if (!entity.mainSpriteCoordinates || !this.isSpriteImgLoaded()) {
      if (entity.color) {
        context.fillStyle = entity.color;
        context.fillRect(...this.getActualRect(entity));
      }
      return;
    }

    // Отрисовка основного спрайта сущности, без анимаций.
    if (!entity.animationList?.length) {
      this.drawMainEntitySprite(entity, context);
      return;
    }

    //Отрисовка сущностей с настраиваемой анимацией.
    if (entity.animationList.length) {
      entity.animationList.forEach(animation => {
        const spriteCoordinates = this.getSpriteCoordinates({ entity, animation });

        if (!spriteCoordinates) {
          return;
        }

        if (animation.showMainSprite) {
          this.drawMainEntitySprite(entity, context);
        }

        //@ts-expect-error tuple создавать неудобно, влечет лишние проверки, а тут важна скорость работы.
        context.drawImage(this.spriteImg, ...spriteCoordinates, ...this.getActualRect(entity));
        this.setNextSpriteFrame(animation, entity);
      });
    }
  }

  /** Отрисовка основного спрайта сущности */
  drawMainEntitySprite(entity: Entity, context: CanvasRenderingContext2D) {
    const spriteCoordinates = this.getSpriteCoordinates({ entity });

    if (!spriteCoordinates) {
      return;
    }

    //@ts-expect-error tuple создавать неудобно, влечет лишние проверки, а тут нужна скорость работы.
    context.drawImage(this.spriteImg, ...spriteCoordinates, ...this.getActualRect(entity));
  }

  /** Стирает отображение сущности на canvas-слое, но не удаляет сущность. */
  eraseFromLayer(rect: Rect | Entity, layerId: keyof LayerList) {
    const context = this.layers[layerId].context;
    context.clearRect(...this.getActualRect(rect));
  }

  /** Перерисовывает все сущности на слое. */
  redrawAllEntitiesOnLayer(layerId: keyof LayerList) {
    if (!this.layers[layerId]) {
      return;
    }

    const { entities: objects } = this.layers[layerId];
    this.eraseAllEntitiesOnLayer(layerId);

    for (const layerObject of objects) {
      this.drawOnLayer(layerObject.instance, layerId);
    }
  }

  /** Стирает отображение всех сущностей с canvas-слоя. */
  eraseAllEntitiesOnLayer(layerId: keyof LayerList) {
    if (!this.layers[layerId]) {
      return;
    }
    const { context } = this.layers[layerId];
    context.clearRect(0, 0, this.convertToPixels(this.width), this.convertToPixels(this.height));
    this.layers[layerId].entities.clear();
  }

  /** Возвращает актуальные координаты на слое (в пикселях) */
  getActualRect(item: Entity | Rect) {
    // Корректировка нужна чтобы визуально танк не прижимался вплотную к кирпичам.
    let correctTankPos = 0;
    let correctTankSize = 0;

    if ('type' in item && item.type === 'tank') {
      correctTankPos = 2;
      correctTankSize = -4;
    }

    return [
      this.convertToPixels(item.posX, correctTankPos),
      this.convertToPixels(item.posY, correctTankPos),
      this.convertToPixels(item.width, correctTankSize),
      this.convertToPixels(item.height, correctTankSize),
    ] as const;
  }

  /** Возвращает канвас с отдельным изображением из спрайта. Используется, чтобы задать шрифтовой фон из спрайта. */
  getSpriteContent(spriteCoordinates: SpriteCoordinatesNoAnimations) {
    const tempCanvas = document.createElement('canvas');
    if (!spriteCoordinates) {
      return null;
    }
    tempCanvas.width = spriteCoordinates[0][2];
    tempCanvas.height = spriteCoordinates[0][3];

    const rect = [0, 0, tempCanvas.width, tempCanvas.height];

    const tempContext = tempCanvas.getContext('2d');
    //@ts-expect-error tuple создавать неудобно, влечет лишние проверки.
    tempContext?.drawImage(this.spriteImg, ...spriteCoordinates[0], ...rect);

    return tempCanvas;
  }

  /** Возвращает координаты сущности на спрайте */
  getSpriteCoordinates({ entity, animation }: GetSpriteCoordinates) {
    let spriteCoordinates: number[] | null = null;

    // Спрайты сущностей без настроек анимации (меняются 2 фрейма или нет анимации).
    if (!animation && entity.mainSpriteCoordinates) {
      // Спрайты статичных сущностей.
      if (!entity.movable && Array.isArray(entity.mainSpriteCoordinates)) {
        return entity.mainSpriteCoordinates[0];
      }

      // Спрайты подвижных сущностей.
      if (entity.movable && !Array.isArray(entity.mainSpriteCoordinates)) {
        // Если танк не едет, то не делаем анимацию движения гусениц
        const isIdleTank = entity instanceof Tank && !entity.moving;
        if (!isIdleTank) {
          // Без настроек анимации у сущности м.б. только 2 фрейма. Тут их меняем.
          entity.mainSpriteFrame = +!entity.mainSpriteFrame;
        }
        return entity.mainSpriteCoordinates[entity.direction][entity.mainSpriteFrame];
      }
    }

    // Спрайты сущностей с настраиваемой анимацией
    if (animation && Array.isArray(animation.spriteCoordinates)) {
      spriteCoordinates = animation.spriteCoordinates[animation.spriteFrame || 0];

      return spriteCoordinates;
    }
  }

  /** Меняет sprite-frame, который отрисуется в следующий раз. */
  setNextSpriteFrame(animation: AnimationSettings, entity: Entity) {
    const time = performance.now();
    if (!animation.lastTime) {
      animation.lastTime = time;
    }
    const elapsed = time - animation.lastTime;

    if (typeof animation.spriteFrame !== 'number' || elapsed < animation.delay) {
      return;
    }

    animation.lastTime = time;
    animation.spriteFrame++;

    const isFinishFrame = animation.spriteFrame === animation.spriteCoordinates?.length;

    if (isFinishFrame && animation.looped) {
      animation.spriteFrame = 0;
    }

    if (isFinishFrame && !animation.looped && animation.name) {
      entity.cancelAnimation('eraseEntity', animation.name);
    }
  }

  /** Проверяет, что слои еще не созданы. */
  private isRootEmpty() {
    return this.root.innerHTML.trim() === '';
  }

  /** Пересчитывает размер игровых клеток в пиксели. */
  private convertToPixels(value: number, correction = 0) {
    return Math.round(value * this.pixelRatio + correction);
  }

  /** Высчитывает pixelRatio, который нужен для определения размера канваса и его содержимого. */
  private getPixelRatio() {
    /** Задает шаг для округления результатов вычисления. 
     Важно чтобы pixelRatio равнялся числу округленному до целого или 0.5. Иначе будут баги при отрисовке. */
    const resizeStep = 0.5;

    /** Выясняем какая сторона игрового поля меньше */
    const zoneSmallerSideSize = Math.min(this.width, this.height);
    let pixelRatio = this.windowSmallerSideSize / zoneSmallerSideSize;

    const isCanvasBiggerThanWindow = zoneSmallerSideSize * pixelRatio >= this.windowSmallerSideSize;
    if (isCanvasBiggerThanWindow) {
      // Это немного уменьшит размер игрового поля, чтобы были отступы от края экрана.
      pixelRatio -= resizeStep;
    }

    // pixelRatio д.б. округлен до чисел с шагом 0.5 (например 1.5, 2, 2.5, и т.д.). Иначе будут баги при отрисовке.
    return Math.round(pixelRatio / resizeStep) * resizeStep;
  }

  /** Обработчик для события изменения размера окна. Автоматически ресайзит размер канваса. */
  canvasResizeHandler() {
    if (!this.windowSmallerSideSize) {
      return;
    }

    const scale = Math.min(
      window.innerWidth / this.windowSmallerSideSize,
      window.innerHeight / this.windowSmallerSideSize
    );

    this.root.style.transform = 'scale(' + scale * 100 + '%)';
  }

  isSpriteImgLoaded() {
    return (
      this.spriteImg instanceof HTMLImageElement &&
      this.spriteImg.complete &&
      this.spriteImg.width > 0 &&
      this.spriteImg.height > 0
    );
  }
}
