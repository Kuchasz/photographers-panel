import { getSdk } from "./sdk";
import { GraphQLClient } from "graphql-request";

export type GraphApi = ReturnType<typeof getSdk>;

export const createGraphApi = (name: string, galleryId: number) => {
    const sdk = getSdk(
        new GraphQLClient('/api', {
            headers: { galleryid: galleryId.toString() },
        })
    );

    return sdk;
}