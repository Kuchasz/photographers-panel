import { Connection } from 'typeorm';

export type GalleryServerContext = {
    db: Connection
}