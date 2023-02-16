import { type TankPlayerSettings } from '../../entities/';
import { Color } from '../View/colors';

export enum Player {
  Player1 = 'PLAYER1',
  Player2 = 'PLAYER2',
}

export const playerInitialSettings: Record<Player, TankPlayerSettings> = {
  [Player.Player1]: { posX: 18, posY: 50, color: Color.Yellow, variant: 'PLAYER1' },
  [Player.Player2]: { posX: 34, posY: 50, color: Color.Lime, variant: 'PLAYER2' },
};
