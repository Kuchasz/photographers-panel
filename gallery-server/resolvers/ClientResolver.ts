import { GalleryServerContext } from 'contex';
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { Client } from "../entities/Client";

@Resolver()
export class ClientResolver {
    @Mutation(() => Client)
    connect(@Arg("name") name: string, @Ctx() ctx: GalleryServerContext) {
        const client = new Client();
        client.name = name;
        return ctx.db.getRepository(Client).save(client);
    }
}