import 'reflect-metadata';
import testDataSource from '../test-utils/test-connection';
import Redis from 'ioredis-mock';
import jwt from 'jsonwebtoken';

// Use ioredis-mock for testing
jest.mock('ioredis', () => require('ioredis-mock'));

export const setupTestDB = async () => {
  try {
    await testDataSource.initialize();
    await testDataSource.synchronize(true); // Clear and recreate tables
  } catch (error) {
    console.error('Error during test database setup:', error);
    throw error;
  }
};

export const teardownTestDB = async () => {
  try {
    await testDataSource.destroy();
  } catch (error) {
    console.error('Error during test database teardown:', error);
    throw error;
  }
};

export const generateTestToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET! || 'test-secret' );
};

// Mock Redis client for testing
export const mockRedis = new Redis();