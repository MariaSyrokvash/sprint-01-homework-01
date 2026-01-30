import {VIDEO_VALIDATION_LIMITS} from "./validation";

export const VIDEOS_ERROR_MESSAGES = {
  TITLE_REQUIRED: 'Title is required and should be string',
  TITLE_LENGTH: `Title length should be max ${VIDEO_VALIDATION_LIMITS.TITLE_MAX_LENGTH} symbols`,
  AUTHOR_REQUIRED: 'Author is required and should be string',
  AUTHOR_LENGTH: `Author length should be max ${VIDEO_VALIDATION_LIMITS.AUTHOR_MAX_LENGTH} symbols`,
  RESOLUTIONS_REQUIRED: 'At least one resolution should be added',
  RESOLUTIONS_INVALID: 'Invalid resolution value',
  ID_MUST_BE_INT: 'ID must be an integer number',
  AGE_RESTRICTION: `Age should be from ${VIDEO_VALIDATION_LIMITS.MIN_AGE_RESTRICTION} to ${VIDEO_VALIDATION_LIMITS.MAX_AGE_RESTRICTION} `,
  CAN_BE_DOWNLOADED_TYPE: 'Should be boolean value',
  PUBLICATION_DATE_TYPE: 'Should be ISO string date'
} as const;
