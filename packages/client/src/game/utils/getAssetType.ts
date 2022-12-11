const imageExtensions = ['png', 'svg', 'jpg', 'jpeg', 'gif'];
const soundExtensions = ['mp3'];

/** Возвращает тип ресурса (картинка или звук) исходя из расширения файла. */
export function getAssetType(filePath: string): 'image' | 'sound' | 'unknown' {
  const extension = filePath.split('.').pop() ?? 'unknown';

  if (imageExtensions.includes(extension)) {
    return 'image';
  } else if (soundExtensions.includes(extension)) {
    return 'sound';
  }

  return 'unknown';
}
