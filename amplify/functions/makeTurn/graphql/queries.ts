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
    turnsMade {
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
      nextToken
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
export const getTurns = /* GraphQL */ `query GetTurns($gameId: ID!, $turnNumber: Int!) {
  getTurns(gameId: $gameId, turnNumber: $turnNumber) {
    createdAt
    diceForNextTurn {
      dieOne
      dieTwo
      __typename
    }
    game {
      createdAt
      id
      playerOneID
      playerTwoID
      updatedAt
      __typename
    }
    gameId
    moves {
      from
      to
      __typename
    }
    player {
      createdAt
      id
      name
      owner
      updatedAt
      __typename
    }
    playerColor
    playerId
    turnNumber
    type
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTurnsQueryVariables, APITypes.GetTurnsQuery>;
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
export const listTurns = /* GraphQL */ `query ListTurns(
  $filter: ModelTurnsFilterInput
  $gameId: ID
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $turnNumber: ModelIntKeyConditionInput
) {
  listTurns(
    filter: $filter
    gameId: $gameId
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    turnNumber: $turnNumber
  ) {
    items {
      createdAt
      gameId
      playerColor
      playerId
      turnNumber
      type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListTurnsQueryVariables, APITypes.ListTurnsQuery>;
