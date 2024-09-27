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
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    userTwo {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
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
    country
    createdAt
    emoji
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
    profilePicColor
    sessionsAsPlayerOne {
      nextToken
      __typename
    }
    sessionsAsPlayerTwo {
      nextToken
      __typename
    }
    sessionsWon {
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
    gameType
    id
    isGameOver
    isGameStarted
    playerOne {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    playerOneID
    playerTwo {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    playerTwoID
    statisticId
    statistics {
      bet
      createdAt
      doubleDiceValue
      duration
      gameId
      gameType
      id
      numTurns
      reason
      updatedAt
      winnerId
      __typename
    }
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
export const createSessionStat = /* GraphQL */ `mutation CreateSessionStat(
  $condition: ModelSessionStatConditionInput
  $input: CreateSessionStatInput!
) {
  createSessionStat(condition: $condition, input: $input) {
    bet
    createdAt
    doubleDiceValue
    duration
    game {
      createdAt
      gameType
      id
      isGameOver
      isGameStarted
      playerOneID
      playerTwoID
      statisticId
      updatedAt
      __typename
    }
    gameId
    gameType
    id
    numTurns
    reason
    scores {
      black
      white
      __typename
    }
    updatedAt
    winner {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    winnerId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSessionStatMutationVariables,
  APITypes.CreateSessionStatMutation
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
      gameType
      id
      isGameOver
      isGameStarted
      playerOneID
      playerTwoID
      statisticId
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
      country
      createdAt
      emoji
      id
      name
      profilePicColor
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
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    userTwo {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
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
    country
    createdAt
    emoji
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
    profilePicColor
    sessionsAsPlayerOne {
      nextToken
      __typename
    }
    sessionsAsPlayerTwo {
      nextToken
      __typename
    }
    sessionsWon {
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
    gameType
    id
    isGameOver
    isGameStarted
    playerOne {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    playerOneID
    playerTwo {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    playerTwoID
    statisticId
    statistics {
      bet
      createdAt
      doubleDiceValue
      duration
      gameId
      gameType
      id
      numTurns
      reason
      updatedAt
      winnerId
      __typename
    }
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
export const deleteSessionStat = /* GraphQL */ `mutation DeleteSessionStat(
  $condition: ModelSessionStatConditionInput
  $input: DeleteSessionStatInput!
) {
  deleteSessionStat(condition: $condition, input: $input) {
    bet
    createdAt
    doubleDiceValue
    duration
    game {
      createdAt
      gameType
      id
      isGameOver
      isGameStarted
      playerOneID
      playerTwoID
      statisticId
      updatedAt
      __typename
    }
    gameId
    gameType
    id
    numTurns
    reason
    scores {
      black
      white
      __typename
    }
    updatedAt
    winner {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    winnerId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSessionStatMutationVariables,
  APITypes.DeleteSessionStatMutation
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
      gameType
      id
      isGameOver
      isGameStarted
      playerOneID
      playerTwoID
      statisticId
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
      country
      createdAt
      emoji
      id
      name
      profilePicColor
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
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    userTwo {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
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
    country
    createdAt
    emoji
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
    profilePicColor
    sessionsAsPlayerOne {
      nextToken
      __typename
    }
    sessionsAsPlayerTwo {
      nextToken
      __typename
    }
    sessionsWon {
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
    gameType
    id
    isGameOver
    isGameStarted
    playerOne {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    playerOneID
    playerTwo {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    playerTwoID
    statisticId
    statistics {
      bet
      createdAt
      doubleDiceValue
      duration
      gameId
      gameType
      id
      numTurns
      reason
      updatedAt
      winnerId
      __typename
    }
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
export const updateSessionStat = /* GraphQL */ `mutation UpdateSessionStat(
  $condition: ModelSessionStatConditionInput
  $input: UpdateSessionStatInput!
) {
  updateSessionStat(condition: $condition, input: $input) {
    bet
    createdAt
    doubleDiceValue
    duration
    game {
      createdAt
      gameType
      id
      isGameOver
      isGameStarted
      playerOneID
      playerTwoID
      statisticId
      updatedAt
      __typename
    }
    gameId
    gameType
    id
    numTurns
    reason
    scores {
      black
      white
      __typename
    }
    updatedAt
    winner {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
      updatedAt
      __typename
    }
    winnerId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSessionStatMutationVariables,
  APITypes.UpdateSessionStatMutation
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
      gameType
      id
      isGameOver
      isGameStarted
      playerOneID
      playerTwoID
      statisticId
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
      country
      createdAt
      emoji
      id
      name
      profilePicColor
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
