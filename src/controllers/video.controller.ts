import { Request, Response } from 'express';
import AppDataSource from '../database/data-source';
import { Video } from '../entity/Video';
import { cacheService } from '../services/cache';
import { validateVideo } from '../validators/video.validator';

export class VideoController {
    private videoRepository = AppDataSource.getRepository(Video);
    private readonly CACHE_PREFIX = 'videos:';

    create = async (req: Request, res: Response): Promise<void> => {
        const errors = validateVideo(req.body);
        if (errors.length) {
            res.status(400).json({ errors });
            return;
        }

        try {
            const video = this.videoRepository.create(req.body);
            const result = await this.videoRepository.save(video);
            await this.invalidateCache();
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating video metadata' });
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const errors = validateVideo(req.body);
        if (errors.length) {
            res.status(400).json({ errors });
            return;
        }

        try {
            const video = await this.videoRepository.findOne({
                where: { id: req.params.id }
            });
            
            if (!video) {
                res.status(404).json({ message: 'Video not found' });
                return;
            }

            this.videoRepository.merge(video, req.body);
            const result = await this.videoRepository.save(video);
            await this.invalidateCache();
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error updating video metadata' });
        }
    }

    /* get = async (req: Request, res: Response): Promise<void> => {
        try {
            const { genre, tags, page = 1, limit = 10 } = req.query;
            const cacheKey = `${this.CACHE_PREFIX}${JSON.stringify(req.query)}`;
            const cachedResult = await cacheService.get(cacheKey);
            
            if (cachedResult) {
                const videos = await this.validateCachedData(cachedResult);
                if (videos) {
                    res.json(videos);
                    return;
                }
            }

            const queryBuilder = this.videoRepository.createQueryBuilder("video");
            
            if (genre) {
                queryBuilder.andWhere("video.genre = :genre", { genre });
            }
            
            if (tags) {
                const tagArray = Array.isArray(tags) ? tags : [tags];
                queryBuilder.andWhere("video.tags @> :tags", { tags: tagArray });
            }

            const [videos, total] = await queryBuilder
                .skip((Number(page) - 1) * Number(limit))
                .take(Number(limit))
                .getManyAndCount();

            const result = { videos, total, page: Number(page), limit: Number(limit) };
            await cacheService.set(cacheKey, result);
            
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching videos' });
        }
    } */
    get = async (req: Request, res: Response): Promise<void> => {
        try {
            const { genre, tags, page = 1, limit = 10 } = req.query;
            const pageNumber = Math.max(1, Number(page));
            const pageSize = Math.max(1, Number(limit));
    
            const cacheKey = `${this.CACHE_PREFIX}${JSON.stringify({ genre, tags, page, limit })}`;
            const cachedResult = await cacheService.get(cacheKey);
            if (cachedResult) {
                res.json(cachedResult);
                return;
            }
    
            const queryBuilder = this.videoRepository.createQueryBuilder("video");
            if (genre) {
                queryBuilder.andWhere("video.genre = :genre", { genre });
            }
            if (tags) {
                const tagArray = Array.isArray(tags) ? tags : [tags];
                queryBuilder.andWhere("video.tags && :tags", { tags: tagArray });
            }
    
            const [videos, total] = await queryBuilder
                .skip((pageNumber - 1) * pageSize)
                .take(pageSize)
                .getManyAndCount();
    
            const result = { videos, total, page: pageNumber, limit: pageSize };
            await cacheService.set(cacheKey, result, 3600); // Cache for 1 hour
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching videos', error });
        }
    };        

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const video = await this.videoRepository.findOne({
                where: { id: req.params.id }
            });
            
            if (!video) {
                res.status(404).json({ message: 'Video not found' });
                return;
            }

            await this.videoRepository.remove(video);
            await this.invalidateCache();
            res.json({ message: 'Video deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting video' });
        }
    }

    private async invalidateCache(): Promise<void> {
        const keys = await cacheService.keys(`${this.CACHE_PREFIX}*`);
        await Promise.all(keys.map(key => cacheService.del(key)));
    }

    private async validateCachedData(cachedData: any): Promise<any | null> {
        const { videos } = cachedData;
        // Verify videos still exist
        const existingVideos = await Promise.all(
            videos.map(async (video: Video) => {
                const exists = await this.videoRepository.findOne({ where: { id: video.id } });
                return exists ? video : null;
            })
        );

        if (existingVideos.some((v: Video | null) => !v)) {
            await this.invalidateCache();
            return null;
        }

        return cachedData;
    }
}