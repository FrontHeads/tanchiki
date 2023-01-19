import { type EntityDynamicSettings } from '../../entities/EntityDynamic/typings';
import { Color } from '../View/data/colors';

export enum Player {
  Player1 = 'PLAYER1',
  Player2 = 'PLAYER2',
}

export const playerInitialSettings: Record<Player, EntityDynamicSettings> = {
  [Player.Player1]: { posX: 18, posY: 50, color: Color.Yellow, variant: 'PLAYER1' },
  [Player.Player2]: { posX: 34, posY: 50, color: Color.Lime, variant: 'PLAYER2' },
};
