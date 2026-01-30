import { Resolutions } from "../../../types/videos";

export type UpdateVideoInputModel = {
  /**
   * title: string
   * maxLength: 40
   * required: true
   */
  title: string;

  /**
   * author: string
   * maxLength: 20
   * required: true
   */
  author: string;

  /**
   * availableResolutions: array of Resolutions
   * minItems: 1
   * required: true
   */
  availableResolutions: Resolutions[];

  /**
   * canBeDownloaded: boolean
   * required: true
   */
  canBeDownloaded: boolean;

  /**
   * minAgeRestriction: integer
   * minimum: 1
   * maximum: 18
   * nullable: true
   * required: false (но в теле запроса обычно ожидается)
   */
  minAgeRestriction: number | null;

  /**
   * publicationDate: string (date-time)
   * format: ISO 8601
   * required: true
   */
  publicationDate: string;
};
