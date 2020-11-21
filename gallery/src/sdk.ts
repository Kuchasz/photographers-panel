import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in keyof Pick<T, K>]?: Maybe<Pick<T, K>[SubKey]> };
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
  connect: Client;
  likeImage: Like;
  unlikeImage: DeleteResult;
};


export type MutationConnectArgs = {
  name: Scalars['String'];
};


export type MutationLikeImageArgs = {
  clientId: Scalars['Int'];
  imageId: Scalars['String'];
};


export type MutationUnlikeImageArgs = {
  clientId: Scalars['Int'];
  imageId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  likes: Array<Like>;
};


export type QueryLikesArgs = {
  clientId: Scalars['Int'];
};


export const LikesDocument = gql`
    query likes($clientId: Int!) {
  likes(clientId: $clientId) {
    imageId
    liked
    likes
  }
}
    `;
export const LikeImageDocument = gql`
    mutation likeImage($imageId: String!, $clientId: Int!) {
  likeImage(imageId: $imageId, clientId: $clientId) {
    imageId
  }
}
    `;
export const UnlikeImageDocument = gql`
    mutation unlikeImage($imageId: String!, $clientId: Int!) {
  unlikeImage(imageId: $imageId, clientId: $clientId) {
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
    likes(variables: LikesQueryVariables): Promise<LikesQuery> {
      return withWrapper(() => client.request<LikesQuery>(print(LikesDocument), variables));
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
export type LikesQueryVariables = Exact<{
  clientId: Scalars['Int'];
}>;


export type LikesQuery = (
  { __typename?: 'Query' }
  & { likes: Array<(
    { __typename?: 'Like' }
    & Pick<Like, 'imageId' | 'liked' | 'likes'>
  )> }
);

export type LikeImageMutationVariables = Exact<{
  imageId: Scalars['String'];
  clientId: Scalars['Int'];
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
