/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createFriends = /* GraphQL */ `mutation CreateFriends(
  $condition: ModelFriendsConditionInput
  $input: CreateFriendsInput!
) {
  createFriends(condition: $condition, input: $input) {
    createdAt
    id
    isConfirmed
    updatedAt
    userIdOne
    userIdTwo
    userOne {
      createdAt
      id
      name
      updatedAt
      __typename
    }
    userTwo {
      createdAt
      id
      name
      updatedAt
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateFriendsMutationVariables,
  APITypes.CreateFriendsMutation
>;
export const createPlayer = /* GraphQL */ `mutation CreatePlayer(
  $condition: ModelPlayerConditionInput
  $input: CreatePlayerInput!
) {
  createPlayer(condition: $condition, input: $input) {
    createdAt
    friendsAsOne {
      nextToken
      __typename
    }
    friendsAsTwo {
      nextToken
      __typename
    }
    id
    name
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
` as GeneratedMutation<
  APITypes.CreatePlayerMutationVariables,
  APITypes.CreatePlayerMutation
>;
export const createSession = /* GraphQL */ `mutation CreateSession(
  $condition: ModelSessionConditionInput
  $input: CreateSessionInput!
) {
  createSession(condition: $condition, input: $input) {
    createdAt
    id
    playerOne {
      createdAt
      id
      name
      updatedAt
      __typename
    }
    playerOneID
    playerTwo {
      createdAt
      id
      name
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
` as GeneratedMutation<
  APITypes.CreateSessionMutationVariables,
  APITypes.CreateSessionMutation
>;
export const createTurns = /* GraphQL */ `mutation CreateTurns(
  $condition: ModelTurnsConditionInput
  $input: CreateTurnsInput!
) {
  createTurns(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTurnsMutationVariables,
  APITypes.CreateTurnsMutation
>;
export const deleteFriends = /* GraphQL */ `mutation DeleteFriends(
  $condition: ModelFriendsConditionInput
  $input: DeleteFriendsInput!
) {
  deleteFriends(condition: $condition, input: $input) {
    createdAt
    id
    isConfirmed
    updatedAt
    userIdOne
    userIdTwo
    userOne {
      createdAt
      id
      name
      updatedAt
      __typename
    }
    userTwo {
      createdAt
      id
      name
      updatedAt
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteFriendsMutationVariables,
  APITypes.DeleteFriendsMutation
>;
export const deletePlayer = /* GraphQL */ `mutation DeletePlayer(
  $condition: ModelPlayerConditionInput
  $input: DeletePlayerInput!
) {
  deletePlayer(condition: $condition, input: $input) {
    createdAt
    friendsAsOne {
      nextToken
      __typename
    }
    friendsAsTwo {
      nextToken
      __typename
    }
    id
    name
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
` as GeneratedMutation<
  APITypes.DeletePlayerMutationVariables,
  APITypes.DeletePlayerMutation
>;
export const deleteSession = /* GraphQL */ `mutation DeleteSession(
  $condition: ModelSessionConditionInput
  $input: DeleteSessionInput!
) {
  deleteSession(condition: $condition, input: $input) {
    createdAt
    id
    playerOne {
      createdAt
      id
      name
      updatedAt
      __typename
    }
    playerOneID
    playerTwo {
      createdAt
      id
      name
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
` as GeneratedMutation<
  APITypes.DeleteSessionMutationVariables,
  APITypes.DeleteSessionMutation
>;
export const deleteTurns = /* GraphQL */ `mutation DeleteTurns(
  $condition: ModelTurnsConditionInput
  $input: DeleteTurnsInput!
) {
  deleteTurns(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTurnsMutationVariables,
  APITypes.DeleteTurnsMutation
>;
export const joinGame = /* GraphQL */ `mutation JoinGame($gameId: String!, $userId: String!) {
  joinGame(gameId: $gameId, userId: $userId)
}
` as GeneratedMutation<
  APITypes.JoinGameMutationVariables,
  APITypes.JoinGameMutation
>;
export const makeTurn = /* GraphQL */ `mutation MakeTurn(
  $gameId: String!
  $moves: AWSJSON!
  $type: MakeTurnType
  $userId: String!
) {
  makeTurn(gameId: $gameId, moves: $moves, type: $type, userId: $userId) {
    dieOne
    dieTwo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.MakeTurnMutationVariables,
  APITypes.MakeTurnMutation
>;
export const updateFriends = /* GraphQL */ `mutation UpdateFriends(
  $condition: ModelFriendsConditionInput
  $input: UpdateFriendsInput!
) {
  updateFriends(condition: $condition, input: $input) {
    createdAt
    id
    isConfirmed
    updatedAt
    userIdOne
    userIdTwo
    userOne {
      createdAt
      id
      name
      updatedAt
      __typename
    }
    userTwo {
      createdAt
      id
      name
      updatedAt
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateFriendsMutationVariables,
  APITypes.UpdateFriendsMutation
>;
export const updatePlayer = /* GraphQL */ `mutation UpdatePlayer(
  $condition: ModelPlayerConditionInput
  $input: UpdatePlayerInput!
) {
  updatePlayer(condition: $condition, input: $input) {
    createdAt
    friendsAsOne {
      nextToken
      __typename
    }
    friendsAsTwo {
      nextToken
      __typename
    }
    id
    name
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
` as GeneratedMutation<
  APITypes.UpdatePlayerMutationVariables,
  APITypes.UpdatePlayerMutation
>;
export const updateSession = /* GraphQL */ `mutation UpdateSession(
  $condition: ModelSessionConditionInput
  $input: UpdateSessionInput!
) {
  updateSession(condition: $condition, input: $input) {
    createdAt
    id
    playerOne {
      createdAt
      id
      name
      updatedAt
      __typename
    }
    playerOneID
    playerTwo {
      createdAt
      id
      name
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
` as GeneratedMutation<
  APITypes.UpdateSessionMutationVariables,
  APITypes.UpdateSessionMutation
>;
export const updateTurns = /* GraphQL */ `mutation UpdateTurns(
  $condition: ModelTurnsConditionInput
  $input: UpdateTurnsInput!
) {
  updateTurns(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTurnsMutationVariables,
  APITypes.UpdateTurnsMutation
>;
