import { birthPlace, BrickCells, ConcreteCells } from '../data/constants';
import { levels } from '../data/levels';
import { Cell, EntityType, MapData } from '../typings';
import { EntitySettings } from './../typings/index';

class MapManager {
  private mapData = levels;

  fixMapData(map: MapData): MapData {
    this.clearBirthPlaces(map);
    return map;
  }

  getMap(level: number): MapData {
    const map = this.mapData[level - 1];

    return this.fixMapData(map);
  }

  mapDataToEntitySettings(map: MapData): EntitySettings[] {
    const result: EntitySettings[] = [];

    const coordToPos = (value: number) => {
      return value * 4 + 2;
    };

    map.forEach((row, y) => {
      row.forEach((column, x) => {
        let type: Nullable<EntityType> = null;
        if (ConcreteCells.includes(column)) {
          type = 'concreteWall';
        } else if (BrickCells.includes(column)) {
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

        const subtype = column as Cell;
        if (type) {
          result.push({
            // subtype,
            type,
            width: 4,
            height: 4,
            posX: coordToPos(x),
            posY: coordToPos(y),
          });
        }
      });
    });

    return result;
  }

  private clearBirthPlaces(map: MapData): void {
    for (const row in birthPlace) {
      for (const cow of birthPlace[row]) {
        map[row][cow] = 0;
      }
    }
  }
}

export const mapManager = new MapManager();
