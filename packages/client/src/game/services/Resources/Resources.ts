import { getAssetType } from '../../utils/';
import { assetDataList, errorMsg, ImageDataList, SoundDataList, timeoutMsg } from './data';
import { AssetDataList, ImageList, Resource, SoundList } from './typings';

/** Загружает и хранит изображения и звуки. */
export class Resources {
  private imageList: ImageList = {};
  private soundList: SoundList = {};

  /** Загружает все изображения и звуки из AssetsDataList */
  loadAll(assets: AssetDataList = assetDataList, timeout = 60000): Promise<boolean> {
    const loadAllTimeout = setTimeout(() => {
      alert(timeoutMsg);
    }, timeout);

    return Promise.all(Object.entries(assets).map(assetData => this.load(assetData)))
      .then(() => true)
      .catch(() => {
        alert(errorMsg);
        return false;
      })
      .finally(() => clearTimeout(loadAllTimeout));
  }

  /** Проигрывает конкретный HTMLAudioElement из Resources.soundList. */
  playSound(sound: keyof typeof SoundDataList): void {
    if (this.soundList[sound]) {
      this.soundList[sound].currentTime = 0;
      this.soundList[sound].play();
    }
  }

  /** Возвращает конкретный HTMLImageElement из Resources.imageList. */
  getImage(image: keyof typeof ImageDataList): HTMLImageElement {
    return this.imageList[image];
  }

  /** Загружает конкретный ресурс и кладет в объект (imageList | soundList) внутри Resources*/
  private load(assetData: [string, string]): Promise<Resource> {
    const [assetName, assetPath] = assetData;

    return new Promise((resolve, reject) => {
      let resource: Resource;
      const assetType = getAssetType(assetPath);

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
}

/** Синглтон-экземпляр класса Resources. Загружает и хранит изображения и звуки. */
export const resources = new Resources();
