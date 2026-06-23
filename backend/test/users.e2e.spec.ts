import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users Endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a user with valid input', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'testuser',
          email: 'test@pl.com',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe('testuser');
      expect(response.body.email).toBe('test@pl.com');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        username: 'user1',
        email: 'duplicate@pl.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(userData);

      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'user2',
          email: 'duplicate@pl.com',
        });

      expect(response.status).toBe(409);
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'testuser',
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing username', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'test@pl.com',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /users', () => {
    it('should return list of users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return users sorted by createdAt DESC', async () => {
      const response = await request(app.getHttpServer())
        .get('/users');

      expect(response.status).toBe(200);
      const users = response.body;

      for (let i = 1; i < users.length; i++) {
        const prevDate = new Date(users[i - 1].createdAt);
        const currDate = new Date(users[i].createdAt);
        expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
      }
    });
  });

  describe('POST /users/import-csv', () => {
    it('should import valid CSV file', async () => {
      const csv = 'username,email\nkamil,kamil@pl.com\nkatia,katia@pl.com';

      const response = await request(app.getHttpServer())
        .post('/users/import-csv')
        .attach('file', Buffer.from(csv), 'users.csv');

      expect(response.status).toBe(201);
      expect(response.body.totalRows).toBe(2);
      expect(response.body.successCount).toBe(2);
      expect(response.body.createdUsers.length).toBe(2);
    });

    it('should handle CSV with partial errors', async () => {
      const csv = 'username,email\nkamil,validkamil@pl.com\n,invalidemail\nkatia,invalidkatia';

      const response = await request(app.getHttpServer())
        .post('/users/import-csv')
        .attach('file', Buffer.from(csv), 'users.csv');

      expect(response.status).toBe(201);
      expect(response.body.totalRows).toBe(3);
      expect(response.body.successCount).toBeGreaterThan(0);
      expect(response.body.failureCount).toBeGreaterThan(0);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 400 for non-CSV file', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/import-csv')
        .attach('file', Buffer.from('test'), 'test.txt');

      expect(response.status).toBe(400);
    });

    it('should return 400 when no file provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/import-csv');

      expect(response.status).toBe(400);
    });
  });
});
