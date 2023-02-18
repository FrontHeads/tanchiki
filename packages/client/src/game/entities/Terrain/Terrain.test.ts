import { type Projectile, EntityEvent, Terrain } from '../';

describe('game/entities/Terrain', () => {
  it('should have properties based on type', () => {
    const brickWall = new Terrain({ type: 'brickWall', posX: 0, posY: 0, width: 4, height: 4 });
    const trees = new Terrain({ type: 'trees', posX: 0, posY: 0, width: 4, height: 4 });
    const water = new Terrain({ type: 'water', posX: 0, posY: 0, width: 4, height: 4 });

    expect(brickWall).toHaveProperty('crossable', false);
    expect(brickWall).toHaveProperty('hittable', true);
    expect(trees).toHaveProperty('crossable', true);
    expect(trees).toHaveProperty('hittable', false);
    expect(water).toHaveProperty('crossable', false);
    expect(water).toHaveProperty('hittable', false);
  });

  const projectile = {} as Projectile;
  const damagedRect = { posX: 0, posY: 0, width: 4, height: 4 };

  it('should destroy brick walls', () => {
    const brickWall = new Terrain({ type: 'brickWall', posX: 0, posY: 0, width: 4, height: 4 });
    const destructionObserver = jest.fn();

    brickWall.on(EntityEvent.Destroyed, destructionObserver);

    brickWall.takeDamage(projectile, damagedRect);

    expect(destructionObserver).toHaveBeenCalledTimes(1);
  });

  it('should destroy concrete walls', () => {
    const concreteWall = new Terrain({ type: 'concreteWall', posX: 0, posY: 0, width: 4, height: 4 });
    const destructionObserver = jest.fn();

    concreteWall.on(EntityEvent.Destroyed, destructionObserver);

    projectile.explosionForce = 1;
    concreteWall.takeDamage(projectile, damagedRect);

    // Стена не разрушена, потому что снаряд обычный
    expect(destructionObserver).not.toHaveBeenCalled();

    projectile.explosionForce = 2;
    concreteWall.takeDamage(projectile, damagedRect);

    // Стена не разрушена, потому что нужно два попадания
    expect(destructionObserver).not.toHaveBeenCalled();

    concreteWall.takeDamage(projectile, damagedRect);

    expect(destructionObserver).toHaveBeenCalledTimes(1);
  }); 
});
