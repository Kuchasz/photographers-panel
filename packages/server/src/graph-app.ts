import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { Connection, createConnection, getConnectionManager } from "typeorm";
import { GalleryServerContext } from "./contex";
import { Client } from "./entities/Client";
import { Like } from "./entities/Like";
import { ClientResolver } from "./resolvers/client-resolver";
import { LikeResolver } from "./resolvers/like-resolver";

const connections: { [galleryId: number]: Promise<Connection> } = {};

const createDb = (databases: string, galleryId: number) => {
    const existingConnection = connections[galleryId];
    return existingConnection !== undefined
        ? Promise.resolve(connections[galleryId])
        : (connections[galleryId] = createConnection({
            type: 'sqlite',
            database: `${databases}/${galleryId}.sqlite`,
            synchronize: true,
            logging: true,
            name: `DB_CONNECTION_NAME: ${Math.random()}`,
            // dropSchema: true,
            entities: [Like, Client],
            migrations: ['migrations/**/*.ts'],
            subscribers: ['subscribers/**/*.ts'],
        }));
};

export const useGraphApi = async (app: express.Express, databases: string) => {
    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [LikeResolver, ClientResolver],
            emitSchemaFile: true
        }),
        context: async ({ req }) => {
            console.warn(`Number of connections: ${getConnectionManager().connections.length}`);
            return {
                db: await createDb(databases, Number(req.headers.galleryid)),
            } as GalleryServerContext;
        },
        playground: true,
        introspection: true,
    });

    server.applyMiddleware({
        app,
        path: '/api',
        cors: {
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true,
            allowedHeaders: ['Content-Type', 'Origin', 'Accept'],
        },
    });
};