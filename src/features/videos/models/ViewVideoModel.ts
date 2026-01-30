import {Resolutions} from "../../../types/videos";

export type ViewVideoModel = {
  id: number
  title: string
  author: string
  canBeDownloaded: boolean
  minAgeRestriction: null | number
  createdAt: string
  publicationDate: string
  availableResolutions: Resolutions[] | null
};
