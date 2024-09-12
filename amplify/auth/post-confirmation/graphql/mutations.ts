/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createBoard = /* GraphQL */ `mutation CreateBoard(
  $condition: ModelBoardConditionInput
  $input: CreateBoardInput!
) {
  createBoard(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateBoardMutationVariables,
  APITypes.CreateBoardMutation
>;
export const createPlayer = /* GraphQL */ `mutation CreatePlayer(
  $condition: ModelPlayerConditionInput
  $input: CreatePlayerInput!
) {
  createPlayer(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePlayerMutationVariables,
  APITypes.CreatePlayerMutation
>;
export const createSession = /* GraphQL */ `mutation CreateSession(
  $condition: ModelSessionConditionInput
  $input: CreateSessionInput!
) {
  createSession(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateSessionMutationVariables,
  APITypes.CreateSessionMutation
>;
export const deleteBoard = /* GraphQL */ `mutation DeleteBoard(
  $condition: ModelBoardConditionInput
  $input: DeleteBoardInput!
) {
  deleteBoard(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteBoardMutationVariables,
  APITypes.DeleteBoardMutation
>;
export const deletePlayer = /* GraphQL */ `mutation DeletePlayer(
  $condition: ModelPlayerConditionInput
  $input: DeletePlayerInput!
) {
  deletePlayer(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeletePlayerMutationVariables,
  APITypes.DeletePlayerMutation
>;
export const deleteSession = /* GraphQL */ `mutation DeleteSession(
  $condition: ModelSessionConditionInput
  $input: DeleteSessionInput!
) {
  deleteSession(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteSessionMutationVariables,
  APITypes.DeleteSessionMutation
>;
export const joinGame = /* GraphQL */ `mutation JoinGame($gameId: String!, $userId: String!) {
  joinGame(gameId: $gameId, userId: $userId)
}
` as GeneratedMutation<
  APITypes.JoinGameMutationVariables,
  APITypes.JoinGameMutation
>;
export const makeTurn = /* GraphQL */ `mutation MakeTurn($gameId: String!, $turn: AWSJSON!, $userId: String!) {
  makeTurn(gameId: $gameId, turn: $turn, userId: $userId)
}
` as GeneratedMutation<
  APITypes.MakeTurnMutationVariables,
  APITypes.MakeTurnMutation
>;
export const updateBoard = /* GraphQL */ `mutation UpdateBoard(
  $condition: ModelBoardConditionInput
  $input: UpdateBoardInput!
) {
  updateBoard(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateBoardMutationVariables,
  APITypes.UpdateBoardMutation
>;
export const updatePlayer = /* GraphQL */ `mutation UpdatePlayer(
  $condition: ModelPlayerConditionInput
  $input: UpdatePlayerInput!
) {
  updatePlayer(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdatePlayerMutationVariables,
  APITypes.UpdatePlayerMutation
>;
export const updateSession = /* GraphQL */ `mutation UpdateSession(
  $condition: ModelSessionConditionInput
  $input: UpdateSessionInput!
) {
  updateSession(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateSessionMutationVariables,
  APITypes.UpdateSessionMutation
>;
