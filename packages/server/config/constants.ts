export const YANDEX_API_HOST = 'https://ya-praktikum.tech/api/v2';

export const API_HOST = process.env.API_HOST || 'http://localhost:5000';

/** Хосты, с которых можно ходить на API Яндекса */
export const allowedHosts = ['localhost', '127.0.0.1', new URL(API_HOST).hostname];
