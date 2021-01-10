import { DeleteResult } from '../entities/DeleteResult';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Like } from "../entities/Like";
import { GalleryServerContext } from 'contex';

@Resolver()
export class LikeResolver {
    @Mutation(() => Like)
    async likeImage(
        @Arg("imageId") imageId: string,
        @Arg("clientId", () => Int) clientId: number,
        @Ctx() ctx: GalleryServerContext
    ) {
        const like = new Like();
        like.imageId = imageId;
        like.clientId = clientId;
        return await ctx.db.getRepository(Like).save(like);
    }

    @Mutation(() => DeleteResult)
    async unlikeImage(
        @Arg("imageId") imageId: string,
        @Arg("clientId", () => Int) clientId: number,
        @Ctx() ctx: GalleryServerContext
    ) {
        const repository = ctx.db.getRepository(Like);
        const likeToDelete = await repository.findOne({ imageId, clientId });

        if (!likeToDelete)
            return DeleteResult.None;

        await repository.remove(likeToDelete);
        return DeleteResult.One;
    }

    @Query(() => [Like])
    async likes(
        @Arg("clientId", () => Int) clientId: number,
        @Ctx() ctx: GalleryServerContext
    ) {
        const allLikes = await ctx.db.getRepository(Like).find();

        const likes = allLikes.reduce((likesForImages, image) => {
            const likes = likesForImages[image.imageId];
            likesForImages[image.imageId] = likes
                ? { ...likes, likes: likes.likes + 1, liked: image.clientId === clientId || likes.liked }
                : ({ imageId: image.imageId, likes: 1, liked: image.clientId === clientId } as any);

            return likesForImages;
        }, {} as { [imageId: string]: Like });

        return Object.values(likes);
    }
}
