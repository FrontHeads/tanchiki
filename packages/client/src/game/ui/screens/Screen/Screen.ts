import { type Overlay } from '../..';

export abstract class Screen<T = unknown> {
  constructor(protected overlay: Overlay) {}

  public abstract show(state?: T): void;
}
