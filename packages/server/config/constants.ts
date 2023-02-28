export const YANDEX_API_HOST = 'https://ya-praktikum.tech/api/v2';

export const GITHUB_API_HOST = 'https://api.github.com';

export const GITHUB_AVATARS_API_HOST = 'https://avatars.githubusercontent.com';

export const API_HOST = process.env.API_HOST || 'http://localhost:5000';

/** Хосты, с которых можно ходить на API Яндекса */

export const NONCE = '%nonce%';
export const TLD = '%tld%';
export const allowedHosts = ['localhost', '127.0.0.1', new URL(API_HOST).hostname];
