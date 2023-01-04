import { spriteCoordinates } from '../../data/constants';
import { UIElementSettings } from '../../typings';
import { UIElement } from '../../ui';
import { isOdd } from '../../utils';
import { Game } from '../Game';
import { playerLivesData } from './data';

export class IndicatorManager {
  tankEnemiesLeftRendered = false;
  layerName = 'ceiling';

  constructor(private game: Game) {
    this.renderLevel(game.level);
  }

  /** Рендерит иконки не отспаунившихся танков врагов. */
  renderTankEnemiesLeft(tankEnemiesLeft: number) {
    if (!this.tankEnemiesLeftRendered) {
      let tankCounter = 0;
      let currentPosY = 2;
      let currentPosX = 56;

      while (tankCounter <= tankEnemiesLeft) {
        currentPosX = isOdd(tankCounter) ? 58 : 56;
        currentPosY = tankCounter % 3 ? currentPosY : currentPosY + 2;
        tankCounter++;

        this.renderElement({
          posX: currentPosX,
          posY: currentPosY,
          width: 2,
          height: 2,
          color: 'black',
          mainSpriteCoordinates: spriteCoordinates['ui.enemy'],
          indicatorName: 'enemyTankIcon',
        });
      }
      this.tankEnemiesLeftRendered = true;
      return;
    }

    this.removeEntity('enemyTankIcon');
  }

  /** Рендерит количество жизней у Игрока 1 и Игрока 2. */
  renderPlayerLives(playerType: number, lives: number) {
    this.removeEntity('player' + playerType + 'Lives');

    this.renderElement({
      posX: 56,
      posY: playerLivesData[playerType].posY,
      width: 4,
      height: 2,
      color: 'black',
      text: playerLivesData[playerType].header,
      indicatorName: 'playerHeader',
    });

    this.renderElement({
      posX: 56,
      posY: playerLivesData[playerType].posY + 2,
      width: 2,
      height: 2,
      color: 'orange',
      mainSpriteCoordinates: spriteCoordinates['ui.player'],
      indicatorName: 'playerIcon',
    });

    this.renderElement({
      posX: 58,
      posY: playerLivesData[playerType].posY + 2,
      width: 4,
      height: 2,
      color: 'black',
      text: lives.toString(),
      indicatorName: 'player' + playerType + 'Lives',
    });
  }

  /** Рендерит номер текущего уровня. */
  renderLevel(level: number) {
    this.renderElement({
      posX: 56,
      posY: 44,
      width: 4,
      height: 4,
      color: 'orange',
      mainSpriteCoordinates: spriteCoordinates.flag,
      indicatorName: 'flag',
    });

    this.renderElement({
      posX: level > 9 ? 57 : 58,
      posY: 48,
      width: 4,
      height: 2,
      color: 'black',
      text: level.toString(),
      indicatorName: 'levelNumber',
    });
  }

  /** Удаляет с канваса отрендеренную сущность индикатора (иконки танков или количество оставшихся жизней). */
  removeEntity(indicatorName: string) {
    const canvasLayerItem = [...this.game.view.layers[this.layerName].entities].reverse().find(item => {
      if (item.instance instanceof UIElement && item.instance.indicatorName === indicatorName) {
        return true;
      }
    });

    const targetEntity = canvasLayerItem?.instance;

    if (targetEntity instanceof UIElement && targetEntity.indicatorName === indicatorName) {
      this.game.view.eraseFromLayer(targetEntity, this.layerName);
      this.game.view.removeEntityFromLayer(targetEntity, this.layerName);
    }
  }

  /** Рендерит конкретную сущность индикатора. */
  renderElement(props: UIElementSettings) {
    const elem = new UIElement(props);
    this.game.loop.registerTimerHandlers(elem);
    this.game.view.add(elem);
    elem.render();
    return elem;
  }
}
