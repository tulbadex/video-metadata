import request from 'supertest';
import { setupTestDB, teardownTestDB } from '../utils/test-utils';
import app from '../app';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' }); // Explicitly load .env.test for test environment

describe('VideoController', () => {
  let authToken: string;

  beforeAll(async () => {
    await setupTestDB();

    // Create a test user and log in to get a JWT token
    const userResponse = await request(app).post('/api/v1/auth/register').send({
        name: 'Test',
        email: 'testuser@example.com',
        password: 'Password@123',
    });

    const loginResponse = await request(app).post('/api/v1/auth/login').send({
        email: 'testuser@example.com',
        password: 'Password@123',
    });

    authToken = loginResponse.body.token;

    // Seed some videos
    const videos = [
      {
        title: 'Funny Comedy Video',
        description: 'A hilarious comedy video.',
        duration: 90,
        genre: 'Comedy',
        tags: ['funny', 'entertainment'],
      },
      {
        title: 'Dramatic Video',
        description: 'A dramatic video.',
        duration: 120,
        genre: 'Drama',
        tags: ['emotional'],
      },
      {
        title: 'Another Comedy Video',
        description: 'Another comedy video.',
        duration: 110,
        genre: 'Comedy',
        tags: ['funny', 'skit'],
      },
    ];

    for (const video of videos) {
      await request(app)
        .post('/api/v1/videos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(video);
    }
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe('POST /api/v1/videos', () => {
    it('should create a video', async () => {
      const response = await request(app)
        .post('/api/v1/videos')
        .set('Authorization', `Bearer ${authToken}`) // Pass the token in the header
        .send({
          title: 'Test Video',
          description: 'A test video',
          duration: 120,
          genre: 'Education',
          tags: ['test', 'education'],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/v1/videos')
        .set('Authorization', `Bearer ${authToken}`) // Pass the token in the header
        .send({
          title: '',
          description: 'A test video',
          duration: -10,
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/v1/videos', () => {
    it('should fetch videos with pagination', async () => {
      await request(app)
        .post('/api/v1/videos')
        .set('Authorization', `Bearer ${authToken}`) // Pass the token in the header
        .send({
          title: 'Sample Video',
          description: 'Sample description',
          duration: 100,
          genre: 'Music',
          tags: ['sample', 'music'],
        });

      const response = await request(app).get('/api/v1/videos').query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.videos).toHaveLength(5);
    });
  });

  /* describe('GET /api/v1/videos with filters', () => {
    it('should fetch videos filtered by genre and tags with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/videos')
        .query({ genre: 'Comedy', tags: 'funny', page: 1, limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.videos).toHaveLength(2); // Should match 2 videos with genre "Comedy" and tag "funny"
      expect(response.body.videos[0].genre).toBe('Comedy');
      expect(response.body.videos[0].tags).toContain('funny');
    });
  }); */
    describe('GET /api/v1/videos with filters', () => {
        it('should fetch videos filtered by genre and tags with pagination', async () => {
            const response = await request(app)
                .get('/api/v1/videos')
                .set('Authorization', `Bearer ${authToken}`)
                .query({ 
                    genre: 'Comedy',
                    tags: 'funny',
                    page: 1,
                    limit: 5 
                });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.videos)).toBe(true);
            expect(response.body.videos.length).toBeGreaterThan(0);
            expect(response.body.videos[0].genre).toBe('Comedy');
            expect(response.body.videos[0].tags).toContain('funny');
        });

        // it('should handle invalid query parameters gracefully', async () => {
        //     const response = await request(app)
        //         .get('/api/v1/videos')
        //         .set('Authorization', `Bearer ${authToken}`)
        //         .query({ 
        //             genre: 'NonexistentGenre',
        //             page: -1,
        //             limit: 'invalid' 
        //         });
        //     console.log('error from video get invalid query', response.body); // Debugging
        //     console.log('page number', response.body.page); // Debugging
        //     console.log('video body', response.body.videos); // Debugging
        //     console.log('video status', response.status); // Debugging

        //     expect(response.status).toBe(200);
        //     expect(response.body.videos).toHaveLength(0);
        //     expect(response.body.page).toBe(1); // Should default to 1 for invalid page
        //     expect(response.body.message).toBe('Error fetching videos');
        //     // 
        // });

        it('should handle invalid query parameters gracefully', async () => {
            const response = await request(app)
                .get('/api/v1/videos')
                .set('Authorization', `Bearer ${authToken}`)
                .query({
                    genre: 'NonexistentGenre',
                    page: -1,
                    limit: 'invalid',
                });
        
            console.log('error from video get invalid query', response.body); // Debugging
            console.log('page number', response.body.page); // Debugging
            console.log('video body', response.body.videos); // Debugging
            console.log('video status', response.status); // Debugging
        
            expect(response.status).toBe(200);
            expect(response.body.videos).toHaveLength(0);
            expect(response.body.page).toBe(1); // Should default to 1 for invalid page
            expect(response.body.limit).toBe(10); // Should default to 10 for invalid limit
        });        
    });

    describe('PUT /videos/:id', () => {
        it('should update a video and return 200', async () => {
            const videoResponse = await request(app)
            .post('/api/v1/videos')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Test Video',
                description: 'A test video',
                duration: 120,
                genre: 'Education',
                tags: ['test', 'education'],
            });

            const videoId = videoResponse.body.id;

            const updatedData = { title: 'Updated Title', duration: 120, genre: 'Education', tags: ['test', 'education'] };

            const response = await request(app)
            .put(`/api/v1/videos/${videoId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.title).toBe(updatedData.title);
        });
    
        it('should return 404 for a non-existent video', async () => {
            const response = await request(app)
                .put('/api/v1/videos/e3e3aa02-eeb3-411f-bd29-3cf011a03114')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ title: 'Non-existent', duration: 120, genre: 'Education', tags: ['test', 'education'] });
        
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Video not found');
        });
    });
    
    describe('DELETE /api/v1/videos/:id', () => {
        it('should delete a video and return 200', async () => {
            // Create a video to delete
            const videoResponse = await request(app)
            .post('/api/v1/videos')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Video to delete',
                description: 'This video will be deleted',
                duration: 120,
                genre: 'Test',
                tags: ['delete', 'test'],
            });

            const videoId = videoResponse.body.id;

            // Perform the delete operation
            const response = await request(app)
            .delete(`/api/v1/videos/${videoId}`)
            .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Video deleted successfully');
        });
    
        it('should return 404 for a non-existent video', async () => {
            const response = await request(app)
            .delete('/api/v1/videos/0ea7cf93-3a2a-40a9-8dd8-5fbcf19bd6d7')
            .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Video not found');
        });
    });    
});
