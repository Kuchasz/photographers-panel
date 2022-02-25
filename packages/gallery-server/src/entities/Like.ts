import {
    BaseEntity,
    Entity,
    ManyToOne,
    PrimaryColumn
    } from "typeorm";
import { Client } from "./Client";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Like extends BaseEntity {
    @Field()
    @PrimaryColumn()
    imageId!: string;

    @PrimaryColumn({ type: 'int8' })
    clientId!: number;

    @ManyToOne((type) => Client)
    client!: Client;

    @Field()
    liked!: boolean;

    @Field((type) => Int)
    likes!: number;
}
