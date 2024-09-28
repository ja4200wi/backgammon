/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getFriends = /* GraphQL */ `query GetFriends($id: ID!) {
  getFriends(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetFriendsQueryVariables,
  APITypes.GetFriendsQuery
>;
export const getPlayer = /* GraphQL */ `query GetPlayer($id: ID!) {
  getPlayer(id: $id) {
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
` as GeneratedQuery<APITypes.GetPlayerQueryVariables, APITypes.GetPlayerQuery>;
export const getSession = /* GraphQL */ `query GetSession($id: ID!) {
  getSession(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetSessionQueryVariables,
  APITypes.GetSessionQuery
>;
export const getSessionStat = /* GraphQL */ `query GetSessionStat($id: ID!) {
  getSessionStat(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetSessionStatQueryVariables,
  APITypes.GetSessionStatQuery
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
` as GeneratedQuery<APITypes.GetTurnsQueryVariables, APITypes.GetTurnsQuery>;
export const listFriends = /* GraphQL */ `query ListFriends(
  $filter: ModelFriendsFilterInput
  $limit: Int
  $nextToken: String
) {
  listFriends(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      id
      isConfirmed
      updatedAt
      userIdOne
      userIdTwo
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFriendsQueryVariables,
  APITypes.ListFriendsQuery
>;
export const listPlayers = /* GraphQL */ `query ListPlayers(
  $filter: ModelPlayerFilterInput
  $limit: Int
  $nextToken: String
) {
  listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      country
      createdAt
      emoji
      id
      name
      profilePicColor
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
export const listSessionStats = /* GraphQL */ `query ListSessionStats(
  $filter: ModelSessionStatFilterInput
  $limit: Int
  $nextToken: String
) {
  listSessionStats(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSessionStatsQueryVariables,
  APITypes.ListSessionStatsQuery
>;
export const listSessions = /* GraphQL */ `query ListSessions(
  $filter: ModelSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
