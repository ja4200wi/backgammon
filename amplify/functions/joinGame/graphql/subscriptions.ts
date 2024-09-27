/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateFriends = /* GraphQL */ `subscription OnCreateFriends($filter: ModelSubscriptionFriendsFilterInput) {
  onCreateFriends(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateFriendsSubscriptionVariables,
  APITypes.OnCreateFriendsSubscription
>;
export const onCreatePlayer = /* GraphQL */ `subscription OnCreatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
  onCreatePlayer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePlayerSubscriptionVariables,
  APITypes.OnCreatePlayerSubscription
>;
export const onCreateSession = /* GraphQL */ `subscription OnCreateSession($filter: ModelSubscriptionSessionFilterInput) {
  onCreateSession(filter: $filter) {
    createdAt
    gameType
    id
    isGameOver
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
` as GeneratedSubscription<
  APITypes.OnCreateSessionSubscriptionVariables,
  APITypes.OnCreateSessionSubscription
>;
export const onCreateSessionStat = /* GraphQL */ `subscription OnCreateSessionStat(
  $filter: ModelSubscriptionSessionStatFilterInput
) {
  onCreateSessionStat(filter: $filter) {
    bet
    createdAt
    doubleDiceValue
    duration
    game {
      createdAt
      gameType
      id
      isGameOver
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
` as GeneratedSubscription<
  APITypes.OnCreateSessionStatSubscriptionVariables,
  APITypes.OnCreateSessionStatSubscription
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
      gameType
      id
      isGameOver
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
` as GeneratedSubscription<
  APITypes.OnCreateTurnsSubscriptionVariables,
  APITypes.OnCreateTurnsSubscription
>;
export const onDeleteFriends = /* GraphQL */ `subscription OnDeleteFriends($filter: ModelSubscriptionFriendsFilterInput) {
  onDeleteFriends(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteFriendsSubscriptionVariables,
  APITypes.OnDeleteFriendsSubscription
>;
export const onDeletePlayer = /* GraphQL */ `subscription OnDeletePlayer($filter: ModelSubscriptionPlayerFilterInput) {
  onDeletePlayer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePlayerSubscriptionVariables,
  APITypes.OnDeletePlayerSubscription
>;
export const onDeleteSession = /* GraphQL */ `subscription OnDeleteSession($filter: ModelSubscriptionSessionFilterInput) {
  onDeleteSession(filter: $filter) {
    createdAt
    gameType
    id
    isGameOver
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
` as GeneratedSubscription<
  APITypes.OnDeleteSessionSubscriptionVariables,
  APITypes.OnDeleteSessionSubscription
>;
export const onDeleteSessionStat = /* GraphQL */ `subscription OnDeleteSessionStat(
  $filter: ModelSubscriptionSessionStatFilterInput
) {
  onDeleteSessionStat(filter: $filter) {
    bet
    createdAt
    doubleDiceValue
    duration
    game {
      createdAt
      gameType
      id
      isGameOver
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
` as GeneratedSubscription<
  APITypes.OnDeleteSessionStatSubscriptionVariables,
  APITypes.OnDeleteSessionStatSubscription
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
      gameType
      id
      isGameOver
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
` as GeneratedSubscription<
  APITypes.OnDeleteTurnsSubscriptionVariables,
  APITypes.OnDeleteTurnsSubscription
>;
export const onUpdateFriends = /* GraphQL */ `subscription OnUpdateFriends($filter: ModelSubscriptionFriendsFilterInput) {
  onUpdateFriends(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateFriendsSubscriptionVariables,
  APITypes.OnUpdateFriendsSubscription
>;
export const onUpdatePlayer = /* GraphQL */ `subscription OnUpdatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
  onUpdatePlayer(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePlayerSubscriptionVariables,
  APITypes.OnUpdatePlayerSubscription
>;
export const onUpdateSession = /* GraphQL */ `subscription OnUpdateSession($filter: ModelSubscriptionSessionFilterInput) {
  onUpdateSession(filter: $filter) {
    createdAt
    gameType
    id
    isGameOver
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
` as GeneratedSubscription<
  APITypes.OnUpdateSessionSubscriptionVariables,
  APITypes.OnUpdateSessionSubscription
>;
export const onUpdateSessionStat = /* GraphQL */ `subscription OnUpdateSessionStat(
  $filter: ModelSubscriptionSessionStatFilterInput
) {
  onUpdateSessionStat(filter: $filter) {
    bet
    createdAt
    doubleDiceValue
    duration
    game {
      createdAt
      gameType
      id
      isGameOver
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
` as GeneratedSubscription<
  APITypes.OnUpdateSessionStatSubscriptionVariables,
  APITypes.OnUpdateSessionStatSubscription
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
      gameType
      id
      isGameOver
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
` as GeneratedSubscription<
  APITypes.OnUpdateTurnsSubscriptionVariables,
  APITypes.OnUpdateTurnsSubscription
>;
