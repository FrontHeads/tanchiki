import type { Entity } from '../entities';
import type { Size } from '../typings';
import type { UIElement } from '../ui';
import { EventEmitter } from '../utils';

/** Список canvas-слоев и прикрепленных к ним сущностей. */
type LayerList = Record<
  string,
  {
    context: CanvasRenderingContext2D;
    entities: Set<LayerEntity>;
  }
>;

/** Типизирует сущности привязанные к слою и обязывает хранить все свойства и listeners сущностей */
type LayerEntity = {
  instance: Entity;
  listeners: Record<string, () => void>;
};

export class View extends EventEmitter {
  width = 0;
  height = 0;
  pixelRatio = 10;
  gameBgColor = 'black';
  layerZIndexCount = 0;
  /** Содержит список canvas-слоев, canvasContext этих слоев, а также прикрепленные к слоям сущности.
   * О сущностях исчерпывающая информация: все свойства, все listeners.
   */
  layers: LayerList = {};
  /** Корневой элемент, в него вложены все созданные DOM-элементы canvas-слоев */
  root!: HTMLElement;

  constructor({ width, height }: Size) {
    super();
    this.width = width;
    this.height = height;
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

  /** Определяет на какой уровень необходимо добавить сущность и запускает bindEntityToLayer(). */
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
          this.eraseEntityFromLayer(entity, layerId);
        },
        entityDidUpdate: () => {
          this.drawEntityOnLayer(entity, layerId);
        },
        entityShouldRenderText: () => {
          this.drawTextOnLayer(entity as UIElement, layerId);
        },
        entityShouldBeDestroyed: () => {
          this.eraseEntityFromLayer(entity, layerId);
          this.removeEntityFromLayer(entity, layerId);
        },
      },
    };
    this.layers[layerId].entities.add(layerObject);

    //FIXME а не многовато ли раз отрабатывает этот метод?
    // Отрабатывает потому что создаются снаряды непонятно откуда и зачем. Что-то эмитит без конца метод shoot
    // Но проблема еще в том, что отработанные снаряды не удаляются!
    // Нужно вызывать метод removeEntityFromLayer у взорвавшихся снарядов противника.
    // console.log(this.layers[layerId].entities);

    for (const [eventName, callback] of Object.entries(layerObject.listeners)) {
      entity.on(eventName, callback);
    }
  }

  /** Стирает сущность с canvas-слоя и очищает ее listeners. */
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
        entity.off(eventName, callback);
      }
    }
  }

  /** Рисует текст на canvas-слое. */
  drawTextOnLayer(elem: UIElement, layerId: keyof LayerList) {
    const context = this.layers[layerId].context;
    context.font = `${this.convertToPixels(elem.height)}px "Press Start 2P"`;
    context.textAlign = elem.align;
    context.textBaseline = 'top';
    if (elem.img) {
      const pattern = context.createPattern(elem.img, 'repeat');
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

  /** Рисует сущность на canvas-слое. */
  drawEntityOnLayer(entity: Entity, layerId: keyof LayerList) {
    const context = this.layers[layerId].context;
    context.fillStyle = entity.color;
    context.fillRect(...this.getEntityActualRect(entity));
  }

  /** Стирает сущность с canvas-слоя. */
  eraseEntityFromLayer(entity: Entity, layerId: keyof LayerList) {
    const context = this.layers[layerId].context;
    context.clearRect(...this.getEntityActualRect(entity));
  }

  /** Перерисовывает все сущности на слое. */
  redrawAllEntitiesOnLayer(layerId: keyof LayerList) {
    const { entities: objects } = this.layers[layerId];
    this.eraseAllEntitiesOnLayer(layerId);
    for (const layerObject of objects) {
      this.drawEntityOnLayer(layerObject.instance, layerId);
    }
  }

  /** Стирает все сущности с canvas-слоя. */
  eraseAllEntitiesOnLayer(layerId: keyof LayerList) {
    const { context } = this.layers[layerId];
    context.clearRect(0, 0, this.convertToPixels(this.width), this.convertToPixels(this.height));
  }

  /** Возвращает актуальные координаты сущности на слое (в пикселях) */
  getEntityActualRect(entity: Entity) {
    return [
      this.convertToPixels(entity.posX),
      this.convertToPixels(entity.posY),
      this.convertToPixels(entity.width),
      this.convertToPixels(entity.height),
    ] as const;
  }

  /** Проверяет, что слои еще не созданы. */
  private isRootEmpty() {
    return this.root.innerHTML.trim() === '';
  }

  /** Пересчитывает размер игровых клеток в пиксели. */
  private convertToPixels(value: number) {
    return Math.round(value * this.pixelRatio);
  }
}
