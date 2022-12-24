import { Entity } from '../entities';
import type { AnimationSettings, GetSpriteCoordinates, LayerEntity, LayerList, Pos, Rect, Size } from '../typings';
import type { UIElement } from '../ui';
import { EventEmitter } from '../utils';
import { EntityEvent } from './../typings/index';

export class View extends EventEmitter {
  width = 0;
  height = 0;
  pixelRatio = 10;
  gameBgColor = 'black';
  layerZIndexCount = 0;
  /** Содержит список canvas-слоев, canvasContext этих слоев, а также прикрепленные к слоям сущности. */
  layers: LayerList = {};
  /** Корневой элемент, в него вложены все созданные DOM-элементы canvas-слоев. */
  root!: HTMLElement;
  spriteImg: HTMLImageElement | null = null;

  constructor({ width, height }: Size) {
    super();
    this.width = width;
    this.height = height;
    this.pixelRatio = this.getPixelRatio();
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
  build(root: HTMLElement | null) {
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
        layer = 'overlay';
        break;
      case 'tank':
        layer = 'tanks';
        break;
      case 'projectile':
        layer = 'projectiles';
        break;
      case 'trees':
        layer = 'ceiling';
        break;
      case 'projectileExplosion':
      case 'tankExplosion':
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
        entityShouldUpdate: () => {
          if (!entity.spawned) {
            return;
          }
          this.eraseFromLayer(entity, layerId);
        },
        entityDidUpdate: () => {
          this.drawOnLayer(entity, layerId);
        },
        entityShouldRenderText: () => {
          this.drawTextOnLayer(entity as UIElement, layerId);
        },
        entityShouldBeDestroyed: () => {
          this.eraseFromLayer(entity, layerId);
          this.removeEntityFromLayer(entity, layerId);
        },
        damaged: (pos: Pos) => {
          if (entity.type === 'brickWall') {
            this.eraseFromLayer({ ...pos, width: 1, height: 1 }, layerId);
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
    context.font = `${this.convertToPixels(elem.height)}px "Press Start 2P"`;
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
    context.fillText(elem.text, this.convertToPixels(posX), this.convertToPixels(elem.posY));
  }

  /** Рисует отображение сущности на canvas-слое. Заполняет цветом или отображает спрайт.*/
  drawOnLayer(entity: Entity, layerId: keyof LayerList) {
    const context = this.layers[layerId].context;

    // Отрисовка сущностей без спрайта
    if (!entity.mainSpriteCoordinates && entity.color) {
      context.fillStyle = entity.color;
      context.fillRect(...this.getActualRect(entity));
      return;
    }

    if (!(this.spriteImg instanceof HTMLImageElement)) {
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

    if (!spriteCoordinates || !(this.spriteImg instanceof HTMLImageElement)) {
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
    const { entities: objects } = this.layers[layerId];
    this.eraseAllEntitiesOnLayer(layerId);
    for (const layerObject of objects) {
      this.drawOnLayer(layerObject.instance, layerId);
    }
  }

  /** Стирает отображение всех сущностей с canvas-слоя. */
  eraseAllEntitiesOnLayer(layerId: keyof LayerList) {
    const { context } = this.layers[layerId];
    context.clearRect(0, 0, this.convertToPixels(this.width), this.convertToPixels(this.height));
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
        // Без настроек анимации у сущности м.б. только 2 фрейма. Тут их меняем.
        entity.mainSpriteFrame = +!entity.mainSpriteFrame;
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
    if (typeof animation.spriteFrame !== 'number') {
      return;
    }

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
    /** Размер игрового поля с учетом отступов от канваса до края экрана. +4 - это отступы. */
    const realZoneSize = this.width + 4;

    const smallerWindowSideSize = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
    const pixelRatio = smallerWindowSideSize / realZoneSize;

    return Math.floor(pixelRatio);
  }
}
