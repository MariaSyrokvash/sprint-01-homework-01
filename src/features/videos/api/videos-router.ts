import { Response, Router } from 'express';
import { db } from '../../../db';
import { APP_CONFIG } from '../../../config';
import { HttpStatus } from '../../../constants/statuses';
import { ViewVideoModel } from '../models/ViewVideoModel';
import { CreateInputModel } from '../models/CreateInputModel';
import { URIParamsVideoModel } from '../models/URIParamsVideoModel';
import {
  TypedRequest,
  TypedRequestBody,
  TypedRequestParams,
  TypedRequestParamsBody,
} from '../../../types';
import {getViewVideoModel} from "../../../utils/view-model-mappers";
import {
  videoIdValidationMiddleware,
  createVideoValidationMiddleware,
  updateVideoValidationMiddleware
} from "../middlewares/videos-validators";
import {OutputVideoType} from "../../../types/videos";
import {TIME_LIMITS} from "../constants/validation";
import {UpdateVideoInputModel} from "../models/UpdateInputModel";

export const videosRouter = Router();

const findVideoById = (id: string) => db.videos.find((c) => c.id === +id);

// --- GET ALL ---
videosRouter.get(APP_CONFIG.PATH.ROOT, (
  _: TypedRequest,
  res: Response<ViewVideoModel[]>
) => {
  const videos = db.videos
  const mappedVideos: ViewVideoModel[] = videos.map(getViewVideoModel);
  res.status(HttpStatus.Ok_200).send(mappedVideos);
});

// --- GET BY ID ---
videosRouter.get(APP_CONFIG.PATH.VIDEOS.BY_ID,
  videoIdValidationMiddleware,
  (req: TypedRequestParams<URIParamsVideoModel>, res: Response<ViewVideoModel>) => {
  const foundVideo = findVideoById(req.params.id);

  if (!foundVideo) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }
  const mappedVideo = getViewVideoModel(foundVideo);
  res.status(HttpStatus.Ok_200).json(mappedVideo);
});

// --- CREATE ---
videosRouter.post(APP_CONFIG.PATH.ROOT, ...createVideoValidationMiddleware, (
  req: TypedRequestBody<CreateInputModel>,
  res: Response<ViewVideoModel>
) => {
  const { title, author, availableResolutions } = req.body;

  const createdAt = new Date();
  const publicationDate = new Date(createdAt.getTime() + TIME_LIMITS.MILLISECONDS_IN_DAY);

  const newVideo: OutputVideoType = {
    id: Date.now(),
    title,
    author,
    availableResolutions,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate.toISOString(),
  };

  db.videos.push(newVideo);
  res.status(HttpStatus.Created_201).json(getViewVideoModel(newVideo));
});


// --- UPDATE ---
videosRouter.put(APP_CONFIG.PATH.VIDEOS.BY_ID, updateVideoValidationMiddleware, (
  req: TypedRequestParamsBody<URIParamsVideoModel, UpdateVideoInputModel>,
  res: Response<ViewVideoModel>
) => {
  const id = +req.params.id;

  const videoExists = db.videos.some(v => v.id === id);

  if (!videoExists) {
    res.status(HttpStatus.NotFound_404).send();
    return;
  }

  db.videos = db.videos.map(v =>
    v.id === id
      ? {
        ...v,
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions,
        canBeDownloaded: req.body.canBeDownloaded,
        minAgeRestriction: req.body.minAgeRestriction ?? null,
        publicationDate: req.body.publicationDate
      }
      : v
  );

  res.sendStatus(HttpStatus.NoContent_204);
});

// --- DELETE ---
videosRouter.delete(APP_CONFIG.PATH.VIDEOS.BY_ID, ...videoIdValidationMiddleware, (
  req: TypedRequestParams<URIParamsVideoModel>,
  res: Response
) => {
  const id = +req.params.id;

  const videoExists = db.videos.some(v => v.id === id);
  if (!videoExists) {
    res.status(HttpStatus.NotFound_404).send();
    return;
  }

  db.videos = db.videos.filter(v => v.id !== id);
  res.sendStatus(HttpStatus.NoContent_204);
});
