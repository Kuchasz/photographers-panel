import { DeleteResult } from '../entities/DeleteResult';
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Like } from "../entities/Like";

@Resolver()
export class LikeResolver {
    @Mutation(() => Like)
    likeImage(
        @Arg("imageId") imageId: string,
        @Arg("clientId", () => Int) clientId: number,
        @Arg("galleryId", () => Int) galleryId: number
    ) {
        const like = new Like();
        like.imageId = imageId;
        like.clientId = clientId;
        like.galleryId = galleryId;
        return like.save();
    }

    @Mutation(() => DeleteResult)
    async unlikeImage(
        @Arg("imageId") imageId: string,
        @Arg("clientId", () => Int) clientId: number,
        @Arg("galleryId", () => Int) galleryId: number
    ) {
        const likeToDelete = await Like.findOne({ galleryId, imageId, clientId });
        
        if(!likeToDelete)
            return DeleteResult.None;

        await likeToDelete.remove();
        return DeleteResult.One;
    }

    @Query(() => [Like])
    async likes(@Arg("galleryId", () => Int) galleryId: number, @Arg("clientId", () => Int) clientId: number) {
        const allLikes = await Like.find({ galleryId });

        const likes = allLikes.reduce((agg, curr) => {
            const like = agg[curr.imageId];
            agg[curr.imageId] = like
                ? { ...like, likes: like.likes + 1, liked: curr.clientId === clientId || like.liked }
                : ({ imageId: curr.imageId, likes: 1, liked: curr.clientId === clientId } as any);

            return agg;
        }, {} as { [imageId: string]: Like });

        return Object.values(likes);
    }
}
