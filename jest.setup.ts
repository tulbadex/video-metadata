import dotenv from 'dotenv';
import path from 'path';
import { config } from 'dotenv';

config({
    path: path.join(__dirname, '.env.test')
});

process.env.NODE_ENV = 'test';