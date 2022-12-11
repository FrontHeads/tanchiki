export type AssetsDataList = Record<string, AssetData>;
export type AssetData = { type: string; path: string };

export type ImagesList = Record<string, HTMLImageElement>;
export type SoundsList = Record<string, HTMLAudioElement>;

export type Resource = HTMLImageElement | HTMLAudioElement | undefined;
