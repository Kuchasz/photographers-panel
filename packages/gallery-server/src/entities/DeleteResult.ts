import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class DeleteResult {
    @Field((type) => Int)
    affectedRows!: number;

    static None = { affectedRows: 0 };
    static One = { affectedRows: 1 };
}
