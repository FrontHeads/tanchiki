import { DesignName, gameDesignInLS } from './data';

/** Координаты сущностей на sprite-изображении с классическим дизайном */
export const classicDesignSprite = {
  flag: [[1532, 736, 64, 60]],
  'base.heart.alive': [[1244, 128, 64, 64]],
  'base.heart.dead': [[1308, 128, 64, 64]],
  'terrain.trees': [[1117, 128, 63, 63]],
  'terrain.ice': [[1180, 128, 63, 63]],
  'terrain.concrete': {
    WHOLE: [[1052, 64, 64, 64]],
    TOP: [[1052, 64, 64, 32]],
    BOTTOM: [[1052, 64, 64, 32]],
    LEFT: [[1052, 64, 32, 64]],
    RIGHT: [[1052, 64, 32, 64]],
    LEFT_BOTTOM: [[1052, 64, 32, 32]],
    RIGHT_BOTTOM: [[1052, 64, 32, 32]],
  },
  'terrain.brick': {
    WHOLE: [[1052, 0, 64, 64]],
    TOP: [[1052, 0, 64, 32]],
    BOTTOM: [[1052, 0, 64, 32]],
    LEFT: [[1052, 0, 32, 64]],
    RIGHT: [[1052, 0, 32, 64]],
    LEFT_BOTTOM: [[1052, 0, 32, 32]],
    RIGHT_BOTTOM: [[1052, 0, 32, 32]],
  },
  'terrain.water': [
    [1117, 192, 63, 63],
    [1053, 192, 63, 63],
  ],
  'terrain.menu-brick': [
    [0, 0, 16, 16],
    [16, 0, 16, 16],
  ],
  'terrain.inverse-brick': [
    [0, 0, 16, 16],
    [16, 0, 16, 16],
  ],
  'terrain.blue-brick': [
    [0, 0, 16, 16],
    [16, 0, 16, 16],
  ],
  //По два координата чтобы снаряд не мерцал при полете.
  projectile: {
    UP: [
      [1312, 405, 28, 28],
      [1312, 405, 28, 28],
    ],
    RIGHT: [
      [1407, 400, 28, 28],
      [1407, 400, 28, 28],
    ],
    DOWN: [
      [1377, 405, 28, 28],
      [1377, 405, 28, 28],
    ],
    LEFT: [
      [1342, 400, 28, 28],
      [1342, 400, 28, 28],
    ],
  },
  projectileExplosion: [
    [1052, 512, 64, 64],
    [1116, 512, 64, 64],
    [1180, 512, 64, 64],
  ],
  tankExplosion: [
    [1244, 512, 128, 128],
    [1372, 512, 128, 128],
    [1244, 512, 128, 128],
    [1372, 512, 128, 128],
  ],
  shield: [
    [1052, 576, 64, 64],
    [1116, 576, 64, 64],
  ],
  spawn: [
    [1050, 380, 65, 65],
    [1116, 380, 65, 65],
    [1180, 380, 65, 65],
    [1244, 380, 65, 65],
  ],
  'tank.enemy.default.a': {
    UP: [
      [524, 264, 52, 60],
      [588, 264, 52, 60],
    ],
    DOWN: [
      [780, 264, 52, 60],
      [844, 264, 52, 60],
    ],
    LEFT: [
      [648, 272, 60, 52],
      [712, 272, 60, 52],
    ],
    RIGHT: [
      [908, 268, 60, 52],
      [972, 268, 60, 52],
    ],
  },
  'tank.enemy.default.b': {
    UP: [
      [524, 328, 52, 60],
      [588, 328, 52, 60],
    ],
    DOWN: [
      [780, 332, 52, 60],
      [844, 332, 52, 60],
    ],
    LEFT: [
      [648, 336, 60, 52],
      [712, 336, 60, 52],
    ],
    RIGHT: [
      [908, 332, 60, 52],
      [972, 332, 60, 52],
    ],
  },
  'tank.enemy.default.c': {
    UP: [
      [524, 396, 52, 60],
      [588, 396, 52, 60],
    ],
    DOWN: [
      [776, 396, 52, 60],
      [840, 396, 52, 60],
    ],
    LEFT: [
      [648, 404, 60, 52],
      [712, 404, 60, 52],
    ],
    RIGHT: [
      [908, 400, 60, 52],
      [972, 400, 60, 52],
    ],
  },
  'tank.enemy.default.d': {
    UP: [
      [524, 460, 52, 60],
      [588, 460, 52, 60],
    ],
    DOWN: [
      [780, 460, 52, 60],
      [844, 460, 52, 60],
    ],
    LEFT: [
      [648, 464, 60, 52],
      [712, 464, 60, 52],
    ],
    RIGHT: [
      [904, 464, 60, 52],
      [968, 464, 60, 52],
    ],
  },
  'tank.enemy.danger.a': {
    UP: [
      [524, 788, 52, 60],
      [588, 788, 52, 60],
    ],
    DOWN: [
      [780, 788, 52, 60],
      [844, 788, 52, 60],
    ],
    LEFT: [
      [648, 796, 60, 52],
      [712, 796, 60, 52],
    ],
    RIGHT: [
      [908, 792, 60, 52],
      [972, 792, 60, 52],
    ],
  },
  'tank.enemy.danger.b': {
    UP: [
      [524, 852, 52, 60],
      [588, 852, 52, 60],
    ],
    DOWN: [
      [780, 856, 52, 60],
      [844, 856, 52, 60],
    ],
    LEFT: [
      [648, 860, 60, 52],
      [712, 860, 60, 52],
    ],
    RIGHT: [
      [908, 856, 60, 52],
      [972, 856, 60, 52],
    ],
  },
  'tank.enemy.danger.c': {
    UP: [
      [524, 920, 52, 60],
      [588, 920, 52, 60],
    ],
    DOWN: [
      [776, 920, 52, 60],
      [840, 920, 52, 60],
    ],
    LEFT: [
      [648, 928, 60, 52],
      [712, 928, 60, 52],
    ],
    RIGHT: [
      [908, 924, 60, 52],
      [972, 924, 60, 52],
    ],
  },
  'tank.enemy.danger.d': {
    UP: [
      [524, 984, 52, 60],
      [588, 984, 52, 60],
    ],
    DOWN: [
      [780, 984, 52, 60],
      [844, 984, 52, 60],
    ],
    LEFT: [
      [648, 988, 60, 52],
      [712, 988, 60, 52],
    ],
    RIGHT: [
      [904, 988, 60, 52],
      [968, 988, 60, 52],
    ],
  },
  'tank.enemy.primary.d': {
    UP: [
      [4, 460, 52, 60],
      [68, 460, 52, 60],
    ],
    DOWN: [
      [264, 460, 52, 60],
      [328, 460, 52, 60],
    ],
    LEFT: [
      [128, 464, 60, 52],
      [196, 464, 60, 52],
    ],
    RIGHT: [
      [388, 464, 60, 52],
      [456, 464, 60, 52],
    ],
  },
  'tank.enemy.secondary.d': {
    UP: [
      [4, 984, 52, 60],
      [68, 984, 52, 60],
    ],
    DOWN: [
      [264, 984, 52, 60],
      [328, 984, 52, 60],
    ],
    LEFT: [
      [128, 988, 60, 52],
      [196, 988, 60, 52],
    ],
    RIGHT: [
      [388, 988, 60, 52],
      [456, 988, 60, 52],
    ],
  },
  'tank.player.primary.a': {
    UP: [
      [4, 8, 52, 52],
      [68, 8, 52, 52],
    ],
    DOWN: [
      [264, 4, 52, 52],
      [328, 4, 52, 52],
    ],
    LEFT: [
      [136, 4, 52, 52],
      [204, 4, 52, 52],
    ],
    RIGHT: [
      [392, 4, 52, 52],
      [460, 4, 52, 52],
    ],
  },
  'tank.player.primary.b': {
    UP: [
      [4, 64, 52, 64],
      [68, 64, 52, 64],
    ],
    DOWN: [
      [264, 64, 52, 64],
      [328, 64, 52, 64],
    ],
    LEFT: [
      [128, 68, 64, 52],
      [196, 68, 64, 52],
    ],
    RIGHT: [
      [388, 68, 64, 52],
      [456, 68, 64, 52],
    ],
  },
  'tank.player.primary.c': {
    UP: [
      [4, 132, 52, 60],
      [68, 132, 52, 60],
    ],
    DOWN: [
      [264, 136, 52, 60],
      [328, 136, 52, 60],
    ],
    LEFT: [
      [128, 136, 60, 52],
      [196, 136, 60, 52],
    ],
    RIGHT: [
      [392, 136, 60, 52],
      [460, 136, 60, 52],
    ],
  },
  'tank.player.primary.d': {
    UP: [
      [4, 200, 56, 60],
      [68, 200, 56, 60],
    ],
    DOWN: [
      [264, 200, 56, 60],
      [328, 200, 56, 60],
    ],
    LEFT: [
      [128, 204, 60, 56],
      [196, 204, 60, 56],
    ],
    RIGHT: [
      [392, 204, 60, 56],
      [460, 204, 60, 56],
    ],
  },
  'tank.player.secondary.a': {
    UP: [
      [4, 532, 52, 52],
      [68, 532, 52, 52],
    ],
    DOWN: [
      [264, 528, 52, 52],
      [328, 528, 52, 52],
    ],
    LEFT: [
      [136, 528, 52, 52],
      [204, 528, 52, 52],
    ],
    RIGHT: [
      [392, 528, 52, 52],
      [460, 528, 52, 52],
    ],
  },
  'tank.player.secondary.b': {
    UP: [
      [4, 588, 52, 64],
      [68, 588, 52, 64],
    ],
    DOWN: [
      [264, 588, 52, 64],
      [328, 588, 52, 64],
    ],
    LEFT: [
      [128, 592, 64, 52],
      [196, 592, 64, 52],
    ],
    RIGHT: [
      [388, 592, 64, 52],
      [456, 592, 64, 52],
    ],
  },
  'tank.player.secondary.c': {
    UP: [
      [4, 656, 52, 60],
      [68, 656, 52, 60],
    ],
    DOWN: [
      [264, 660, 52, 60],
      [328, 660, 52, 60],
    ],
    LEFT: [
      [128, 660, 60, 52],
      [196, 660, 60, 52],
    ],
    RIGHT: [
      [392, 660, 60, 52],
      [460, 660, 60, 52],
    ],
  },
  'tank.player.secondary.d': {
    UP: [
      [4, 724, 56, 60],
      [68, 724, 56, 60],
    ],
    DOWN: [
      [264, 724, 56, 60],
      [328, 724, 56, 60],
    ],
    LEFT: [
      [128, 728, 60, 56],
      [196, 728, 60, 56],
    ],
    RIGHT: [
      [392, 728, 60, 56],
      [460, 728, 60, 56],
    ],
  },
  'powerup.helmet': [
    [1052, 448, 64, 60],
    [0, 0, 1, 1],
  ],
  'powerup.clock': [
    [1116, 448, 64, 60],
    [0, 0, 1, 1],
  ],
  'powerup.shovel': [
    [1180, 448, 64, 60],
    [0, 0, 1, 1],
  ],
  'powerup.star': [
    [1244, 448, 64, 60],
    [0, 0, 1, 1],
  ],
  'powerup.grenade': [
    [1308, 448, 64, 60],
    [0, 0, 1, 1],
  ],
  'powerup.tank': [
    [1372, 448, 64, 60],
    [0, 0, 1, 1],
  ],
  'powerup.gun': [
    [1436, 448, 64, 60],
    [0, 0, 1, 1],
  ],
  'points.100': [[1180, 640, 64, 64]],
  'points.200': [[1244, 640, 64, 64]],
  'points.300': [[1308, 640, 64, 64]],
  'points.400': [[1372, 640, 64, 64]],
  'points.500': [[1436, 640, 64, 64]],
  'ui.enemy': [[1308, 768, 32, 32]],
  'ui.player': [[1536, 576, 28, 32]],
  'ui.pause': [[1184, 704, 156, 28]],
  'ui.gameOver': [[1184, 736, 124, 60]],
};

const modernDesignSprite = {
  flag: [[1532, 736, 64, 60]],
  'base.heart.alive': [[1248, 132, 55, 55]],
  'base.heart.dead': [[1308, 128, 64, 64]],
  'terrain.trees': [[1122, 128, 51, 52]],
  'terrain.ice': [[1398, 128, 72, 72]],
  'terrain.concrete': {
    WHOLE: [[1060, 71, 50, 50]],
    TOP: [[1060, 71, 50, 25]],
    BOTTOM: [[1060, 71, 50, 25]],
    LEFT: [[1060, 71, 25, 50]],
    RIGHT: [[1060, 71, 25, 50]],
    LEFT_BOTTOM: [[1060, 71, 25, 25]],
    RIGHT_BOTTOM: [[1060, 71, 25, 25]],
  },
  'terrain.brick': {
    WHOLE: [[1052, 0, 64, 64]],
    TOP: [[1052, 0, 64, 32]],
    BOTTOM: [[1052, 0, 64, 32]],
    LEFT: [[1052, 0, 32, 64]],
    RIGHT: [[1052, 0, 32, 64]],
    LEFT_BOTTOM: [[1052, 0, 32, 32]],
    RIGHT_BOTTOM: [[1052, 0, 32, 32]],
  },
  'terrain.water': [
    [1086, 192, 74, 74],
    [1161, 192, 74, 74],
  ],
  'terrain.menu-brick': [
    [0, 0, 16, 16],
    [16, 0, 16, 16],
  ],
  'terrain.inverse-brick': [
    [0, 0, 16, 16],
    [16, 0, 16, 16],
  ],
  'terrain.blue-brick': [
    [0, 0, 16, 16],
    [16, 0, 16, 16],
  ],
  //По два координата чтобы снаряд не мерцал при полете.
  projectile: {
    UP: [
      [1345, 346, 40, 42],
      [1345, 346, 40, 42],
    ],
    RIGHT: [
      [1395, 358, 42, 40],
      [1395, 358, 42, 40],
    ],
    DOWN: [
      [1309, 348, 40, 42],
      [1309, 348, 40, 42],
    ],
    LEFT: [
      [1395, 319, 42, 40],
      [1395, 319, 42, 40],
    ],
  },
  projectileExplosion: [
    [1293, 810, 104, 104],
    [1406, 830, 84, 84],
    [1406, 830, 50, 50],
  ],
  tankExplosion: [
    [1323, 830, 64, 64],
    [1416, 830, 64, 64],
    [1416, 830, 64, 64],
  ],
  shield: [
    [1052, 576, 64, 64],
    [1116, 576, 64, 64],
  ],
  spawn: [
    [1050, 380, 65, 65],
    [1116, 380, 65, 65],
    [1180, 380, 65, 65],
    [1244, 380, 65, 65],
  ],
  'tank.enemy.default.a': {
    UP: [
      [515, 260, 67, 62],
      [579, 260, 67, 62],
    ],
    DOWN: [
      [797, 262, 67, 62],
      [861, 262, 67, 62],
    ],
    LEFT: [
      [650, 260, 62, 67],
      [727, 260, 62, 67],
    ],
    RIGHT: [
      [933, 260, 62, 67],
      [1010, 260, 62, 67],
    ],
  },
  'tank.enemy.default.b': {
    UP: [
      [515, 329, 67, 62],
      [579, 329, 67, 62],
    ],
    DOWN: [
      [797, 329, 67, 62],
      [861, 329, 67, 62],
    ],
    LEFT: [
      [650, 329, 62, 67],
      [727, 329, 62, 67],
    ],
    RIGHT: [
      [933, 329, 62, 67],
      [1010, 329, 62, 67],
    ],
  },
  'tank.enemy.default.c': {
    UP: [
      [524, 396, 52, 60],
      [588, 396, 52, 60],
    ],
    DOWN: [
      [776, 396, 52, 60],
      [840, 396, 52, 60],
    ],
    LEFT: [
      [648, 404, 60, 52],
      [712, 404, 60, 52],
    ],
    RIGHT: [
      [908, 400, 60, 52],
      [972, 400, 60, 52],
    ],
  },
  'tank.enemy.default.d': {
    UP: [
      [524, 460, 52, 60],
      [588, 460, 52, 60],
    ],
    DOWN: [
      [780, 460, 52, 60],
      [844, 460, 52, 60],
    ],
    LEFT: [
      [648, 464, 60, 52],
      [712, 464, 60, 52],
    ],
    RIGHT: [
      [904, 464, 60, 52],
      [968, 464, 60, 52],
    ],
  },
  'tank.enemy.danger.a': {
    UP: [
      [524, 788, 52, 60],
      [588, 788, 52, 60],
    ],
    DOWN: [
      [780, 788, 52, 60],
      [844, 788, 52, 60],
    ],
    LEFT: [
      [648, 796, 60, 52],
      [712, 796, 60, 52],
    ],
    RIGHT: [
      [908, 792, 60, 52],
      [972, 792, 60, 52],
    ],
  },
  'tank.enemy.danger.b': {
    UP: [
      [524, 852, 52, 60],
      [588, 852, 52, 60],
    ],
    DOWN: [
      [780, 856, 52, 60],
      [844, 856, 52, 60],
    ],
    LEFT: [
      [648, 860, 60, 52],
      [712, 860, 60, 52],
    ],
    RIGHT: [
      [908, 856, 60, 52],
      [972, 856, 60, 52],
    ],
  },
  'tank.enemy.danger.c': {
    UP: [
      [524, 920, 52, 60],
      [588, 920, 52, 60],
    ],
    DOWN: [
      [776, 920, 52, 60],
      [840, 920, 52, 60],
    ],
    LEFT: [
      [648, 928, 60, 52],
      [712, 928, 60, 52],
    ],
    RIGHT: [
      [908, 924, 60, 52],
      [972, 924, 60, 52],
    ],
  },
  'tank.enemy.danger.d': {
    UP: [
      [524, 984, 52, 60],
      [588, 984, 52, 60],
    ],
    DOWN: [
      [780, 984, 52, 60],
      [844, 984, 52, 60],
    ],
    LEFT: [
      [648, 988, 60, 52],
      [712, 988, 60, 52],
    ],
    RIGHT: [
      [904, 988, 60, 52],
      [968, 988, 60, 52],
    ],
  },
  'tank.enemy.primary.d': {
    UP: [
      [4, 460, 52, 60],
      [68, 460, 52, 60],
    ],
    DOWN: [
      [264, 460, 52, 60],
      [328, 460, 52, 60],
    ],
    LEFT: [
      [128, 464, 60, 52],
      [196, 464, 60, 52],
    ],
    RIGHT: [
      [388, 464, 60, 52],
      [456, 464, 60, 52],
    ],
  },
  'tank.enemy.secondary.d': {
    UP: [
      [4, 984, 52, 60],
      [68, 984, 52, 60],
    ],
    DOWN: [
      [264, 984, 52, 60],
      [328, 984, 52, 60],
    ],
    LEFT: [
      [128, 988, 60, 52],
      [196, 988, 60, 52],
    ],
    RIGHT: [
      [388, 988, 60, 52],
      [456, 988, 60, 52],
    ],
  },
  'tank.player.primary.a': {
    UP: [
      [-4, 2, 67, 62],
      [60, 2, 67, 62],
    ],
    DOWN: [
      [279, 0, 67, 62],
      [343, 0, 67, 62],
    ],
    LEFT: [
      [134, 2, 62, 67],
      [211, 2, 62, 67],
    ],
    RIGHT: [
      [415, 2, 62, 67],
      [492, 2, 62, 67],
    ],
  },
  'tank.player.primary.b': {
    UP: [
      [-4, 77, 67, 62],
      [60, 77, 67, 62],
    ],
    DOWN: [
      [278, 77, 67, 62],
      [342, 77, 67, 62],
    ],
    LEFT: [
      [134, 77, 62, 67],
      [211, 77, 62, 67],
    ],
    RIGHT: [
      [415, 77, 62, 67],
      [492, 77, 62, 67],
    ],
  },
  'tank.player.primary.c': {
    UP: [
      [4, 132, 52, 60],
      [68, 132, 52, 60],
    ],
    DOWN: [
      [264, 136, 52, 60],
      [328, 136, 52, 60],
    ],
    LEFT: [
      [128, 136, 60, 52],
      [196, 136, 60, 52],
    ],
    RIGHT: [
      [392, 136, 60, 52],
      [460, 136, 60, 52],
    ],
  },
  'tank.player.primary.d': {
    UP: [
      [4, 200, 56, 60],
      [68, 200, 56, 60],
    ],
    DOWN: [
      [264, 200, 56, 60],
      [328, 200, 56, 60],
    ],
    LEFT: [
      [128, 204, 60, 56],
      [196, 204, 60, 56],
    ],
    RIGHT: [
      [392, 204, 60, 56],
      [460, 204, 60, 56],
    ],
  },
  'tank.player.secondary.a': {
    UP: [
      [4, 532, 52, 52],
      [68, 532, 52, 52],
    ],
    DOWN: [
      [264, 528, 52, 52],
      [328, 528, 52, 52],
    ],
    LEFT: [
      [136, 528, 52, 52],
      [204, 528, 52, 52],
    ],
    RIGHT: [
      [392, 528, 52, 52],
      [460, 528, 52, 52],
    ],
  },
  'tank.player.secondary.b': {
    UP: [
      [4, 588, 52, 64],
      [68, 588, 52, 64],
    ],
    DOWN: [
      [264, 588, 52, 64],
      [328, 588, 52, 64],
    ],
    LEFT: [
      [128, 592, 64, 52],
      [196, 592, 64, 52],
    ],
    RIGHT: [
      [388, 592, 64, 52],
      [456, 592, 64, 52],
    ],
  },
  'tank.player.secondary.c': {
    UP: [
      [4, 656, 52, 60],
      [68, 656, 52, 60],
    ],
    DOWN: [
      [264, 660, 52, 60],
      [328, 660, 52, 60],
    ],
    LEFT: [
      [128, 660, 60, 52],
      [196, 660, 60, 52],
    ],
    RIGHT: [
      [392, 660, 60, 52],
      [460, 660, 60, 52],
    ],
  },
  'tank.player.secondary.d': {
    UP: [
      [4, 724, 56, 60],
      [68, 724, 56, 60],
    ],
    DOWN: [
      [264, 724, 56, 60],
      [328, 724, 56, 60],
    ],
    LEFT: [
      [128, 728, 60, 56],
      [196, 728, 60, 56],
    ],
    RIGHT: [
      [392, 728, 60, 56],
      [460, 728, 60, 56],
    ],
  },
  'powerup.helmet': [[1052, 448, 64, 60]],
  'powerup.clock': [[1116, 448, 64, 60]],
  'powerup.shovel': [[1180, 448, 64, 60]],
  'powerup.star': [[1244, 448, 64, 60]],
  'powerup.grenade': [[1308, 448, 64, 60]],
  'powerup.tank': [[1372, 448, 64, 60]],
  'powerup.gun': [[1436, 448, 64, 60]],
  'points.100': [[1180, 640, 64, 64]],
  'points.200': [[1244, 640, 64, 64]],
  'points.300': [[1308, 640, 64, 64]],
  'points.400': [[1372, 640, 64, 64]],
  'points.500': [[1436, 640, 64, 64]],
  'ui.enemy': [[1308, 768, 32, 32]],
  'ui.player': [[1536, 576, 28, 32]],
  'ui.pause': [[1184, 704, 156, 28]],
  'ui.gameOver': [[1184, 736, 124, 60]],
};

/** Координаты сущностей на sprite-изображении */
export let spriteCoordinates = classicDesignSprite;

if (localStorage.getItem(gameDesignInLS) === DesignName.Modern) {
  spriteCoordinates = modernDesignSprite;
}

export function toggleSpriteCoordinates(designName: DesignName) {
  spriteCoordinates = designName === DesignName.Classic ? classicDesignSprite : modernDesignSprite;
}
