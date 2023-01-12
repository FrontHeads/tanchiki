import { Terrain } from './';

describe('game/entities/Terrain', () => {
  it('should have properties based on type', () => {
    const brickWall = new Terrain({ type: 'brickWall', posX: 0, posY: 0, width: 4, height: 4 });
    const trees = new Terrain({ type: 'trees', posX: 0, posY: 0, width: 4, height: 4 });
    const Water = new Terrain({ type: 'Water', posX: 0, posY: 0, width: 4, height: 4 });

    expect(brickWall).toHaveProperty('crossable', false);
    expect(brickWall).toHaveProperty('hittable', true);
    expect(trees).toHaveProperty('crossable', true);
    expect(trees).toHaveProperty('hittable', false);
    expect(Water).toHaveProperty('crossable', false);
    expect(Water).toHaveProperty('hittable', false);
  });
});
