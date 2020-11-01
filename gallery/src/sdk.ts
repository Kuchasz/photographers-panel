import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Client = {
  __typename?: 'Client';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type DeleteResult = {
  __typename?: 'DeleteResult';
  affectedRows: Scalars['Int'];
};

export type Like = {
  __typename?: 'Like';
  imageId: Scalars['String'];
  liked: Scalars['Boolean'];
  likes: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  likeImage: Like;
  unlikeImage: DeleteResult;
  connect: Client;
};


export type MutationLikeImageArgs = {
  galleryId: Scalars['Int'];
  clientId: Scalars['Int'];
  imageId: Scalars['String'];
};


export type MutationUnlikeImageArgs = {
  galleryId: Scalars['Int'];
  clientId: Scalars['Int'];
  imageId: Scalars['String'];
};


export type MutationConnectArgs = {
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  likes: Array<Like>;
};


export type QueryLikesArgs = {
  clientId: Scalars['Int'];
  galleryId: Scalars['Int'];
};


export const GetLikesDocument = gql`
    query getLikes($clientId: Int!, $galleryId: Int!) {
  likes(clientId: $clientId, galleryId: $galleryId) {
    imageId
    liked
    likes
  }
}
    `;
export const LikeImageDocument = gql`
    mutation likeImage($imageId: String!, $clientId: Int!, $galleryId: Int!) {
  likeImage(imageId: $imageId, galleryId: $galleryId, clientId: $clientId) {
    imageId
  }
}
    `;
export const UnlikeImageDocument = gql`
    mutation unlikeImage($imageId: String!, $clientId: Int!, $galleryId: Int!) {
  unlikeImage(imageId: $imageId, galleryId: $galleryId, clientId: $clientId) {
    affectedRows
  }
}
    `;
export const ConnectClientDocument = gql`
    mutation connectClient($name: String!) {
  connect(name: $name) {
    id
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getLikes(variables: GetLikesQueryVariables): Promise<GetLikesQuery> {
      return withWrapper(() => client.request<GetLikesQuery>(print(GetLikesDocument), variables));
    },
    likeImage(variables: LikeImageMutationVariables): Promise<LikeImageMutation> {
      return withWrapper(() => client.request<LikeImageMutation>(print(LikeImageDocument), variables));
    },
    unlikeImage(variables: UnlikeImageMutationVariables): Promise<UnlikeImageMutation> {
      return withWrapper(() => client.request<UnlikeImageMutation>(print(UnlikeImageDocument), variables));
    },
    connectClient(variables: ConnectClientMutationVariables): Promise<ConnectClientMutation> {
      return withWrapper(() => client.request<ConnectClientMutation>(print(ConnectClientDocument), variables));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export type GetLikesQueryVariables = Exact<{
  clientId: Scalars['Int'];
  galleryId: Scalars['Int'];
}>;


export type GetLikesQuery = (
  { __typename?: 'Query' }
  & { likes: Array<(
    { __typename?: 'Like' }
    & Pick<Like, 'imageId' | 'liked' | 'likes'>
  )> }
);

export type LikeImageMutationVariables = Exact<{
  imageId: Scalars['String'];
  clientId: Scalars['Int'];
  galleryId: Scalars['Int'];
}>;


export type LikeImageMutation = (
  { __typename?: 'Mutation' }
  & { likeImage: (
    { __typename?: 'Like' }
    & Pick<Like, 'imageId'>
  ) }
);

export type UnlikeImageMutationVariables = Exact<{
  imageId: Scalars['String'];
  clientId: Scalars['Int'];
  galleryId: Scalars['Int'];
}>;


export type UnlikeImageMutation = (
  { __typename?: 'Mutation' }
  & { unlikeImage: (
    { __typename?: 'DeleteResult' }
    & Pick<DeleteResult, 'affectedRows'>
  ) }
);

export type ConnectClientMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type ConnectClientMutation = (
  { __typename?: 'Mutation' }
  & { connect: (
    { __typename?: 'Client' }
    & Pick<Client, 'id'>
  ) }
);
