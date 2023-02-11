import { EventEmitter } from '../../utils';
import {
  type ImagePathList,
  type SoundPathList,
  assetPathList,
  errorMsg,
  extensionList,
  ResourcesEvent,
  timeoutMsg,
} from './data';
import { type AssetPathList, type ImageList, type Resource, type SoundList } from './typings';

export { ResourcesEvent };

/** Загружает и хранит изображения и звуки. */
export class Resources extends EventEmitter<ResourcesEvent> {
  private imageList: ImageList = {};
  private soundList: SoundList = {};

  /** Загружает все изображения и звуки из AssetsDataList */
  load(assets: AssetPathList = assetPathList, timeout = 60000): Promise<boolean> {
    const loadAllTimeout = setTimeout(() => {
      alert(timeoutMsg);
    }, timeout);

    return Promise.all(Object.entries(assets).map(asset => this.loadResource(asset)))
      .then(() => {
        this.emit(ResourcesEvent.Loaded);
        return true;
      })
      .catch(() => {
        this.emit(ResourcesEvent.Error);
        alert(errorMsg);
        return false;
      })
      .finally(() => clearTimeout(loadAllTimeout));
  }

  /** Возвращает конкретный HTMLImageElement из Resources.imageList. */
  getImage(image: keyof typeof ImagePathList): HTMLImageElement {
    return this.imageList[image];
  }

  getSound(sound: keyof typeof SoundPathList): HTMLAudioElement {
    return this.soundList[sound];
  }

  /** Загружает конкретный ресурс и кладет в объект (imageList | soundList) внутри Resources*/
  private loadResource(asset: [string, string]): Promise<Resource> {
    const [assetName, assetPath] = asset;

    return new Promise((resolve, reject) => {
      let resource: Resource;
      const assetType = this.getAssetType(assetPath);

      if (assetType === 'image') {
        resource = new Image();
        this.imageList[assetName] = resource;
        resource.onload = () => {
          resolve(resource);
        };
      } else if (assetType === 'sound') {
        resource = new Audio();
        this.soundList[assetName] = resource;
        resource.oncanplaythrough = () => {
          resolve(resource);
        };
      } else {
        reject();
      }

      if (resource) {
        resource.onerror = reject;
        resource.src = assetPath;
      }
    });
  }

  /** Возвращает тип ресурса (картинка или звук) исходя из расширения файла. */
  private getAssetType(filePath: string): 'image' | 'sound' | 'unknown' {
    const fileExtension = filePath.split('.').pop() ?? 'unknown';

    if (extensionList.images.includes(fileExtension)) {
      return 'image';
    } else if (extensionList.sounds.includes(fileExtension)) {
      return 'sound';
    }

    return 'unknown';
  }
}
