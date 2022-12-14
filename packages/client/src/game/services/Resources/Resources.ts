import { assetPathList, errorMsg, extensionList, ImagePathList, timeoutMsg } from './data';
import { AssetPathList, ImageList, Resource, SoundList } from './typings';

/** Загружает и хранит изображения и звуки. */
class Resources {
  private imageList: ImageList = {};
  public soundList: SoundList = {};

  /** Загружает все изображения и звуки из AssetsDataList */
  loadAll(assets: AssetPathList = assetPathList, timeout = 60000): Promise<boolean> {
    const loadAllTimeout = setTimeout(() => {
      alert(timeoutMsg);
    }, timeout);

    return Promise.all(Object.entries(assets).map(asset => this.load(asset)))
      .then(() => true)
      .catch(() => {
        alert(errorMsg);
        return false;
      })
      .finally(() => clearTimeout(loadAllTimeout));
  }

  /** Возвращает конкретный HTMLImageElement из Resources.imageList. */
  getImage(image: keyof typeof ImagePathList): HTMLImageElement {
    return this.imageList[image];
  }

  /** Загружает конкретный ресурс и кладет в объект (imageList | soundList) внутри Resources*/
  private load(asset: [string, string]): Promise<Resource> {
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

/** Синглтон-экземпляр класса Resources. Загружает и хранит изображения и звуки. */
export const resources = new Resources();
