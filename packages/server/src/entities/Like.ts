import {
    BaseEntity,
    Entity,
    ManyToOne,
    PrimaryColumn
} from "typeorm";
import { Client } from "./Client";
import { Field, Int, ObjectType } from "type-graphql";
import { GraphQLBoolean, GraphQLString } from "graphql";

@ObjectType()
@Entity()
export class Like extends BaseEntity {
    @Field(() => GraphQLString)
    @PrimaryColumn({ type: 'varchar' })
    imageId!: string;

    @PrimaryColumn({ type: 'int8' })
    clientId!: number;

    @ManyToOne(() => Client)
    client!: Client;

    @Field(() => GraphQLBoolean)
    liked!: boolean;

    @Field(() => Int)
    likes!: number;
}