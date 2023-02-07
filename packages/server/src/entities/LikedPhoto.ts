import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class LikedPhoto {
    @Field()
    likes!: number;

    @Field()
    directoryName!: string;

    @Field()
    fileName!: string;
}