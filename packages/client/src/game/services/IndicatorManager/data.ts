import { Player } from '../Scenario/data';

export const playerLivesData = {
  [Player.Player1]: { header: '1 И', posY: 30 },
  [Player.Player2]: { header: '2 И', posY: 37 },
};

export enum IndicatorNames {
  TankEnemy = 'ENEMY_TANK_ICON',
  Lives = 'LIVES',
  PlayerHeader = 'PLAYER_HEADER',
  PlayerIcon = 'PLAYER_ICON',
  Flag = 'FLAG',
  Level = 'LEVEL',
}
