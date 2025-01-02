import 'reflect-metadata';
import AppDataSource from './database/data-source';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection established');

        app.listen(process.env.port, () => {
            console.log(`Server running on port ${process.env.port}`);
        });
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

startServer();