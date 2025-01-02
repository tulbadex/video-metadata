import { VideoController } from '../controllers/video.controller';
import { Request, Response } from 'express';
import { createConnection, getRepository } from 'typeorm';
import { Video } from '../entity/Video';
import { cacheService } from '../services/cache';

describe('VideoController', () => {
    let videoController: VideoController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    
    beforeAll(async () => {
        await createConnection(); // Configure test database connection
        videoController = new VideoController();
    });

    beforeEach(() => {
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        mockRequest = {
            query: {}
        };
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('should return filtered videos by genre', async () => {
            const mockVideos = [
                { id: 1, title: 'Test Video', genre: 'action' }
            ];
            
            mockRequest.query = { genre: 'action' };
            jest.spyOn(getRepository(Video), 'createQueryBuilder')
                .mockImplementation(() => ({
                    select: jest.fn().mockReturnThis(),
                    where: jest.fn().mockReturnThis(),
                    andWhere: jest.fn().mockReturnThis(),
                    orderBy: jest.fn().mockReturnThis(),
                    skip: jest.fn().mockReturnThis(),
                    take: jest.fn().mockReturnThis(),
                    getManyAndCount: jest.fn().mockResolvedValue([mockVideos, 1])
                } as any));

            await videoController.get(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith({
                videos: mockVideos,
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1
            });
        });

        it('should return cached results when available', async () => {
            const cachedData = {
                videos: [{ id: 1, title: 'Cached Video' }],
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1
            };

            jest.spyOn(cacheService, 'get').mockResolvedValue(cachedData);
            await videoController.get(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(cachedData);
        });
    });
});