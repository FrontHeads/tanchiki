import { type EntitySettings, type EntityType, type Pos } from '../../entities/Entity/typings';
import { type EnemyVariant } from '../../entities/Tank/typings';
import { rand } from '../../utils/rand';
import { type Game } from '../';
import { brickCells, Cell, concreteCells, spawnPlaces } from './data';
import { enemyForces } from './enemyForces';
import { levels } from './levels';
import { type MapTerrainData } from './typings';

export class MapManager {
  private map: MapTerrainData | null = null;
  private mapLevelIndex = 0;
  private mapTerrainData = levels;
  private mapEnemyForces = enemyForces;

  constructor(private game: Game) {
    this.mapLevelIndex = this.game.state.level - 1;
  }

  fixMapData(map: MapTerrainData): MapTerrainData {
    this.clearSpawnPlaces(map);
    return map;
  }

  coordToPos(value: number) {
    return value * 4 + this.game.state.boundarySize;
  }

  coordsToRect(x: number, y: number): Pos {
    return {
      posX: this.coordToPos(x),
      posY: this.coordToPos(y),
    };
  }

  getMap(): MapTerrainData {
    this.map = this.fixMapData(this.mapTerrainData[this.mapLevelIndex]);

    return this.map;
  }

  getRandomEmptyCell() {
    if (!this.map) {
      return this.coordsToRect(0, 0);
    }

    let cell: Cell;
    let y = 0;
    let x = 0;
    const maxX = this.map.length - 1;
    const maxY = this.map[0].length - 1;

    do {
      y = rand(0, maxY);
      x = rand(0, maxX);
      cell = this.map[y][x];
    } while (cell !== Cell.Blank || (spawnPlaces[y] && spawnPlaces[y].includes(x)));

    return this.coordsToRect(x, y);
  }

  getMapTankEnemyVariant(counter: number): EnemyVariant {
    const mapEnemyForces = this.mapEnemyForces[this.mapLevelIndex];
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
        const entity = this.cellToEntitySettings(cell, x, y);

        if (!entity) {
          return;
        }

        result.push(entity);
      });
    });

    return result;
  }

  cellToEntitySettings(cell: number, x: number, y: number) {
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

    return entity;
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
