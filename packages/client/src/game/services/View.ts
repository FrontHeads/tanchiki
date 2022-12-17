import type { Entity } from '../entities';
import type { AnimationSettings, Size } from '../typings';
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

type GetSpriteCoordinates = {
  entity: Entity;
  animation?: AnimationSettings;
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
  spriteImg: HTMLImageElement | null = null;

  constructor({ width, height }: Size) {
    super();
    this.width = width;
    this.height = height;
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

    for (const [eventName, callback] of Object.entries(layerObject.listeners)) {
      entity.on(eventName, callback);
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
  drawEntityOnLayer(entity: Entity, layerId: keyof LayerList) {
    const context = this.layers[layerId].context;

    // Отрисовка сущностей без спрайта
    if (!entity.spriteCoordinates && entity.color) {
      context.fillStyle = entity.color;
      context.fillRect(...this.getEntityActualRect(entity));
      return;
    }

    if (!(this.spriteImg instanceof HTMLImageElement)) {
      return;
    }

    // Отрисовка сущностей без настраиваемой анимации
    if (!entity.animations?.length) {
      const spriteCoordinates = this.getSpriteCoordinates({ entity });

      if (!spriteCoordinates) {
        return;
      }

      //@ts-expect-error tuple создавать неудобно, влечет лишние проверки, а тут нужна скорость работы.
      context.drawImage(this.spriteImg, ...spriteCoordinates, ...this.getEntityActualRect(entity));
      return;
    }

    //Отрисовка сущностей с настраиваемой анимацией.
    if (entity.animations.length) {
      entity.animations.forEach(animation => {
        const spriteCoordinates = this.getSpriteCoordinates({ entity, animation });

        if (!spriteCoordinates) {
          return;
        }

        //@ts-expect-error tuple создавать неудобно, влечет лишние проверки, а тут важна скорость работы.
        context.drawImage(this.spriteImg, ...spriteCoordinates, ...this.getEntityActualRect(entity));
        this.setNextSpriteFrame(animation, entity);
      });
    }
  }

  /** Стирает отображение сущности на canvas-слое, но не удаляет сущность. */
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

  /** Стирает отображение всех сущностей с canvas-слоя. */
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

  /** Возвращает координаты сущности на спрайте */
  private getSpriteCoordinates({ entity, animation }: GetSpriteCoordinates) {
    let spriteCoordinates: number[] | null = null;

    // Спрайты сущностей без настроек анимации (меняются 2 фрейма или нет анимации).
    if (!animation && entity.spriteCoordinates) {
      // Спрайты статичных сущностей.
      if (!entity.movable && Array.isArray(entity.spriteCoordinates)) {
        return entity.spriteCoordinates[0];
      }

      // Спрайты подвижных сущностей.
      if (entity.movable && !Array.isArray(entity.spriteCoordinates)) {
        // Без настроек анимации у сущности м.б. только 2 фрейма. Тут их меняем.
        entity.spriteFrame = +!entity.spriteFrame;
        return entity.spriteCoordinates[entity.direction][entity.spriteFrame];
      }
    }

    // Спрайты сущностей с настраиваемой анимацией
    if (animation && Array.isArray(animation.spriteCoordinates)) {
      spriteCoordinates = animation.spriteCoordinates[animation.spriteFrame || 0];

      return spriteCoordinates;
    }
  }

  /** Меняет sprite-frame, который отрисуется в следующий раз. */
  private setNextSpriteFrame(animation: AnimationSettings, entity: Entity) {
    if (typeof animation.spriteFrame !== 'number') {
      return;
    }

    animation.spriteFrame++;

    const isFinishFrame = animation.spriteFrame === animation.spriteCoordinates?.length;

    if (isFinishFrame && animation.looped) {
      animation.spriteFrame = 0;
    }

    if (isFinishFrame && !animation.looped) {
      // @ts-expect-error animation.name задается по умолчанию в методе startAnimation() и не м.б. undefined
      entity.cancelAnimation('deleteEntity', animation.name);
    }
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
