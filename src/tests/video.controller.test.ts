import request from 'supertest';
import app from '../app';
import { setupTestDB, teardownTestDB, generateTestToken } from './setup';
import { User } from '../entity/User';
import testDataSource from '../test-utils/test-connection';

describe('VideoController', () => {
    // Obtain JWT token before running tests
    let token: string;
    let testUser: User;

    jest.setTimeout(30000); // Adjust as needed


    beforeAll(async () => {
        // await testDataSource.initialize();
        await setupTestDB();

        // Create a test user
        const userRepo = testDataSource.getRepository(User);

        testUser = userRepo.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'Password@123'
          });
        await userRepo.save(testUser);
        token = generateTestToken(testUser.id);

        // Create test user and get token
        // const response = await request(app)
        //     .post('/api/v1/auth/register')
        //     .send({ 
        //         name: 'Test User', 
        //         email: 'test@example.com', 
        //         password: 'Password@123' 
        //     });
        // console.log('Response body debugging:', response.body); // Debugging log
        // // console.log('Loaded entities:', testDataSource.entityMetadatas.map(e => e.name));
            
        // token = response.body.token;
    });

    afterAll(async () => {
        // if (testDataSource.isInitialized) {
        //     await testDataSource.destroy();
        // }
        await teardownTestDB();
    });    

    beforeEach(async () => {
        // await testDataSource.synchronize(true);
        const entities = testDataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = testDataSource.getRepository(entity.name);
            await repository.clear(); // Clears the table
        }
    });

    it('should create a video', async () => {
        console.log('Token being used:', token); // Debugging log
        const response = await request(app)
            .post('/api/v1/videos')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Video',
                description: 'This is a test video',
                duration: 120,
                genre: 'Comedy',
                tags: ['funny', 'comedy']
            });
        console.log('Response body:', response.body); // Debugging log
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });    

    it('should fetch videos with pagination and filtering', async () => {
        const response = await request(app)
            .get('/api/v1/videos')
            .query({ genre: 'Comedy', tags: 'funny', page: 1, limit: 5 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('videos');
        expect(response.body).toHaveProperty('total');
    });
});