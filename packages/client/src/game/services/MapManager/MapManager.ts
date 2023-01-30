import { type EntitySettings, type EntityType, type Pos } from '../../entities/Entity/typings';
import { type EnemyVariant } from '../../entities/Tank/typings';
import { type GameSettings } from '../Game/typings';
import { brickCells, Cell, concreteCells, spawnPlaces } from './data';
import { enemyForces } from './enemyForces';
import { levels } from './levels';
import { type MapTerrainData } from './typings';

export class MapManager {
  private mapLevelIndex = 0;
  private mapTerrainData = levels;
  private mapEnemyForces = enemyForces;

  constructor(private gameSettings: GameSettings) {}

  fixMapData(map: MapTerrainData): MapTerrainData {
    this.clearSpawnPlaces(map);
    return map;
  }

  coordToPos(value: number) {
    return value * 4 + this.gameSettings.boundarySize;
  }

  coordsToRect(x: number, y: number): Pos {
    return {
      posX: this.coordToPos(x),
      posY: this.coordToPos(y),
    };
  }

  getMap(level: number): MapTerrainData {
    this.mapLevelIndex = level - 1;
    const map = this.mapTerrainData[this.mapLevelIndex];

    return this.fixMapData(map);
  }

  getMapTankEnemyVariant(counter: number): EnemyVariant {
    const mapEnemyForces = enemyForces[this.mapLevelIndex];
    const enemyVariantLetter = mapEnemyForces[counter];

    switch (enemyVariantLetter) {
      case 'b':
        return 'FAST';
      case 'c':
        return 'POWER';
      case 'd':
        return 'ARMOR';
      default:
        return 'BASIC';
    }
  }

  mapDataToEntitySettings(map: MapTerrainData): EntitySettings[] {
    const result: EntitySettings[] = [];

    map.forEach((row, y) => {
      row.forEach((cell, x) => {
        let type: Nullable<EntityType> = null;
        if (concreteCells.includes(cell)) {
          type = 'concreteWall';
        } else if (brickCells.includes(cell)) {
          type = 'brickWall';
        } else if (cell === Cell.Forest) {
          type = 'trees';
        } else if (cell === Cell.Water) {
          type = 'water';
        } else if (cell === Cell.Ice) {
          type = 'ice';
        } else if (cell === Cell.Base) {
          type = 'flag';
        } else {
          return;
        }

        const entity = {
          type,
          width: 4,
          height: 4,
          posX: this.coordToPos(x),
          posY: this.coordToPos(y),
        };

        if (entity.type === 'brickWall' || entity.type === 'concreteWall') {
          this.updateWallProps(entity, cell);
        }

        result.push(entity);
      });
    });

    return result;
  }

  updateWallProps(entity: EntitySettings, cell: Cell) {
    if (!entity.width || !entity.height) {
      return;
    }
    const halfCellSize = 2;

    switch (cell) {
      case Cell.BrickTop:
      case Cell.ConcreteTop:
        entity.variant = 'TOP';
        entity.height -= halfCellSize;
        break;
      case Cell.BrickBottom:
      case Cell.ConcreteBottom:
        entity.variant = 'BOTTOM';
        entity.posY += halfCellSize;
        entity.height -= halfCellSize;
        break;
      case Cell.BrickLeft:
      case Cell.ConcreteLeft:
        entity.variant = 'LEFT';
        entity.width -= halfCellSize;
        break;
      case Cell.BrickRight:
      case Cell.ConcreteRight:
        entity.variant = 'RIGHT';
        entity.posX += halfCellSize;
        entity.width -= halfCellSize;
        break;
      case Cell.BrickBottomLeft:
      case Cell.ConcreteBottomLeft:
        entity.variant = 'LEFT_BOTTOM';
        entity.posY += halfCellSize;
        entity.width -= halfCellSize;
        entity.height -= halfCellSize;
        break;
      case Cell.BrickBottomRight:
      case Cell.ConcreteBottomRight:
        entity.variant = 'RIGHT_BOTTOM';
        entity.posX += halfCellSize;
        entity.posY += halfCellSize;
        entity.width -= halfCellSize;
        entity.height -= halfCellSize;
        break;
      default:
        entity.variant = 'WHOLE';
        break;
    }
  }

  private clearSpawnPlaces(map: MapTerrainData): void {
    for (const row in spawnPlaces) {
      for (const cow of spawnPlaces[row]) {
        map[row][cow] = Cell.Blank;
      }
    }
  }
}
