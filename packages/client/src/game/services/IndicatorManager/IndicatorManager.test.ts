import { Player } from '../../typings';
import { UIElement } from '../../ui/UIElement';
import { Game } from '../Game';
import { IndicatorNames } from './data';
import { IndicatorManager } from './IndicatorManager';

describe('game/services/IndicatorManager', () => {
  const layerName = 'ceiling';

  const game = Game.create();
  game.createView(document.body);
  const indicatorManager = new IndicatorManager(game);

  const tankEnemiesLeft = 10;
  indicatorManager.renderTankEnemiesLeft(tankEnemiesLeft);

  const livesNumber = 2;
  indicatorManager.renderPlayerLives(Player.PLAYER1, livesNumber);

  it('should render current level', () => {
    const layerItem = [...game.view.layers[layerName].entities].find(item => {
      if (item.instance instanceof UIElement && item.instance.indicatorName === IndicatorNames.Level) {
        return true;
      }
    });

    const level = layerItem?.instance instanceof UIElement ? layerItem?.instance.text : null;

    expect(level).toBe(game.level.toString());
  });

  it('should render tank enemies icons', () => {
    let counterTankEnemyIcon = 0;
    [...game.view.layers[layerName].entities].forEach(item => {
      if (item.instance instanceof UIElement && item.instance.indicatorName === IndicatorNames.TankEnemy) {
        counterTankEnemyIcon++;
      }
    });

    expect(counterTankEnemyIcon).toBe(tankEnemiesLeft);
  });

  it('should remove tank enemies icons', () => {
    indicatorManager.removeEntity(IndicatorNames.TankEnemy);

    let counterTankEnemyIcon = 0;
    [...game.view.layers[layerName].entities].forEach(item => {
      if (item.instance instanceof UIElement && item.instance.indicatorName === IndicatorNames.TankEnemy) {
        counterTankEnemyIcon++;
      }
    });

    expect(counterTankEnemyIcon).toBe(tankEnemiesLeft - 1);
  });

  it('should render player lives number', () => {
    const layerItem = [...game.view.layers[layerName].entities].find(item => {
      if (item.instance instanceof UIElement && item.instance.indicatorName === Player.PLAYER1 + IndicatorNames.Lives) {
        return true;
      }
    });

    const lives = layerItem?.instance instanceof UIElement ? layerItem?.instance.text : null;

    expect(lives).toBe(livesNumber.toString());
  });

  it('should rerender and reduce the number of lives', () => {
    indicatorManager.renderPlayerLives(Player.PLAYER1, livesNumber - 1);

    let counterLivesIndicator = 0;
    [...game.view.layers[layerName].entities].forEach(item => {
      if (item.instance instanceof UIElement && item.instance.indicatorName === Player.PLAYER1 + IndicatorNames.Lives) {
        counterLivesIndicator++;
      }
    });

    const layerItem = [...game.view.layers[layerName].entities].find(item => {
      if (item.instance instanceof UIElement && item.instance.indicatorName === Player.PLAYER1 + IndicatorNames.Lives) {
        return true;
      }
    });

    const lives = layerItem?.instance instanceof UIElement ? layerItem?.instance.text : null;

    // ?????????? ?????????????????? ???????????????? ???????? ???????????????? ?? ?????????????????????? ????????????, ???? 2 ?? ???? 0.
    expect(counterLivesIndicator).toBe(1);
    // ?????????? ?????????????????? ???????????????????????? ???????????????????? ?????????? ????????????.
    expect(lives).toBe((livesNumber - 1).toString());
  });
});
