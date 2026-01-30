import { Resolutions } from "../../src/types/videos";
import {ViewVideoModel} from "../../src/features/videos/models/ViewVideoModel";
import {CreateInputModel} from "../../src/features/videos/models/CreateInputModel";
import {HttpStatus} from "../../src/constants/statuses";
import request from "supertest";
import {app} from "../../src/app";
import {APP_CONFIG} from "../../src/config";

export const testManager = {
  async createVideo(
    data: Partial<CreateInputModel> = {}
  ) {
    const defaultData: CreateInputModel = {
      title: 'default title',
      author: 'default author',
      availableResolutions: [Resolutions.P144],
      ...data
    };

    const response = await request(app)
      .post(APP_CONFIG.PATH.VIDEOS.BASE)
      .send(defaultData);

    return {
      response,
      createdEntity: response.body as ViewVideoModel
    };
  }
};
