import { assetDataList, errorMsg, imageDataList, soundDataList, timeoutMsg } from './data';
import { AssetData, AssetDataList, ImageList, Resource, SoundList } from './typings';

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
  playSound(sound: keyof typeof soundDataList): void {
    if (this.soundList[sound]) {
      this.soundList[sound].currentTime = 0;
      this.soundList[sound].play();
    }
  }

  /** Возвращает конкретный HTMLImageElement из Resources.imageList. */
  getImage(image: keyof typeof imageDataList): HTMLImageElement | false {
    if (this.imageList[image]) {
      return this.imageList[image];
    }

    return false;
  }

  /** Загружает конкретный ресурс и кладет в объект (imageList | soundList) внутри Resources*/
  private load(assetData: [string, AssetData]): Promise<Resource> {
    const [assetName, asset] = assetData;

    return new Promise((resolve, reject) => {
      let resource: Resource;

      if (asset.type === 'image') {
        resource = new Image();
        this.imageList[assetName] = resource;
        resource.onload = () => {
          resolve(resource);
        };
      } else if (asset.type === 'sound') {
        resource = new Audio();
        this.soundList[assetName] = resource;
        resource.oncanplaythrough = () => {
          resolve(resource);
        };
      }

      if (resource) {
        resource.onerror = reject;
        resource.src = asset.path;
      }
    });
  }
}

/** Синглтон-экземпляр класса Resources. Загружает и хранит изображения и звуки. */
export const resources = new Resources();
