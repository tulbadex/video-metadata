/* import { DataSource } from 'typeorm';
import AppDataSource from '../database/data-source';

export const setupTestDB = async (): Promise<DataSource> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  await AppDataSource.synchronize(true); // Reset database
  return AppDataSource;
};

export const teardownTestDB = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
};
 */
import AppDataSource from '../database/data-source';
import Redis from 'ioredis-mock';

// Mock Redis for testing
jest.mock('ioredis', () => require('ioredis-mock'));

export const setupTestDB = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        await AppDataSource.synchronize(true); // Clear and recreate tables
    } catch (error) {
        console.error('Test database setup error:', error);
        throw error;
    }
};

export const teardownTestDB = async () => {
    try {
        await AppDataSource.dropDatabase(); // Drop all tables
        await AppDataSource.destroy(); // Close the connection
    } catch (error) {
        console.error('Test database teardown error:', error);
        throw error;
    }
};

// Export mock Redis instance if needed in tests
export const mockRedis = new Redis();