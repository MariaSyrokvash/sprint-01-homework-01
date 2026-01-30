import express from 'express';
import { APP_CONFIG } from './config';
import { testRouter } from './features/test/test-router';
import {videosRouter} from "./features/videos/api/videos-router";


const app = express();

app.use(express.json()); // Чтобы Express понимал JSON в теле запроса

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(APP_CONFIG.PATH.VIDEOS.BASE, videosRouter)

app.use(APP_CONFIG.PATH.TEST.BASE, testRouter)

export { app };
