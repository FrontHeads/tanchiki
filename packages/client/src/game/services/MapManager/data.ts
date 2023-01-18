export enum Cell {
  Blank = 0,
  Forest = 11,
  Ice = 12,
  Water = 13,
  Base = 15,

  Brick = 1,
  BrickTop = 2,
  BrickRight = 3,
  BrickBottom = 4,
  BrickLeft = 5,
  BrickBottomLeft = 17,
  BrickBottomRight = 18,

  Concrete = 6,
  ConcreteTop = 7,
  ConcreteRight = 8,
  ConcreteBottom = 9,
  ConcreteLeft = 10,
  ConcreteBottomLeft = 19,
  ConcreteBottomRight = 20,
}

export const concreteCells: Cell[] = [
  Cell.Concrete,
  Cell.ConcreteTop,
  Cell.ConcreteRight,
  Cell.ConcreteBottom,
  Cell.ConcreteLeft,
  Cell.ConcreteBottomLeft,
  Cell.ConcreteBottomRight,
];

export const brickCells: Cell[] = [
  Cell.Brick,
  Cell.BrickTop,
  Cell.BrickRight,
  Cell.BrickBottom,
  Cell.BrickLeft,
  Cell.BrickBottomLeft,
  Cell.BrickBottomRight,
];

/**
 * Координаты клеток на карте, на которых спаунятся танки
 * Используются при расстановке вражеских танков на поле
 * и при проверке карты уровня на случай, если в эти клетки
 * был установлен какой-то предмет
 */
export const spawnPlaces: Record<number, number[]> = {
  //mapmanager
  0: [0, 6, 12],
  12: [4, 8],
};
