import { EventEmitter } from '../../utils';
import { type Game } from '../';
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
  audioCtx: AudioContext;

  constructor(private game: Game) {
    super();
    const audioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new audioContext();
  }

  /** Загружает все изображения и звуки из AssetsDataList */
  load(assets: AssetPathList = assetPathList, timeout = this.game.state.loadResourcesTimeout): Promise<boolean> {
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

  getSound(sound: keyof typeof SoundPathList): AudioBuffer {
    return this.soundList[sound];
  }

  /** Загружает конкретный ресурс и кладет в объект (imageList | soundList) внутри Resources*/
  private loadResource(asset: [string, string]): Promise<Resource> {
    const [assetName, assetPath] = asset;
    const assetType = this.getAssetType(assetPath);

    if (assetType === 'image') {
      return this.loadImgResource(assetName, assetPath);
    } else if (assetType === 'sound') {
      return this.loadSoundResource(assetName, assetPath);
    } else {
      return Promise.reject(new Error('Unknown asset type'));
    }
  }

  private loadImgResource(assetName: string, assetPath: string): Promise<Resource> {
    return new Promise((resolve, reject) => {
      const resource: Resource = new Image();

      resource.onload = () => {
        this.imageList[assetName] = resource;
        resolve(resource);
      };

      resource.onerror = () => {
        reject(new Error('Error loading image file'));
      };
      resource.src = assetPath;
    });
  }

  loadSoundResource(assetName: string, assetPath: string): Promise<Resource> {
    return new Promise((resolve, reject) => {
      fetch(assetPath)
        .then(async response => this.audioCtx?.decodeAudioData(await response.arrayBuffer()))
        .then(audioResource => {
          this.soundList[assetName] = audioResource;
          resolve(audioResource);
        })
        .catch(() => {
          reject(new Error('Error loading audio file'));
        });
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
