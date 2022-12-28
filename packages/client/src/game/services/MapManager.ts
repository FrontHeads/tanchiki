import { brickCells, concreteCells, spawnPlaces } from '../data/constants';
import { levels } from '../data/levels';
import { Cell, EntitySettings, EntityType, GameSettings, MapData, Pos } from '../typings';

export class MapManager {
  private mapData = levels;

  constructor(private gameSettings: GameSettings) {}

  fixMapData(map: MapData): MapData {
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

  getMap(level: number): MapData {
    const map = this.mapData[level - 1];

    return this.fixMapData(map);
  }

  mapDataToEntitySettings(map: MapData): EntitySettings[] {
    const result: EntitySettings[] = [];

    map.forEach((row, y) => {
      row.forEach((cell, x) => {
        let type: Nullable<EntityType> = null;
        if (concreteCells.includes(cell)) {
          type = 'concreteWall';
        } else if (brickCells.includes(cell)) {
          type = 'brickWall';
        } else if (cell === Cell.FOREST) {
          type = 'trees';
        } else if (cell === Cell.WATER) {
          type = 'water';
        } else if (cell === Cell.ICE) {
          type = 'ice';
        } else if (cell === Cell.BASE) {
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
      case Cell.BRICK_TOP:
      case Cell.CONCRETE_TOP:
        entity.variant = 'TOP';
        entity.height -= halfCellSize;
        break;
      case Cell.BRICK_BOTTOM:
      case Cell.CONCRETE_BOTTOM:
        entity.variant = 'BOTTOM';
        entity.posY += halfCellSize;
        entity.height -= halfCellSize;
        break;
      case Cell.BRICK_LEFT:
      case Cell.CONCRETE_LEFT:
        entity.variant = 'LEFT';
        entity.width -= halfCellSize;
        break;
      case Cell.BRICK_RIGHT:
      case Cell.CONCRETE_RIGHT:
        entity.variant = 'RIGHT';
        entity.posX += halfCellSize;
        entity.width -= halfCellSize;
        break;
      case Cell.BRICK_LEFT_BOTTOM:
      case Cell.CONCRETE_LEFT_BOTTOM:
        entity.variant = 'LEFT_BOTTOM';
        entity.posY += halfCellSize;
        entity.width -= halfCellSize;
        entity.height -= halfCellSize;
        break;
      case Cell.BRICK_RIGHT_BOTTOM:
      case Cell.CONCRETE_RIGHT_BOTTOM:
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

  private clearSpawnPlaces(map: MapData): void {
    for (const row in spawnPlaces) {
      for (const cow of spawnPlaces[row]) {
        map[row][cow] = Cell.BLANK;
      }
    }
  }
}
