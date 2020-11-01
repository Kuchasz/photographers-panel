import "reflect-metadata";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { Like } from "./entities/Like";
import { Client } from "./entities/Client";
import { buildSchema } from "type-graphql";
import { LikeResolver } from "./resolvers/LikeResolver";
import { ClientResolver } from "./resolvers/ClientResolver";

export const runPhotoGalleryServer = async (app: express.Express) => {

    await createConnection({
        type: "sqlite",
        database: "database.sqlite",
        synchronize: true,
        logging: true,
        // dropSchema: true,
        entities: [Like, Client],
        migrations: ["migrations/**/*.ts"],
        subscribers: ["subscribers/**/*.ts"]
    });

    const server = new ApolloServer({
        schema: await buildSchema({
            resolvers: [LikeResolver, ClientResolver],
            emitSchemaFile: true
        }),
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