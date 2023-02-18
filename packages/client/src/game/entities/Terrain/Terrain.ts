import { Color } from '../../services/View/colors';
import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { Entity } from '../';
import { type DamageSettings, type EntitySettings, EntityEvent } from '../Entity/typings';
import { type TerrainVariant } from './typings';

export class Terrain extends Entity {
  variant: TerrainVariant = 'WHOLE';
  /** Содержит хэшированные координаты повреждённых клеток (используется для уничтожения бетонных стен). */
  damagedCells: Record<string, boolean> = {};

  constructor(props: EntitySettings) {
    super(props);
    Object.assign(this, props);
    this.role = 'neutral';
    switch (this.type) {
      case 'boundary':
        this.crossable = false;
        this.hittable = true;
        this.color = Color.Grey;
        break;
      case 'brickWall':
        this.crossable = false;
        this.hittable = true;
        this.color = Color.Brown;
        this.mainSpriteCoordinates = spriteCoordinates['terrain.brick'][this.variant];
        break;
      case 'concreteWall':
        this.crossable = false;
        this.hittable = true;
        this.color = Color.LightGrey;
        this.mainSpriteCoordinates = spriteCoordinates['terrain.concrete'][this.variant];
        break;
      case 'trees':
        this.crossable = true;
        this.hittable = false;
        this.color = Color.Green;
        this.mainSpriteCoordinates = spriteCoordinates['terrain.trees'];
        break;
      case 'water':
        this.crossable = false;
        this.hittable = false;
        this.color = Color.Blue;
        this.mainSpriteCoordinates = spriteCoordinates['terrain.water'];
        break;
      case 'ice':
        this.crossable = true;
        this.hittable = false;
        this.color = Color.AliceBlue;
        this.mainSpriteCoordinates = spriteCoordinates['terrain.ice'];
        break;
    }

    this.registerTerrainEvents();
  }

  registerTerrainEvents() {
    if (this.type === 'water') {
      this.on(EntityEvent.Spawn, () => {
        this.startAnimation({
          delay: 350,
          spriteCoordinates: spriteCoordinates['terrain.water'],
          looped: true,
        });
      });
    }

    if (this.type === 'brickWall') {
      this.on(EntityEvent.Damaged, (damagedRect: DamageSettings) => {
        this.emit(EntityEvent.Destroyed, damagedRect);
      });
    }

    if (this.type === 'concreteWall') {
      this.on(EntityEvent.Damaged, (damagedRect: DamageSettings) => {
        // Если снаряд обычный, то бетонную стену он не возьмёт.
        const projectilePower = damagedRect.source.explosionForce;
        if (!projectilePower || projectilePower < 2) {
          return;
        }

        // Если снаряд попал во второй раз туда же, то сносим стену.
        const cellHash = damagedRect.posX +'X'+ damagedRect.posY;
        if (this.damagedCells[cellHash]) {
          this.emit(EntityEvent.Destroyed, damagedRect);
        }
        this.damagedCells[cellHash] = true;
      });
    }
  }
}
