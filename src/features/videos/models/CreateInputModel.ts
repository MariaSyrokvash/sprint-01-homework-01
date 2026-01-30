import { Resolutions } from "../../../types/videos";

export type CreateInputModel = {
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
};
