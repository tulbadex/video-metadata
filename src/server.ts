import 'reflect-metadata';
import AppDataSource from './database/data-source';
import testDataSource from './test-utils/test-connection';
import app from './app';
import dotenv from 'dotenv';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const dataSource = process.env.NODE_ENV === 'test' ? testDataSource : AppDataSource;

const startServer = async () => {
    try {
        await dataSource.initialize();
        console.log('Database connection established');
        console.log(`Database connection established in ${process.env.NODE_ENV} mode`);

        // app.listen(process.env.port, () => {
        //     console.log(`Server running on port ${process.env.port}`);
        // });
        const port = process.env.port || 3000;
        if (process.env.NODE_ENV !== 'test') {
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}

// startServer();