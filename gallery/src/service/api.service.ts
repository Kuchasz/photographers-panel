import { Injectable, Optional } from "@angular/core";
import { GraphQLClient } from "graphql-request";
import { app } from "@pp/server/src/config";

import { getSdk } from "../sdk";

@Injectable()
export class ApiService {
    public sdk = getSdk(new GraphQLClient(app.appPath + '/api'));
    public clientId: number;
    public galleryId: number;

    constructor() {}

    async connect(name: string, galleryId: number) {
        this.galleryId = galleryId;
        this.clientId = Number.parseInt(localStorage.getItem("client.id") ?? "0");

        if (!this.clientId) {
            const connectClientResult = await this.sdk.connectClient({ name });
            this.clientId = connectClientResult.connect.id;
            localStorage.setItem("client.id", String(this.clientId));
        }

        return this.clientId;
    }
}
