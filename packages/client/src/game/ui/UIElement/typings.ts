import { type Pos, type Size } from '../../entities/Entity/typings';
import { type Color } from '../../services/View/data/colors';
import { type SpriteCoordinatesNoAnimations } from '../../services/View/typings';

export type UIElementSettings = Pos &
  Size &
  Partial<{
    text: string;
    align: CanvasTextAlign;
    color: Color | string;
    backImg: HTMLImageElement | HTMLCanvasElement;
    mainSpriteCoordinates: SpriteCoordinatesNoAnimations;
    indicatorName?: string;
  }>;
