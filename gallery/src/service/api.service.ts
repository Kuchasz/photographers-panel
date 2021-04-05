import { Injectable, Optional } from '@angular/core';
import { GraphQLClient } from 'graphql-request';

import { getSdk } from '../sdk';

@Injectable()
export class ApiService {
    public sdk: ReturnType<typeof getSdk>;
    public clientId: number;
    public galleryId: number;

    constructor() {}

    async connect(name: string, galleryId: number) {
        // console.log('connect: ', galleryId);
        this.sdk = getSdk(
            new GraphQLClient('/api', {
                headers: { galleryid: galleryId.toString() },
            })
        );
        this.galleryId = galleryId;

        const clientIdKey = `${galleryId}.clientId`;

        this.clientId = Number.parseInt(localStorage.getItem(clientIdKey) ?? '0');

        if (!this.clientId) {
            const connectClientResult = await this.sdk.connectClient({ name });
            this.clientId = connectClientResult.connect.id;
            localStorage.setItem(clientIdKey, String(this.clientId));
        }

        return this.clientId;
    }
}
