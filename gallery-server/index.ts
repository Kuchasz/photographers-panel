import "reflect-metadata";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { Connection, createConnection, getConnectionManager } from "typeorm";
import { Like } from "./entities/Like";
import { Client } from "./entities/Client";
import { buildSchema } from "type-graphql";
import { LikeResolver } from "./resolvers/LikeResolver";
import { ClientResolver } from "./resolvers/ClientResolver";
import { GalleryServerContext } from 'contex';

const connections: { [galleryId: number]: Promise<Connection> } = {};

const createDb = (galleryId: number) => {
    return connections[galleryId]
        ? Promise.resolve(connections[galleryId])
        : connections[galleryId] = createConnection({
            type: "sqlite",
            database: `${galleryId}.sqlite`,
            synchronize: true,
            logging: true,
            name: `DB_CONNECTION_NAME: ${Math.random()}`,
            // dropSchema: true,
            entities: [Like, Client],
            migrations: ["migrations/**/*.ts"],
            subscribers: ["subscribers/**/*.ts"]
        });
}

export const runPhotoGalleryServer = async (app: express.Express) => {

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [LikeResolver, ClientResolver],
            emitSchemaFile: true
        }),
        context: async ({ req }) => {
            console.warn(`Number of connections: ${getConnectionManager().connections.length}`);
            return ({
                db: await createDb(Number(req.headers.galleryid))
            }) as GalleryServerContext;
        },
        playground: true,
        introspection: true
    });

    server.applyMiddleware({
        app,
        path: "/api",
        cors: {
            origin: "*",
            methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
            preflightContinue: false,
            optionsSuccessStatus: 204,
            credentials: true,
            allowedHeaders: ["Content-Type", "Origin", "Accept"]
        }
    });
};