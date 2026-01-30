import { Response, Router } from 'express';
import { APP_CONFIG } from '../../config';
import { db } from '../../db';
import { HttpStatus } from '../../constants/statuses';

export const testRouter = Router()

testRouter.delete(APP_CONFIG.PATH.TEST.DB, (req, res: Response) => {
  db.videos = [];
  res.sendStatus(HttpStatus.NoContent_204);
});
