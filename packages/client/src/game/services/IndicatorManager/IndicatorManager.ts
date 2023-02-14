import { UIElement } from '../../ui';
import { type UIElementSettings } from '../../ui/UIElement/typings';
import { isOdd } from '../../utils';
import { type Game } from '../';
import { Color } from '../View/colors';
import { spriteCoordinates } from '../View/spriteCoordinates';
import { IndicatorNames, playerLivesData } from './data';

export class IndicatorManager {
  tankEnemiesLeftRendered = false;
  layerName = 'ceiling';

  constructor(private game: Game) {
    this.renderLevel(game.state.level);
  }

  /** Рендерит иконки не отспаунившихся танков врагов. */
  renderTankEnemiesLeft(tankEnemiesLeft: number) {
    if (!this.tankEnemiesLeftRendered) {
      let currentPosY = 2;
      let currentPosX = 56;

      for (let i = 0; i < tankEnemiesLeft; i++) {
        currentPosX = isOdd(i) ? 58 : 56;
        currentPosY = i % 2 ? currentPosY : currentPosY + 2;

        this.renderElement({
          posX: currentPosX,
          posY: currentPosY,
          width: 2,
          height: 2,
          color: Color.Black,
          mainSpriteCoordinates: spriteCoordinates['ui.enemy'],
          indicatorName: IndicatorNames.TankEnemy,
        });
      }

      this.tankEnemiesLeftRendered = true;

      return;
    }

    this.removeEntity(IndicatorNames.TankEnemy);
  }

  /** Рендерит количество жизней у Игрока 1 и Игрока 2. */
  renderPlayerLives(playerType: keyof typeof playerLivesData, lives: number) {
    this.removeEntity(playerType + IndicatorNames.Lives);

    this.renderElement({
      posX: 56,
      posY: playerLivesData[playerType].posY,
      width: 4,
      height: 2,
      color: Color.Black,
      text: playerLivesData[playerType].header,
      indicatorName: IndicatorNames.PlayerHeader,
    });

    this.renderElement({
      posX: 56,
      posY: playerLivesData[playerType].posY + 2,
      width: 2,
      height: 2,
      color: Color.Orange,
      mainSpriteCoordinates: spriteCoordinates['ui.player'],
      indicatorName: IndicatorNames.PlayerIcon,
    });

    this.renderElement({
      posX: 58.3,
      posY: playerLivesData[playerType].posY + 2,
      width: 4,
      height: 2,
      color: Color.Black,
      text: lives.toString(),
      indicatorName: playerType + IndicatorNames.Lives,
    });
  }

  /** Рендерит номер текущего уровня. */
  renderLevel(level: number) {
    this.renderElement({
      posX: 56,
      posY: 44,
      width: 4,
      height: 4,
      color: Color.Orange,
      mainSpriteCoordinates: spriteCoordinates.flag,
      indicatorName: IndicatorNames.Flag,
    });

    this.renderElement({
      posX: level > 9 ? 57 : 58,
      posY: 48,
      width: 4,
      height: 2,
      color: Color.Black,
      text: level.toString(),
      indicatorName: IndicatorNames.Level,
    });
  }

  /** Удаляет с канваса отрендеренную сущность индикатора (иконки танков или количество оставшихся жизней). */
  removeEntity(indicatorName: string) {
    const canvasLayerItem = [...this.game.view.layers[this.layerName].entities].findLast(item => {
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
    this.game.view.add(elem);
    elem.render();
    return elem;
  }
}
