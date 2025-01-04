// import { DataSource, DataSourceOptions } from "typeorm";
// import dotenv from 'dotenv';

// dotenv.config();

// const testConfig: DataSourceOptions = {
//     type: 'postgres',
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT, 10),
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.TEST_DB_NAME,
//     synchronize: true, // Use migrations instead of `synchronize: true` for production
//     // logging: true,
//     entities: ['src/entity/*.ts'], // Adjust the path as necessary
//     dropSchema: true,
//   };

// const testDataSource = new DataSource(testConfig);

// export default testDataSource;

import { DataSource, DataSourceOptions } from "typeorm";
import { User } from '../entity/User'; // Import your entities
import { Video } from '../entity/Video'; // Import your entities
import dotenv from 'dotenv';

dotenv.config();
import path from 'path';

// Load test environment variables
dotenv.config({
    path: path.join(__dirname, '../../.env.test')
});

const testConfig : DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.TEST_DB_NAME || 'test_db',
    entities: [User, Video], // Explicitly specify entities
    synchronize: true,
    dropSchema: true,
    // logging: false
    logging: process.env.DB_LOGGING === 'true'
};

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'TEST_DB_NAME'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const testDataSource = new DataSource(testConfig);

export default testDataSource;