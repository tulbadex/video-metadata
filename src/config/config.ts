import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error('Database environment variables are not properly set.');
}

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Use migrations instead of `synchronize: true` for production
  logging: true,
  entities: ['src/entity/*.ts'], // Adjust the path as necessary
  // migrations: ['src/migration/*.ts'],
};

export default config;
