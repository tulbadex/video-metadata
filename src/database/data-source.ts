import { DataSource } from 'typeorm';
import config from '../config/config';

const AppDataSource = new DataSource(config);

export default AppDataSource;
