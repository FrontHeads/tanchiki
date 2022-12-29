import { renderToPipeableStream, RenderToPipeableStreamOptions } from 'react-dom/server';

import { App } from './src/App';

export function render(streamOptions: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(<App isSsr={true} />, streamOptions);
}
