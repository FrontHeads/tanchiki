import { assetsData, errorMsg, imagesData, soundsData, timeoutMsg } from './data';
import { AssetData, AssetsDataList, ImagesList, Resource, SoundsList } from './typings';

/** Загружает и хранит изображения и звуки. */
export class Resources {
  private imagesList: ImagesList = {};
  private soundsList: SoundsList = {};

  /** Загружает все изображения и звуки из AssetsDataList */
  loadAll(assetsDataList: AssetsDataList = assetsData, timeout = 60000): Promise<boolean> {
    const loadAllTimeout = setTimeout(() => {
      alert(timeoutMsg);
    }, timeout);

    return Promise.all(Object.entries(assetsDataList).map(assetData => this.load(assetData)))
      .then(() => true)
      .catch(() => {
        alert(errorMsg);
        return false;
      })
      .finally(() => clearTimeout(loadAllTimeout));
  }

  /** Проигрывает конкретный HTMLAudioElement из Resources.soundsList. */
  playSound(sound: keyof typeof soundsData): void {
    if (this.soundsList[sound]) {
      this.soundsList[sound].currentTime = 0;
      this.soundsList[sound].play();
    }
  }

  /** Возвращает конкретный HTMLImageElement из Resources.imagesList. */
  getImage(image: keyof typeof imagesData): HTMLImageElement | false {
    if (this.imagesList[image]) {
      return this.imagesList[image];
    }

    return false;
  }

  /** Загружает конкретный ресурс и кладет в объект (imagesList | soundsList) внутри Resources*/
  private load(assetData: [string, AssetData]) {
    const [assetName, asset] = assetData;

    return new Promise((resolve, reject) => {
      let resource: Resource;

      if (asset.type === 'image') {
        resource = new Image();
        this.imagesList[assetName] = resource;
        resource.onload = () => {
          resolve(resource);
        };
      } else if (asset.type === 'sound') {
        resource = new Audio();
        this.soundsList[assetName] = resource;
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
