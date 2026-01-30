import { body, param } from 'express-validator';
import { inputValidationMiddleware } from '../../../middlewares/input-validation-middleware';
import {VIDEOS_ERROR_MESSAGES} from "../constants/error-messages";
import {Resolutions} from "../../../types/videos";
import {VIDEO_VALIDATION_LIMITS} from "../constants/validation";

const idValidator = param('id')
  .isInt().withMessage(VIDEOS_ERROR_MESSAGES.ID_MUST_BE_INT);

export const createVideoValidation = [
  body('title')
    .isString().withMessage(VIDEOS_ERROR_MESSAGES.TITLE_REQUIRED) // 1. Сначала проверяем тип
    .bail()
    .trim()
    .notEmpty().withMessage(VIDEOS_ERROR_MESSAGES.TITLE_REQUIRED) // 2. Проверяем, не стала ли строка пустой после trim
    .isLength({ max: VIDEO_VALIDATION_LIMITS.TITLE_MAX_LENGTH }).withMessage(VIDEOS_ERROR_MESSAGES.TITLE_LENGTH),

  body('author')
    .isString().withMessage(VIDEOS_ERROR_MESSAGES.AUTHOR_REQUIRED) // Сначала тип!
    .bail()
    .trim()
    .notEmpty().withMessage(VIDEOS_ERROR_MESSAGES.AUTHOR_REQUIRED)
    .isLength({ max: VIDEO_VALIDATION_LIMITS.AUTHOR_MAX_LENGTH }).withMessage(VIDEOS_ERROR_MESSAGES.AUTHOR_LENGTH),

  body('availableResolutions')
    .exists().withMessage(VIDEOS_ERROR_MESSAGES.RESOLUTIONS_REQUIRED)
    .isArray({ min: 1 }).withMessage(VIDEOS_ERROR_MESSAGES.RESOLUTIONS_REQUIRED)
    .custom((values: any[]) => {
      const isValid = values.every(v => Object.values(Resolutions).includes(v));
      if (!isValid) throw new Error(VIDEOS_ERROR_MESSAGES.RESOLUTIONS_INVALID);
      return true;
    }),
];

export const updateVideoValidation = [
  ...createVideoValidation,

  body('canBeDownloaded')
    .exists().withMessage(VIDEOS_ERROR_MESSAGES.CAN_BE_DOWNLOADED_TYPE)
    .isBoolean().withMessage(VIDEOS_ERROR_MESSAGES.CAN_BE_DOWNLOADED_TYPE),

  body('minAgeRestriction')
    .exists().withMessage(VIDEOS_ERROR_MESSAGES.AGE_RESTRICTION)
    .optional({ nullable: true })
    .isInt({
      min: VIDEO_VALIDATION_LIMITS.MIN_AGE_RESTRICTION,
      max: VIDEO_VALIDATION_LIMITS.MAX_AGE_RESTRICTION
    })
    .withMessage(VIDEOS_ERROR_MESSAGES.AGE_RESTRICTION),

  body('publicationDate')
    .exists().withMessage(VIDEOS_ERROR_MESSAGES.PUBLICATION_DATE_TYPE)
    .isISO8601().withMessage(VIDEOS_ERROR_MESSAGES.PUBLICATION_DATE_TYPE),
];


// --- Middlewares ---
// POST
export const createVideoValidationMiddleware = [
    ...createVideoValidation, // Разворачиваем цепочку body()
  inputValidationMiddleware
];

//  PUT
export const updateVideoValidationMiddleware = [
  idValidator,
  ...updateVideoValidation,
  inputValidationMiddleware
];

// Используем при GET/:id,  DELETE/:id PUT/:id
export const videoIdValidationMiddleware = [
  idValidator,
  inputValidationMiddleware
];
