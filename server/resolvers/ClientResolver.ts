import { Arg, Mutation, Resolver } from "type-graphql";
import { Client } from "../entities/Client";

@Resolver()
export class ClientResolver {
    @Mutation(() => Client)
    connect(@Arg("name") name: string) {
        const client = new Client();
        client.name = name;
        return client.save();
    }
}