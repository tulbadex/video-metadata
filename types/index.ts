export interface Video {
    id: string;
    title: string;
    description: string;
    duration: number;
    genre: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}