/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getBoard = /* GraphQL */ `query GetBoard($id: ID!) {
  getBoard(id: $id) {
    createdAt
    field1 {
      color
      count
      index
      __typename
    }
    field10 {
      color
      count
      index
      __typename
    }
    field11 {
      color
      count
      index
      __typename
    }
    field12 {
      color
      count
      index
      __typename
    }
    field13 {
      color
      count
      index
      __typename
    }
    field14 {
      color
      count
      index
      __typename
    }
    field15 {
      color
      count
      index
      __typename
    }
    field16 {
      color
      count
      index
      __typename
    }
    field17 {
      color
      count
      index
      __typename
    }
    field18 {
      color
      count
      index
      __typename
    }
    field19 {
      color
      count
      index
      __typename
    }
    field2 {
      color
      count
      index
      __typename
    }
    field20 {
      color
      count
      index
      __typename
    }
    field21 {
      color
      count
      index
      __typename
    }
    field22 {
      color
      count
      index
      __typename
    }
    field23 {
      color
      count
      index
      __typename
    }
    field24 {
      color
      count
      index
      __typename
    }
    field3 {
      color
      count
      index
      __typename
    }
    field4 {
      color
      count
      index
      __typename
    }
    field5 {
      color
      count
      index
      __typename
    }
    field6 {
      color
      count
      index
      __typename
    }
    field7 {
      color
      count
      index
      __typename
    }
    field8 {
      color
      count
      index
      __typename
    }
    field9 {
      color
      count
      index
      __typename
    }
    id
    prisonBlack
    prisonWhite
    session {
      boardID
      createdAt
      currentPlayer
      id
      playerOneID
      playerTwoID
      updatedAt
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetBoardQueryVariables, APITypes.GetBoardQuery>;
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
    board {
      createdAt
      id
      prisonBlack
      prisonWhite
      updatedAt
      __typename
    }
    boardID
    createdAt
    currentPlayer
    dice {
      dieOne
      dieTwo
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
export const listBoards = /* GraphQL */ `query ListBoards(
  $filter: ModelBoardFilterInput
  $limit: Int
  $nextToken: String
) {
  listBoards(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      prisonBlack
      prisonWhite
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBoardsQueryVariables,
  APITypes.ListBoardsQuery
>;
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
      boardID
      createdAt
      currentPlayer
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
