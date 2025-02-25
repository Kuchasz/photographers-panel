import { GraphQLString } from "graphql";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class LikedPhoto {
    @Field(() => Int)
    likes!: number;

    @Field(() => GraphQLString)
    directoryName!: string;

    @Field(() => GraphQLString)
    fileName!: string;
}