import {OutputVideoType} from "../types/videos";
import {ViewVideoModel} from "../features/videos/models/ViewVideoModel";

export const getViewVideoModel = (dbVideo: OutputVideoType): ViewVideoModel =>  {
  return {
    id: dbVideo.id,
    title: dbVideo.title,
    author: dbVideo.author,
    createdAt: dbVideo.createdAt,
    canBeDownloaded: dbVideo.canBeDownloaded,
    minAgeRestriction: dbVideo.minAgeRestriction,
    publicationDate: dbVideo.publicationDate,
    availableResolutions: dbVideo.availableResolutions,
  }
}

