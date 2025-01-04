import request from 'supertest';
import app from '../app';
import testDataSource from '../test-utils/test-connection';

describe('AuthController', () => {
    jest.setTimeout(30000); // Adjust as needed

    beforeAll(async () => {
        await testDataSource.initialize();
    });

    afterAll(async () => {
        if (testDataSource.isInitialized) {
            await testDataSource.destroy();
        }
    });    

    beforeEach(async () => {
        // await testDataSource.synchronize(true);
        const entities = testDataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = testDataSource.getRepository(entity.name);
            await repository.clear(); // Clears the table
        }
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Test User', email: 'test@example.com', password: 'Password@123' });
        console.log('Response body for auth controller:', response.body); // Debugging log
        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty('id');
        expect(response.body).toHaveProperty('token');
    });

    it('should not register an existing user', async () => {
        await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Existing User', email: 'existing@example.com', password: 'Password@123' });

        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Existing User', email: 'existing@example.com', password: 'Password@123' });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('User already exists.');
    });
});
