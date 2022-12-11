import { assetDataList, errorMsg, timeoutMsg } from './data';
import { resources } from './Resources';

describe('game/services/Resources', () => {
  /** Jest не умеет обрабатывать события загрузки файлов. Приходится мокать таким образом. */

  // @ts-expect-error: mock doesn't have all parameters of HTMLImageElement
  global.Image = class {
    constructor() {
      setTimeout(() => {
        // @ts-expect-error: property 'onload' does not exist on type 'Image'.
        this.onload(); // simulate success
      }, 100);
    }
  };
  // @ts-expect-error: mock doesn't have all parameters of HTMLAudioElement
  global.Audio = class {
    constructor() {
      setTimeout(() => {
        // @ts-expect-error: property 'oncanplaythrough' does not exist on type 'Audio'.
        this.oncanplaythrough(); // simulate success
      }, 100);
    }
  };

  /** Jest не умеет обрабатывать alert. Его тоже приходится мокать. */
  global.alert = jest.fn();

  it('should return true with correct data', async () => {
    const isResourcesLoaded = await resources.loadAll(assetDataList);

    expect(isResourcesLoaded).toBeTruthy();
  });

  it('should return false on loading error', async () => {
    /** Jest не умеет обрабатывать события загрузки файлов. Приходится мокать таким образом. */
    //@ts-expect-error: mock doesn't have all parameters of HTMLImageElement
    global.Image = class {
      constructor() {
        setTimeout(() => {
          // @ts-expect-error: property 'onload' does not exist on type 'Image'.
          this.onerror(); // simulate error
        }, 100);
      }
    };

    const isResourcesLoaded = await resources.loadAll();

    expect(global.alert).toBeCalledWith(errorMsg);
    expect(isResourcesLoaded).toBeFalsy();
  });

  it('should show alert about timeout', async () => {
    const isResourcesLoaded = await resources.loadAll(assetDataList, 50);

    expect(global.alert).toBeCalledWith(timeoutMsg);
    expect(isResourcesLoaded).toBeFalsy();
  });
});
