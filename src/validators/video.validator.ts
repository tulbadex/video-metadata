import { Video } from '../entity/Video';

interface ValidationError {
    field: string;
    message: string;
}

export const validateVideo = (data: Partial<Video>): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.title?.trim()) {
        errors.push({ field: 'title', message: 'Title is required' });
    }

    if (typeof data.duration !== 'number' || data.duration <= 0) {
        errors.push({ field: 'duration', message: 'Duration must be a positive number' });
    }

    if (!data.genre?.trim()) {
        errors.push({ field: 'genre', message: 'Genre is required' });
    }

    if (!Array.isArray(data.tags) || !data.tags.length) {
        errors.push({ field: 'tags', message: 'At least one tag is required' });
    }

    return errors;
};