import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({
    path: path.join(__dirname, '../../.env.test')
});

// dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.TEST_DB_NAME) {
  throw new Error('Database environment variables are not properly set.');
}

const testConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.TEST_DB_NAME,
  synchronize: true, // Use migrations instead of `synchronize: true` for production
  logging: process.env.DB_LOGGING === 'true',
  //   entities: ['src/entity/*.ts'], // Adjust the path as necessary
  // migrations: ['src/migration/*.ts'],
  entities: [path.join(__dirname, '../entity/*.ts')],
  dropSchema: true,
};

const testDataSource = new DataSource(testConfig);

export default testDataSource;
