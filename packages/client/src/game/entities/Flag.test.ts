import { Flag } from './';

describe('game/entities/Flag', () => {
  it('should have properties based on type', () => {
    const flag = new Flag({ posX: 0, posY: 0, width: 4, height: 4 });

    expect(flag).toHaveProperty('crossable', false);
    expect(flag).toHaveProperty('hittable', true);
  });
});
