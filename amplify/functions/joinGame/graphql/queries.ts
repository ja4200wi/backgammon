/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getPlayer = /* GraphQL */ `query GetPlayer($id: ID!) {
  getPlayer(id: $id) {
    createdAt
    id
    name
    owner
    sessionsAsPlayerOne {
      nextToken
      __typename
    }
    sessionsAsPlayerTwo {
      nextToken
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetPlayerQueryVariables, APITypes.GetPlayerQuery>;
export const getSession = /* GraphQL */ `query GetSession($id: ID!) {
  getSession(id: $id) {
    createdAt
    gameState {
      currentPlayer
      __typename
    }
    id
    playerOne {
      createdAt
      id
      name
      owner
      updatedAt
      __typename
    }
    playerOneID
    playerTwo {
      createdAt
      id
      name
      owner
      updatedAt
      __typename
    }
    playerTwoID
    turns {
      player
      type
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSessionQueryVariables,
  APITypes.GetSessionQuery
>;
export const joinGame = /* GraphQL */ `query JoinGame($gameId: String!, $userId: String!) {
  joinGame(gameId: $gameId, userId: $userId)
}
` as GeneratedQuery<APITypes.JoinGameQueryVariables, APITypes.JoinGameQuery>;
export const listPlayers = /* GraphQL */ `query ListPlayers(
  $filter: ModelPlayerFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      name
      owner
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPlayersQueryVariables,
  APITypes.ListPlayersQuery
>;
export const listSessions = /* GraphQL */ `query ListSessions(
  $filter: ModelSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      playerOneID
      playerTwoID
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSessionsQueryVariables,
  APITypes.ListSessionsQuery
>;
export const sayHello = /* GraphQL */ `query SayHello($name: String) {
  sayHello(name: $name)
}
` as GeneratedQuery<APITypes.SayHelloQueryVariables, APITypes.SayHelloQuery>;
