import { Color } from '../../data/colors';
import { type EntityDynamicSettings, Player } from '../../typings';

export const playerInitialSettings: Record<Player, EntityDynamicSettings> = {
  [Player.Player1]: { posX: 18, posY: 50, color: Color.Yellow, variant: 'PLAYER1' },
  [Player.Player2]: { posX: 34, posY: 50, color: Color.Lime, variant: 'PLAYER2' },
};
