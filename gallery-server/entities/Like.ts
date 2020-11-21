import { Field, Int, ObjectType } from "type-graphql";
import { Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { Client } from "./Client";

@ObjectType()
@Entity()
export class Like extends BaseEntity {
    @Field()
    @PrimaryColumn()
    imageId: string;

    @PrimaryColumn({type: "int8"})
    clientId: number;

    @ManyToOne(type => Client)
    client: Client;

    @Field()
    liked: boolean;

    @Field(type => Int)
    likes: number;
}
