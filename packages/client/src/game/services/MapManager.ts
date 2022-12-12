import { brickCells, concreteCells, spawnPlaces } from '../data/constants';
import { levels } from '../data/levels';
import { Cell, EntitySettings, EntityType, GameSettings, MapData } from '../typings';

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

  getMap(level: number): MapData {
    const map = this.mapData[level - 1];

    return this.fixMapData(map);
  }

  mapDataToEntitySettings(map: MapData): EntitySettings[] {
    const result: EntitySettings[] = [];

    map.forEach((row, y) => {
      row.forEach((column, x) => {
        let type: Nullable<EntityType> = null;
        if (concreteCells.includes(column)) {
          type = 'concreteWall';
        } else if (brickCells.includes(column)) {
          type = 'brickWall';
        } else if (column === Cell.FOREST) {
          type = 'trees';
        } else if (column === Cell.WATER) {
          type = 'water';
        } else if (column === Cell.ICE) {
          type = 'ice';
        } else if (column === Cell.BASE) {
          type = 'flag';
        }

        // const subtype = column as Cell;
        if (type) {
          result.push({
            // subtype,
            type,
            width: 4,
            height: 4,
            posX: this.coordToPos(x),
            posY: this.coordToPos(y),
          });
        }
      });
    });

    return result;
  }

  private clearSpawnPlaces(map: MapData): void {
    for (const row in spawnPlaces) {
      for (const cow of spawnPlaces[row]) {
        map[row][cow] = Cell.BLANK;
      }
    }
  }
}
