import type { CSPDirectives } from 'csp-header';
import { INLINE, NONCE, SELF } from 'express-csp-header';

import { GITHUB_API_HOST, GITHUB_AVATARS_API_HOST, YANDEX_API_HOST } from './constants';

const directives: Partial<CSPDirectives> = {
  'default-src': [SELF],
  'connect-src': [SELF, YANDEX_API_HOST, GITHUB_API_HOST],
  'script-src': [SELF],
  'style-src': [SELF, INLINE, 'fonts.googleapis.com'],
  'font-src': [SELF, 'fonts.gstatic.com'],
  'img-src': [SELF, YANDEX_API_HOST, GITHUB_AVATARS_API_HOST],
  'media-src': [SELF],
  'worker-src': [SELF],
  'block-all-mixed-content': true,
};

export const getCspDirectives = () => {
  if (process.env.NODE_ENV === 'development') {
    directives['connect-src']?.push('ws:');
    directives['script-src']?.push(INLINE);
  } else directives['script-src']?.push(NONCE);

  return directives;
};
