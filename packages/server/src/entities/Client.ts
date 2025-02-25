import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { GraphQLString } from "graphql";

@ObjectType()
@Entity()
export class Client extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => GraphQLString)
    @Column({ type: 'varchar' })
    name!: string;
}