import request from 'supertest';
import { setupTestDB, teardownTestDB } from '../utils/test-utils';
import app from '../app'; // Import your Express app

describe('AuthController', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'Password@123',
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body).toHaveProperty('token');
    });

    it('should return 400 if email already exists', async () => {
      await request(app).post('/api/v1/auth/register').send({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'Password@123',
      });

      const response = await request(app).post('/api/v1/auth/register').send({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'Password@123',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists.');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login an existing user', async () => {
      await request(app).post('/api/v1/auth/register').send({
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'Password@123',
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'janedoe@example.com',
          password: 'Password@123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 400 for invalid credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email or password.');
    });
  });
});
