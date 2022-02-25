import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn
    } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Client extends BaseEntity {
    @Field((type) => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string;
}
