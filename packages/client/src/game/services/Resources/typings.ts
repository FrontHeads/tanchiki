export type AssetDataList = Record<string, AssetData>;
export type AssetData = { type: string; path: string };

export type ImageList = Record<string, HTMLImageElement>;
export type SoundList = Record<string, HTMLAudioElement>;

export type Resource = HTMLImageElement | HTMLAudioElement | undefined;
