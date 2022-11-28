import { Terrain } from './';

describe('game/entities/Terrain', () => {
  it('should have properties based on type', () => {
    const brickWall = new Terrain({ type: 'brickWall', width: 4, height: 4 });
    const trees = new Terrain({ type: 'trees', width: 4, height: 4 });
    const water = new Terrain({ type: 'water', width: 4, height: 4 });

    expect(brickWall).toHaveProperty('crossable', false);
    expect(brickWall).toHaveProperty('hittable', true);
    expect(trees).toHaveProperty('crossable', true);
    expect(trees).toHaveProperty('hittable', false);
    expect(water).toHaveProperty('crossable', false);
    expect(water).toHaveProperty('hittable', false);
  });
});
