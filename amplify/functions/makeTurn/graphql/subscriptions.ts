/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

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
    turnsMade {
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
` as GeneratedSubscription<
  APITypes.OnCreateSessionSubscriptionVariables,
  APITypes.OnCreateSessionSubscription
>;
export const onCreateTurns = /* GraphQL */ `subscription OnCreateTurns($filter: ModelSubscriptionTurnsFilterInput) {
  onCreateTurns(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTurnsSubscriptionVariables,
  APITypes.OnCreateTurnsSubscription
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
    turnsMade {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSessionSubscriptionVariables,
  APITypes.OnDeleteSessionSubscription
>;
export const onDeleteTurns = /* GraphQL */ `subscription OnDeleteTurns($filter: ModelSubscriptionTurnsFilterInput) {
  onDeleteTurns(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTurnsSubscriptionVariables,
  APITypes.OnDeleteTurnsSubscription
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
    turnsMade {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSessionSubscriptionVariables,
  APITypes.OnUpdateSessionSubscription
>;
export const onUpdateTurns = /* GraphQL */ `subscription OnUpdateTurns($filter: ModelSubscriptionTurnsFilterInput) {
  onUpdateTurns(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTurnsSubscriptionVariables,
  APITypes.OnUpdateTurnsSubscription
>;
