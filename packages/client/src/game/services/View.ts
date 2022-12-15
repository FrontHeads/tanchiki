import type { Entity } from '../entities';
import type { Pos, Rect, Size } from '../typings';
import type { UIElement } from '../ui';
import { EventEmitter } from '../utils';

type Layer = Record<
  string,
  {
    context: CanvasRenderingContext2D;
    objects: Set<LayerObject>;
  }
>;

type LayerObject = {
  instance: Entity;
  listeners: Record<string, (...args: Array<any>) => void>;
};

export class View extends EventEmitter {
  width = 0;
  height = 0;
  pixelRatio = 10;
  gameBgColor = 'black';
  layerZIndexCount = 0;
  layers: Layer = {};
  root!: HTMLElement;

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

  isRootEmpty() {
    return this.root.innerHTML.trim() === '';
  }

  convertToPixels(value: number) {
    return Math.round(value * this.pixelRatio);
  }

  reset() {
    for (const id of Object.keys(this.layers)) {
      this.eraseAllEntitiesOnLayer(id);
    }
  }

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
        objects: new Set(),
      };
    }
    return layer;
  }

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

  bindEntityToLayer(entity: Entity | UIElement, layerId: keyof Layer) {
    const layerObject = {
      instance: entity,
      listeners: {
        entityShouldUpdate: () => {
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
    this.layers[layerId]?.objects.add(layerObject);

    for (const [eventName, callback] of Object.entries(layerObject.listeners)) {
      entity.on(eventName, callback);
    }
  }

  removeEntityFromLayer(entity: Entity, layerId: keyof Layer) {
    let layerObjectToDelete: LayerObject | null = null;
    for (const layerObject of this.layers[layerId].objects) {
      if (layerObject.instance === entity) {
        layerObjectToDelete = layerObject;
      }
    }
    if (layerObjectToDelete) {
      this.layers[layerId].objects.delete(layerObjectToDelete);
      for (const [eventName, callback] of Object.entries(layerObjectToDelete.listeners)) {
        entity.off(eventName, callback);
      }
    }
  }

  getActualRect(rect: Entity | Rect) {
    return [
      this.convertToPixels(rect.posX),
      this.convertToPixels(rect.posY),
      this.convertToPixels(rect.width),
      this.convertToPixels(rect.height),
    ] as const;
  }

  drawTextOnLayer(elem: UIElement, layerId: keyof Layer) {
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

  drawOnLayer(entity: Entity, layerId: keyof Layer) {
    const context = this.layers[layerId].context;
    context.fillStyle = entity.color;
    context.fillRect(...this.getActualRect(entity));
  }

  eraseFromLayer(rect: Rect | Entity, layerId: keyof Layer) {
    const context = this.layers[layerId].context;
    context.clearRect(...this.getActualRect(rect));
  }

  redrawAllEntitiesOnLayer(layerId: keyof Layer) {
    const { objects } = this.layers[layerId];
    this.eraseAllEntitiesOnLayer(layerId);
    for (const layerObject of objects) {
      this.drawOnLayer(layerObject.instance, layerId);
    }
  }

  eraseAllEntitiesOnLayer(layerId: keyof Layer) {
    const { context } = this.layers[layerId];
    context.clearRect(0, 0, this.convertToPixels(this.width), this.convertToPixels(this.height));
  }
}
