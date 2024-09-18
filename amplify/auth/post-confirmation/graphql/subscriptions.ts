/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateBoard = /* GraphQL */ `subscription OnCreateBoard($filter: ModelSubscriptionBoardFilterInput) {
  onCreateBoard(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateBoardSubscriptionVariables,
  APITypes.OnCreateBoardSubscription
>;
export const onCreatePlayer = /* GraphQL */ `subscription OnCreatePlayer(
  $filter: ModelSubscriptionPlayerFilterInput
  $owner: String
) {
  onCreatePlayer(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePlayerSubscriptionVariables,
  APITypes.OnCreatePlayerSubscription
>;
export const onCreateSession = /* GraphQL */ `subscription OnCreateSession($filter: ModelSubscriptionSessionFilterInput) {
  onCreateSession(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSessionSubscriptionVariables,
  APITypes.OnCreateSessionSubscription
>;
export const onDeleteBoard = /* GraphQL */ `subscription OnDeleteBoard($filter: ModelSubscriptionBoardFilterInput) {
  onDeleteBoard(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteBoardSubscriptionVariables,
  APITypes.OnDeleteBoardSubscription
>;
export const onDeletePlayer = /* GraphQL */ `subscription OnDeletePlayer(
  $filter: ModelSubscriptionPlayerFilterInput
  $owner: String
) {
  onDeletePlayer(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePlayerSubscriptionVariables,
  APITypes.OnDeletePlayerSubscription
>;
export const onDeleteSession = /* GraphQL */ `subscription OnDeleteSession($filter: ModelSubscriptionSessionFilterInput) {
  onDeleteSession(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSessionSubscriptionVariables,
  APITypes.OnDeleteSessionSubscription
>;
export const onUpdateBoard = /* GraphQL */ `subscription OnUpdateBoard($filter: ModelSubscriptionBoardFilterInput) {
  onUpdateBoard(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateBoardSubscriptionVariables,
  APITypes.OnUpdateBoardSubscription
>;
export const onUpdatePlayer = /* GraphQL */ `subscription OnUpdatePlayer(
  $filter: ModelSubscriptionPlayerFilterInput
  $owner: String
) {
  onUpdatePlayer(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePlayerSubscriptionVariables,
  APITypes.OnUpdatePlayerSubscription
>;
export const onUpdateSession = /* GraphQL */ `subscription OnUpdateSession($filter: ModelSubscriptionSessionFilterInput) {
  onUpdateSession(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSessionSubscriptionVariables,
  APITypes.OnUpdateSessionSubscription
>;
