import { config } from 'dotenv';
config(); // добавление переменных из файла .env в process.env

export const APP_CONFIG = {
  PORT: process.env.PORT || 3003,
  PATH: {
    ROOT: '/',
    VIDEOS: {
      BASE: '/videos',
      BY_ID: '/:id',
    },
    TEST: {
      BASE:  '/testing',
      DB:  '/all-data'
    }
  },
};
