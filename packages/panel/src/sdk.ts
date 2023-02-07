import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export type LikedPhoto = {
  __typename?: 'LikedPhoto';
  directoryName: Scalars['String'];
  fileName: Scalars['String'];
  likes: Scalars['Float'];
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
  likedPhotos: Array<LikedPhoto>;
  likes: Array<Like>;
};


export type QueryLikedPhotosArgs = {
  galleryId: Scalars['Int'];
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
export const LikedPhotosDocument = gql`
    query likedPhotos($galleryId: Int!) {
  likedPhotos(galleryId: $galleryId) {
    likes
    fileName
    directoryName
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    likes(variables: LikesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LikesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LikesQuery>(LikesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'likes', 'query');
    },
    likedPhotos(variables: LikedPhotosQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LikedPhotosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LikedPhotosQuery>(LikedPhotosDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'likedPhotos', 'query');
    },
    likeImage(variables: LikeImageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LikeImageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LikeImageMutation>(LikeImageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'likeImage', 'mutation');
    },
    unlikeImage(variables: UnlikeImageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UnlikeImageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnlikeImageMutation>(UnlikeImageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'unlikeImage', 'mutation');
    },
    connectClient(variables: ConnectClientMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ConnectClientMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConnectClientMutation>(ConnectClientDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'connectClient', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;

export type LikesQueryVariables = Exact<{
  clientId: Scalars['Int'];
}>;


export type LikesQuery = { __typename?: 'Query', likes: Array<{ __typename?: 'Like', imageId: string, liked: boolean, likes: number }> };

export type LikedPhotosQueryVariables = Exact<{
  galleryId: Scalars['Int'];
}>;


export type LikedPhotosQuery = { __typename?: 'Query', likedPhotos: Array<{ __typename?: 'LikedPhoto', likes: number, fileName: string, directoryName: string }> };

export type LikeImageMutationVariables = Exact<{
  imageId: Scalars['String'];
  clientId: Scalars['Int'];
}>;


export type LikeImageMutation = { __typename?: 'Mutation', likeImage: { __typename?: 'Like', imageId: string } };

export type UnlikeImageMutationVariables = Exact<{
  imageId: Scalars['String'];
  clientId: Scalars['Int'];
}>;


export type UnlikeImageMutation = { __typename?: 'Mutation', unlikeImage: { __typename?: 'DeleteResult', affectedRows: number } };

export type ConnectClientMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type ConnectClientMutation = { __typename?: 'Mutation', connect: { __typename?: 'Client', id: number } };
