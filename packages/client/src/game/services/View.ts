import type { Entity } from '../entities';
import type { GameSettings } from '../typings';

type Layer = Record<
  string,
  {
    context: CanvasRenderingContext2D;
    objects: Set<LayerObject>;
  }
>;

type LayerObject = {
  instance: Entity;
  listeners: Record<string, () => void>;
};

export class View {
  width = 0;
  height = 0;
  pixelRatio = 8;
  layerZIndexCount = 0;
  layers: Layer = {};
  root: HTMLElement;

  constructor({ width, height, root }: GameSettings) {
    if (root === null) {
      throw new Error('proper DOM root for the game should be set');
    }
    this.root = root;
    this.width = width;
    this.height = height;
    this.buildLayers();
  }

  convertToPixels(value: number) {
    return Math.round(value * this.pixelRatio);
  }

  buildLayers() {
    this.createLayer('floor').style.background = '#000';
    this.createLayer('tanks');
    this.createLayer('projectiles');
    this.createLayer('ceiling');
    this.createLayer('overlay').style.position = 'relative';
  }

  createLayer(id: string) {
    const layer = document.createElement('canvas');
    layer.id = id;
    layer.width = this.convertToPixels(this.width);
    layer.height = this.convertToPixels(this.height);
    layer.style.display = 'block';
    layer.style.position = 'absolute';
    layer.style.zIndex = (this.layerZIndexCount++).toString();
    this.layers[id] = {
      context: layer.getContext('2d') as CanvasRenderingContext2D,
      objects: new Set(),
    };
    this.root?.appendChild(layer);
    return layer;
  }

  bindEntityToLayer(entity: Entity, layerId: keyof Layer) {
    const layerObject = {
      instance: entity,
      listeners: {
        entityShouldUpdate: () => {
          this.eraseEntityFromLayer(entity, layerId);
        },
        entityDidUpdate: () => {
          this.drawEntityOnLayer(entity, layerId);
        },
        entityShouldBeDestroyed: () => {
          this.eraseEntityFromLayer(entity, layerId);
          this.removeEntityFromLayer(entity, layerId);
        },
      },
    };
    this.layers[layerId].objects.add(layerObject);

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

  getEntityActualRect(entity: Entity) {
    return [
      this.convertToPixels(entity.posX),
      this.convertToPixels(entity.posY),
      this.convertToPixels(entity.width),
      this.convertToPixels(entity.height),
    ] as const;
  }

  drawEntityOnLayer(entity: Entity, layerId: keyof Layer) {
    const context = this.layers[layerId].context;
    context.fillStyle = entity.color;
    context.fillRect(...this.getEntityActualRect(entity));
  }

  eraseEntityFromLayer(entity: Entity, layerId: keyof Layer) {
    const context = this.layers[layerId].context;
    context.clearRect(...this.getEntityActualRect(entity));
  }

  redrawAllEntitiesOnLayer(layerId: keyof Layer) {
    const { context, objects } = this.layers[layerId];
    context.clearRect(0, 0, this.convertToPixels(this.width), this.convertToPixels(this.height));
    for (const layerObject of objects) {
      this.drawEntityOnLayer(layerObject.instance, layerId);
    }
  }
}
