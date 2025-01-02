import express from 'express';
import videoRoutes from './routes/video.routes';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/videos', videoRoutes);

export default app;
