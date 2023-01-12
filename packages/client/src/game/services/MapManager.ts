import { brickCells, concreteCells, spawnPlaces } from '../data/constants';
import { levels } from '../data/levels';
import { type EntitySettings, type EntityType, type GameSettings, type MapData, type Pos, Cell } from '../typings';

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
        } else if (cell === Cell.Forest) {
          type = 'trees';
        } else if (cell === Cell.Water) {
          type = 'Water';
        } else if (cell === Cell.Ice) {
          type = 'Ice';
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

  private clearSpawnPlaces(map: MapData): void {
    for (const row in spawnPlaces) {
      for (const cow of spawnPlaces[row]) {
        map[row][cow] = Cell.Blank;
      }
    }
  }
}
