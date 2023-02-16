import { type Pos, type Size } from '../../entities/Entity/typings';
import { type Color } from '../../services/View/colors';
import { type SpriteCoordinatesNoAnimations } from '../../services/View/typings';

export type UIElementSettings = Pos &
  Size &
  Partial<{
    text: string;
    align: CanvasTextAlign;
    color: Color | string;
    backImg: HTMLImageElement | HTMLCanvasElement;
    backColor: Color | string;
    mainSpriteCoordinates: SpriteCoordinatesNoAnimations;
    indicatorName?: string;
  }>;
