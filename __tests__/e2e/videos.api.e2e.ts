import request from 'supertest';
import { APP_CONFIG } from '../../src/config';
import { app } from '../../src/app';
import { HttpStatus } from '../../src/constants/statuses';
import { testManager } from '../utils/testManager';
import {CreateInputModel} from "../../src/features/videos/models/CreateInputModel";
import {VIDEOS_ERROR_MESSAGES} from "../../src/features/videos/constants/error-messages";
import {UpdateVideoInputModel} from "../../src/features/videos/models/UpdateInputModel";
import {Resolutions} from "../../src/types/videos";
import {VIDEO_VALIDATION_LIMITS} from "../../src/features/videos/constants/validation";

describe('Testing videos-API', () => {
  beforeEach(async () => {
    await request(app).delete(APP_CONFIG.PATH.TEST.BASE + APP_CONFIG.PATH.TEST.DB);
  });

  // ===========================================================================
  // ГРУППА: GET (ПОЛУЧЕНИЕ ДАННЫХ)
  // ===========================================================================
  describe('GET Requests', () => {
    it('returns an array of videos (empty)', async () => {
      await request(app)
        .get(APP_CONFIG.PATH.VIDEOS.BASE)
        .expect(HttpStatus.Ok_200, []);
    });

    it('should return video by id', async () => {
      const { createdEntity } = await testManager.createVideo({ title: 'Target Video' });

      const res = await request(app)
        .get(`${APP_CONFIG.PATH.VIDEOS.BASE}/${createdEntity.id}`)
        .expect(HttpStatus.Ok_200);

      expect(res.body).toEqual({
        id: createdEntity.id,
        title: 'Target Video',
        author: expect.any(String),
        availableResolutions: expect.any(Array),
        canBeDownloaded: expect.any(Boolean),
        minAgeRestriction: null,
        createdAt: expect.any(String),
        publicationDate: expect.any(String),
      });
    });

    it('should return 404 for not existing video', async () => {
      await request(app)
        .get(`${APP_CONFIG.PATH.VIDEOS.BASE}/999999`)
        .expect(HttpStatus.NotFound_404);
    });

    it('should return 400 if ID is not a number', async () => {
      const res = await request(app)
        .get(`${APP_CONFIG.PATH.VIDEOS.BASE}/abc`)
        .expect(HttpStatus.BadRequest_400);

      // check inputValidationMiddleware
      expect(res.body.errorsMessages[0].field).toBe('id');
      expect(res.body.errorsMessages[0].message).toBe(VIDEOS_ERROR_MESSAGES.ID_MUST_BE_INT);
    });
  });

  // ===========================================================================
  // ГРУППА: POST (СОЗДАНИЕ И ВАЛИДАЦИЯ)
  // ===========================================================================
  describe('POST Requests & Validation', () => {
    it('should create video with correct input data', async () => {
      const newVideoData: CreateInputModel = {
        title: 'it-incubator video',
        author: 'it-specialist',
        availableResolutions: [Resolutions.P144]
      };

      const { createdEntity } = await testManager.createVideo(newVideoData);

      const response = await request(app)
        .get(APP_CONFIG.PATH.VIDEOS.BASE)
        .expect(HttpStatus.Ok_200);

      expect(response.body).toContainEqual(createdEntity);
      expect(response.body.length).toBe(1);
    });

    it('should not create video with incorrect input data (empty title/author/availableResolutions)', async () => {
      const invalidData = {
        title: '',
        author: '',
        availableResolutions: []
      };
      const res = await request(app)
        .post(APP_CONFIG.PATH.VIDEOS.BASE)
        .send(invalidData)
        .expect(HttpStatus.BadRequest_400);

      expect(res.body.errorsMessages.length).toBeGreaterThanOrEqual(3);
      const fieldsWithError = res.body.errorsMessages.map((e: any) => e.field);
      expect(fieldsWithError).toContain('title');
      expect(fieldsWithError).toContain('author');
      expect(fieldsWithError).toContain('availableResolutions');

      const result = await request(app).get(APP_CONFIG.PATH.VIDEOS.BASE).expect(HttpStatus.Ok_200);
      expect(result.body).toEqual([]);
    });

    it('should return error message when title is too long', async () => {
      const res = await request(app)
        .post(APP_CONFIG.PATH.VIDEOS.BASE)
        .send({
          title: 'a'.repeat(VIDEO_VALIDATION_LIMITS.TITLE_MAX_LENGTH + 1),
          author: 'valid author',
          availableResolutions: [Resolutions.P144]
        })
        .expect(HttpStatus.BadRequest_400);

      expect(res.body).toEqual({
        errorsMessages: [{ message: expect.any(String), field: 'title' }]
      });
    });

    it('should return 400 and error message if title is NOT a string', async () => {
      const res = await request(app)
        .post(APP_CONFIG.PATH.VIDEOS.BASE)
        .send({
          title: 12345, // Число вместо строки
          author: 'valid author',
          availableResolutions: [Resolutions.P144]
        })
        .expect(HttpStatus.BadRequest_400);

      // Если тест упадет, в консоли будет видно, что именно пришло в errorsMessages
      const titleError = res.body.errorsMessages.find((e: any) => e.field === 'title');

      expect(titleError).toBeDefined();
      expect(titleError?.field).toBe('title');
    });

    it('should trim the title before saving', async () => {
      const res = await request(app)
        .post(APP_CONFIG.PATH.VIDEOS.BASE)
        .send({
          title: '   New Video   ',
          author: 'valid author',
          availableResolutions: [Resolutions.P144]
        })
        .expect(HttpStatus.Created_201);

      expect(res.body.title).toBe('New Video');
    });
  });

  // ===========================================================================
  // ГРУППА: PUT (ОБНОВЛЕНИЕ)
  // ===========================================================================
  describe('PUT Requests', () => {
    it('should update video with correct input data', async () => {
      const { createdEntity } = await testManager.createVideo({ title: 'DevOps video' });
      const updatedData: UpdateVideoInputModel = {
        title: 'good new Title',
        author: 'updated author',
        availableResolutions: [Resolutions.P2160],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: new Date().toISOString()
      };

      await request(app)
        .put(`${APP_CONFIG.PATH.VIDEOS.BASE}/${createdEntity.id}`)
        .send(updatedData)
        .expect(HttpStatus.NoContent_204);

      const result = await request(app).get(`${APP_CONFIG.PATH.VIDEOS.BASE}/${createdEntity.id}`);

      // Проверяем каждое поле, которое мы отправляли на обновление
      expect(result.body.title).toBe(updatedData.title);
      expect(result.body.author).toBe(updatedData.author);
      expect(result.body.availableResolutions).toEqual(updatedData.availableResolutions);
      expect(result.body.canBeDownloaded).toBe(updatedData.canBeDownloaded);
      expect(result.body.minAgeRestriction).toBe(updatedData.minAgeRestriction);
      expect(result.body.publicationDate).toBe(updatedData.publicationDate);
    });

    it("shouldn't update video with incorrect input data", async () => {
      const { createdEntity } = await testManager.createVideo({ title: 'DevOps video' });

      const invalidData = {
        title: '',
        author: 'valid author',
        availableResolutions: [Resolutions.P144],
        canBeDownloaded: true,
        publicationDate: new Date().toISOString()
      }

      const res = await request(app)
        .put(`${APP_CONFIG.PATH.VIDEOS.BASE}/${createdEntity.id}`)
        .send(invalidData)
        .expect(HttpStatus.BadRequest_400);

      // Проверяем, что в ошибках пришло именно поле title
      expect(res.body.errorsMessages[0].field).toBe('title');

      // Проверяем, что в базе НИЧЕГО не изменилось
      const getRes = await request(app)
        .get(`${APP_CONFIG.PATH.VIDEOS.BASE}/${createdEntity.id}`)
        .expect(HttpStatus.Ok_200);

      // Сравниваем с тем, что было создано изначально
      expect(getRes.body).toEqual(createdEntity);
    });

    it("shouldn't update video that not exists", async () => {
      const validUpdateData: UpdateVideoInputModel = {
        title: 'valid title',
        author: 'valid author',
        availableResolutions: [Resolutions.P144],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        publicationDate: new Date().toISOString()
      };

      await request(app)
        .put(`${APP_CONFIG.PATH.VIDEOS.BASE}/1`)
        .send(validUpdateData)
        .expect(HttpStatus.NotFound_404);
    });

    it("shouldn't update video if ID is not a number", async () => {
      const res = await request(app)
        .put(`${APP_CONFIG.PATH.VIDEOS.BASE}/abc`)
        .send({
          title: 'Valid Title',
          author: 'valid author',
          availableResolutions: [Resolutions.P144],
          canBeDownloaded: true,
          publicationDate: new Date().toISOString()
        })
        .expect(HttpStatus.BadRequest_400);

      expect(res.body.errorsMessages[0].field).toBe('id');
      expect(res.body.errorsMessages[0].message).toBe(VIDEOS_ERROR_MESSAGES.ID_MUST_BE_INT);
    });
  });

  // ===========================================================================
  // ГРУППА: DELETE (УДАЛЕНИЕ)
  // ===========================================================================
  describe('DELETE Requests', () => {
    it('should delete video and remove it from the list', async () => {
      const { createdEntity } = await testManager.createVideo({ title: 'Delete me' });
      await request(app).delete(`${APP_CONFIG.PATH.VIDEOS.BASE}/${createdEntity.id}`).expect(HttpStatus.NoContent_204);
      await request(app).get(`${APP_CONFIG.PATH.VIDEOS.BASE}/${createdEntity.id}`).expect(HttpStatus.NotFound_404);
    });

    it('should create 2 valid videos and then delete them one by one', async () => {
      const { createdEntity: c1 } = await testManager.createVideo({ title: 'Video 1' });
      const { createdEntity: c2 } = await testManager.createVideo({ title: 'Video 2' });

      console.log(c1, 'c1')
      console.log(c2, 'c2')

      await request(app)
        .delete(`${APP_CONFIG.PATH.VIDEOS.BASE}/${c1.id}`)
        .expect(HttpStatus.NoContent_204);

      const res1 = await request(app).get(APP_CONFIG.PATH.VIDEOS.BASE).expect(HttpStatus.Ok_200);

      console.log(res1.body, 'res1 body')

      expect(res1.body).toEqual([c2]);

      await request(app)
        .delete(`${APP_CONFIG.PATH.VIDEOS.BASE}/${c2.id}`)
        .expect(HttpStatus.NoContent_204);

      await request(app)
        .get(APP_CONFIG.PATH.VIDEOS.BASE)
        .expect(HttpStatus.Ok_200, []);
    });

    it('should return 404 if video does not exist', async () => {
      await request(app)
        .delete(`${APP_CONFIG.PATH.VIDEOS.BASE}/999999`)
        .expect(HttpStatus.NotFound_404);
    });

    it('should check that deleted video is not in the full list', async () => {
      const { createdEntity } = await testManager.createVideo({ title: 'Delete me' });
      await request(app).delete(`${APP_CONFIG.PATH.VIDEOS.BASE}/${createdEntity.id}`);
      const listResponse = await request(app).get(APP_CONFIG.PATH.VIDEOS.BASE);
      expect(listResponse.body).not.toContainEqual(createdEntity);
    });

    it("shouldn't delete video if ID is not a number", async () => {
      const res = await request(app)
        .delete(`${APP_CONFIG.PATH.VIDEOS.BASE}/abc`)
        .expect(HttpStatus.BadRequest_400);

       expect(res.body.errorsMessages[0].field).toBe('id');
    });
  });
});
