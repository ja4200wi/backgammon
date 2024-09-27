/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Friends = {
  __typename: "Friends",
  createdAt: string,
  id: string,
  isConfirmed?: boolean | null,
  updatedAt: string,
  userIdOne?: string | null,
  userIdTwo?: string | null,
  userOne?: Player | null,
  userTwo?: Player | null,
};

export type Player = {
  __typename: "Player",
  country?: string | null,
  createdAt: string,
  emoji?: string | null,
  friendsAsOne?: ModelFriendsConnection | null,
  friendsAsTwo?: ModelFriendsConnection | null,
  id: string,
  name?: string | null,
  profilePicColor?: string | null,
  sessionsAsPlayerOne?: ModelSessionConnection | null,
  sessionsAsPlayerTwo?: ModelSessionConnection | null,
  sessionsWon?: ModelSessionStatConnection | null,
  turnsMade?: ModelTurnsConnection | null,
  updatedAt: string,
};

export type ModelFriendsConnection = {
  __typename: "ModelFriendsConnection",
  items:  Array<Friends | null >,
  nextToken?: string | null,
};

export type ModelSessionConnection = {
  __typename: "ModelSessionConnection",
  items:  Array<Session | null >,
  nextToken?: string | null,
};

export type Session = {
  __typename: "Session",
  createdAt: string,
  gameType?: SessionGameType | null,
  id: string,
  isGameOver: boolean,
  playerOne?: Player | null,
  playerOneID?: string | null,
  playerTwo?: Player | null,
  playerTwoID?: string | null,
  statisticId?: string | null,
  statistics?: SessionStat | null,
  turns?: ModelTurnsConnection | null,
  updatedAt: string,
};

export enum SessionGameType {
  COMPUTER = "COMPUTER",
  ELO = "ELO",
  FRIENDLIST = "FRIENDLIST",
  RANDOM = "RANDOM",
}


export type SessionStat = {
  __typename: "SessionStat",
  bet?: number | null,
  createdAt: string,
  doubleDiceValue?: number | null,
  duration?: number | null,
  game?: Session | null,
  gameId: string,
  gameType?: SessionStatGameType | null,
  id: string,
  numTurns?: number | null,
  reason?: SessionStatReason | null,
  scores?: SessionStatScores | null,
  updatedAt: string,
  winner?: Player | null,
  winnerId?: string | null,
};

export enum SessionStatGameType {
  COMPUTER = "COMPUTER",
  ELO = "ELO",
  FRIENDLIST = "FRIENDLIST",
  RANDOM = "RANDOM",
}


export enum SessionStatReason {
  DOUBLE = "DOUBLE",
  GAME_OVER = "GAME_OVER",
  GIVE_UP = "GIVE_UP",
  TIMEOUT = "TIMEOUT",
}


export type SessionStatScores = {
  __typename: "SessionStatScores",
  black?: number | null,
  white?: number | null,
};

export type ModelTurnsConnection = {
  __typename: "ModelTurnsConnection",
  items:  Array<Turns | null >,
  nextToken?: string | null,
};

export type Turns = {
  __typename: "Turns",
  createdAt: string,
  diceForNextTurn?: Dice | null,
  game?: Session | null,
  gameId: string,
  moves?:  Array<Move | null > | null,
  player?: Player | null,
  playerColor?: TurnsPlayerColor | null,
  playerId?: string | null,
  turnNumber: number,
  type?: TurnsType | null,
  updatedAt: string,
};

export type Dice = {
  __typename: "Dice",
  dieOne?: number | null,
  dieTwo?: number | null,
};

export type Move = {
  __typename: "Move",
  from: number,
  to: number,
};

export enum TurnsPlayerColor {
  BLACK = "BLACK",
  WHITE = "WHITE",
}


export enum TurnsType {
  DOUBLE = "DOUBLE",
  GAME_OVER = "GAME_OVER",
  GIVE_UP = "GIVE_UP",
  INIT = "INIT",
  MOVE = "MOVE",
}


export type ModelSessionStatConnection = {
  __typename: "ModelSessionStatConnection",
  items:  Array<SessionStat | null >,
  nextToken?: string | null,
};

export type ModelFriendsFilterInput = {
  and?: Array< ModelFriendsFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  isConfirmed?: ModelBooleanInput | null,
  not?: ModelFriendsFilterInput | null,
  or?: Array< ModelFriendsFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
  userIdOne?: ModelIDInput | null,
  userIdTwo?: ModelIDInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelPlayerFilterInput = {
  and?: Array< ModelPlayerFilterInput | null > | null,
  country?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  emoji?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelPlayerFilterInput | null,
  or?: Array< ModelPlayerFilterInput | null > | null,
  profilePicColor?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPlayerConnection = {
  __typename: "ModelPlayerConnection",
  items:  Array<Player | null >,
  nextToken?: string | null,
};

export type ModelSessionStatFilterInput = {
  and?: Array< ModelSessionStatFilterInput | null > | null,
  bet?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  doubleDiceValue?: ModelIntInput | null,
  duration?: ModelIntInput | null,
  gameId?: ModelIDInput | null,
  gameType?: ModelSessionStatGameTypeInput | null,
  id?: ModelIDInput | null,
  not?: ModelSessionStatFilterInput | null,
  numTurns?: ModelIntInput | null,
  or?: Array< ModelSessionStatFilterInput | null > | null,
  reason?: ModelSessionStatReasonInput | null,
  updatedAt?: ModelStringInput | null,
  winnerId?: ModelIDInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelSessionStatGameTypeInput = {
  eq?: SessionStatGameType | null,
  ne?: SessionStatGameType | null,
};

export type ModelSessionStatReasonInput = {
  eq?: SessionStatReason | null,
  ne?: SessionStatReason | null,
};

export type ModelSessionFilterInput = {
  and?: Array< ModelSessionFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  gameType?: ModelSessionGameTypeInput | null,
  id?: ModelIDInput | null,
  isGameOver?: ModelBooleanInput | null,
  not?: ModelSessionFilterInput | null,
  or?: Array< ModelSessionFilterInput | null > | null,
  playerOneID?: ModelIDInput | null,
  playerTwoID?: ModelIDInput | null,
  statisticId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelSessionGameTypeInput = {
  eq?: SessionGameType | null,
  ne?: SessionGameType | null,
};

export type ModelTurnsFilterInput = {
  and?: Array< ModelTurnsFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  gameId?: ModelIDInput | null,
  id?: ModelIDInput | null,
  not?: ModelTurnsFilterInput | null,
  or?: Array< ModelTurnsFilterInput | null > | null,
  playerColor?: ModelTurnsPlayerColorInput | null,
  playerId?: ModelIDInput | null,
  turnNumber?: ModelIntInput | null,
  type?: ModelTurnsTypeInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelTurnsPlayerColorInput = {
  eq?: TurnsPlayerColor | null,
  ne?: TurnsPlayerColor | null,
};

export type ModelTurnsTypeInput = {
  eq?: TurnsType | null,
  ne?: TurnsType | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelIntKeyConditionInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
};

export type ModelFriendsConditionInput = {
  and?: Array< ModelFriendsConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  isConfirmed?: ModelBooleanInput | null,
  not?: ModelFriendsConditionInput | null,
  or?: Array< ModelFriendsConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
  userIdOne?: ModelIDInput | null,
  userIdTwo?: ModelIDInput | null,
};

export type CreateFriendsInput = {
  id?: string | null,
  isConfirmed?: boolean | null,
  userIdOne?: string | null,
  userIdTwo?: string | null,
};

export type ModelPlayerConditionInput = {
  and?: Array< ModelPlayerConditionInput | null > | null,
  country?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  emoji?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelPlayerConditionInput | null,
  or?: Array< ModelPlayerConditionInput | null > | null,
  profilePicColor?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePlayerInput = {
  country?: string | null,
  emoji?: string | null,
  id?: string | null,
  name?: string | null,
  profilePicColor?: string | null,
};

export type ModelSessionConditionInput = {
  and?: Array< ModelSessionConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  gameType?: ModelSessionGameTypeInput | null,
  isGameOver?: ModelBooleanInput | null,
  not?: ModelSessionConditionInput | null,
  or?: Array< ModelSessionConditionInput | null > | null,
  playerOneID?: ModelIDInput | null,
  playerTwoID?: ModelIDInput | null,
  statisticId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateSessionInput = {
  gameType?: SessionGameType | null,
  id?: string | null,
  isGameOver: boolean,
  playerOneID?: string | null,
  playerTwoID?: string | null,
  statisticId?: string | null,
};

export type ModelSessionStatConditionInput = {
  and?: Array< ModelSessionStatConditionInput | null > | null,
  bet?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  doubleDiceValue?: ModelIntInput | null,
  duration?: ModelIntInput | null,
  gameId?: ModelIDInput | null,
  gameType?: ModelSessionStatGameTypeInput | null,
  not?: ModelSessionStatConditionInput | null,
  numTurns?: ModelIntInput | null,
  or?: Array< ModelSessionStatConditionInput | null > | null,
  reason?: ModelSessionStatReasonInput | null,
  updatedAt?: ModelStringInput | null,
  winnerId?: ModelIDInput | null,
};

export type CreateSessionStatInput = {
  bet?: number | null,
  doubleDiceValue?: number | null,
  duration?: number | null,
  gameId: string,
  gameType?: SessionStatGameType | null,
  id?: string | null,
  numTurns?: number | null,
  reason?: SessionStatReason | null,
  scores?: SessionStatScoresInput | null,
  winnerId?: string | null,
};

export type SessionStatScoresInput = {
  black?: number | null,
  white?: number | null,
};

export type ModelTurnsConditionInput = {
  and?: Array< ModelTurnsConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelTurnsConditionInput | null,
  or?: Array< ModelTurnsConditionInput | null > | null,
  playerColor?: ModelTurnsPlayerColorInput | null,
  playerId?: ModelIDInput | null,
  type?: ModelTurnsTypeInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTurnsInput = {
  diceForNextTurn?: DiceInput | null,
  gameId: string,
  moves?: Array< MoveInput | null > | null,
  playerColor?: TurnsPlayerColor | null,
  playerId?: string | null,
  turnNumber: number,
  type?: TurnsType | null,
};

export type DiceInput = {
  dieOne?: number | null,
  dieTwo?: number | null,
};

export type MoveInput = {
  from: number,
  to: number,
};

export type DeleteFriendsInput = {
  id: string,
};

export type DeletePlayerInput = {
  id: string,
};

export type DeleteSessionInput = {
  id: string,
};

export type DeleteSessionStatInput = {
  id: string,
};

export type DeleteTurnsInput = {
  gameId: string,
  turnNumber: number,
};

export enum MakeTurnType {
  DOUBLE = "DOUBLE",
  GAME_OVER = "GAME_OVER",
  GIVE_UP = "GIVE_UP",
  INIT = "INIT",
  MOVE = "MOVE",
}


export type UpdateFriendsInput = {
  id: string,
  isConfirmed?: boolean | null,
  userIdOne?: string | null,
  userIdTwo?: string | null,
};

export type UpdatePlayerInput = {
  country?: string | null,
  emoji?: string | null,
  id: string,
  name?: string | null,
  profilePicColor?: string | null,
};

export type UpdateSessionInput = {
  gameType?: SessionGameType | null,
  id: string,
  isGameOver?: boolean | null,
  playerOneID?: string | null,
  playerTwoID?: string | null,
  statisticId?: string | null,
};

export type UpdateSessionStatInput = {
  bet?: number | null,
  doubleDiceValue?: number | null,
  duration?: number | null,
  gameId?: string | null,
  gameType?: SessionStatGameType | null,
  id: string,
  numTurns?: number | null,
  reason?: SessionStatReason | null,
  scores?: SessionStatScoresInput | null,
  winnerId?: string | null,
};

export type UpdateTurnsInput = {
  diceForNextTurn?: DiceInput | null,
  gameId: string,
  moves?: Array< MoveInput | null > | null,
  playerColor?: TurnsPlayerColor | null,
  playerId?: string | null,
  turnNumber: number,
  type?: TurnsType | null,
};

export type ModelSubscriptionFriendsFilterInput = {
  and?: Array< ModelSubscriptionFriendsFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isConfirmed?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionFriendsFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  userIdOne?: ModelSubscriptionIDInput | null,
  userIdTwo?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionPlayerFilterInput = {
  and?: Array< ModelSubscriptionPlayerFilterInput | null > | null,
  country?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  emoji?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPlayerFilterInput | null > | null,
  profilePicColor?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionSessionFilterInput = {
  and?: Array< ModelSubscriptionSessionFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  gameType?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  isGameOver?: ModelSubscriptionBooleanInput | null,
  or?: Array< ModelSubscriptionSessionFilterInput | null > | null,
  playerOneID?: ModelSubscriptionIDInput | null,
  playerTwoID?: ModelSubscriptionIDInput | null,
  statisticId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionSessionStatFilterInput = {
  and?: Array< ModelSubscriptionSessionStatFilterInput | null > | null,
  bet?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  doubleDiceValue?: ModelSubscriptionIntInput | null,
  duration?: ModelSubscriptionIntInput | null,
  gameId?: ModelSubscriptionIDInput | null,
  gameType?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  numTurns?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionSessionStatFilterInput | null > | null,
  reason?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  winnerId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionTurnsFilterInput = {
  and?: Array< ModelSubscriptionTurnsFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  gameId?: ModelSubscriptionIDInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionTurnsFilterInput | null > | null,
  playerColor?: ModelSubscriptionStringInput | null,
  playerId?: ModelSubscriptionIDInput | null,
  turnNumber?: ModelSubscriptionIntInput | null,
  type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GetFriendsQueryVariables = {
  id: string,
};

export type GetFriendsQuery = {
  getFriends?:  {
    __typename: "Friends",
    createdAt: string,
    id: string,
    isConfirmed?: boolean | null,
    updatedAt: string,
    userIdOne?: string | null,
    userIdTwo?: string | null,
    userOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    userTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
  } | null,
};

export type GetPlayerQueryVariables = {
  id: string,
};

export type GetPlayerQuery = {
  getPlayer?:  {
    __typename: "Player",
    country?: string | null,
    createdAt: string,
    emoji?: string | null,
    friendsAsOne?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    friendsAsTwo?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    name?: string | null,
    profilePicColor?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsWon?:  {
      __typename: "ModelSessionStatConnection",
      nextToken?: string | null,
    } | null,
    turnsMade?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetSessionQueryVariables = {
  id: string,
};

export type GetSessionQuery = {
  getSession?:  {
    __typename: "Session",
    createdAt: string,
    gameType?: SessionGameType | null,
    id: string,
    isGameOver: boolean,
    playerOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    statisticId?: string | null,
    statistics?:  {
      __typename: "SessionStat",
      bet?: number | null,
      createdAt: string,
      doubleDiceValue?: number | null,
      duration?: number | null,
      gameId: string,
      gameType?: SessionStatGameType | null,
      id: string,
      numTurns?: number | null,
      reason?: SessionStatReason | null,
      updatedAt: string,
      winnerId?: string | null,
    } | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type GetSessionStatQueryVariables = {
  id: string,
};

export type GetSessionStatQuery = {
  getSessionStat?:  {
    __typename: "SessionStat",
    bet?: number | null,
    createdAt: string,
    doubleDiceValue?: number | null,
    duration?: number | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    gameType?: SessionStatGameType | null,
    id: string,
    numTurns?: number | null,
    reason?: SessionStatReason | null,
    scores?:  {
      __typename: "SessionStatScores",
      black?: number | null,
      white?: number | null,
    } | null,
    updatedAt: string,
    winner?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    winnerId?: string | null,
  } | null,
};

export type GetTurnsQueryVariables = {
  gameId: string,
  turnNumber: number,
};

export type GetTurnsQuery = {
  getTurns?:  {
    __typename: "Turns",
    createdAt: string,
    diceForNextTurn?:  {
      __typename: "Dice",
      dieOne?: number | null,
      dieTwo?: number | null,
    } | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    moves?:  Array< {
      __typename: "Move",
      from: number,
      to: number,
    } | null > | null,
    player?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};

export type ListFriendsQueryVariables = {
  filter?: ModelFriendsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFriendsQuery = {
  listFriends?:  {
    __typename: "ModelFriendsConnection",
    items:  Array< {
      __typename: "Friends",
      createdAt: string,
      id: string,
      isConfirmed?: boolean | null,
      updatedAt: string,
      userIdOne?: string | null,
      userIdTwo?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListPlayersQueryVariables = {
  filter?: ModelPlayerFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPlayersQuery = {
  listPlayers?:  {
    __typename: "ModelPlayerConnection",
    items:  Array< {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListSessionStatsQueryVariables = {
  filter?: ModelSessionStatFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSessionStatsQuery = {
  listSessionStats?:  {
    __typename: "ModelSessionStatConnection",
    items:  Array< {
      __typename: "SessionStat",
      bet?: number | null,
      createdAt: string,
      doubleDiceValue?: number | null,
      duration?: number | null,
      gameId: string,
      gameType?: SessionStatGameType | null,
      id: string,
      numTurns?: number | null,
      reason?: SessionStatReason | null,
      updatedAt: string,
      winnerId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListSessionsQueryVariables = {
  filter?: ModelSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSessionsQuery = {
  listSessions?:  {
    __typename: "ModelSessionConnection",
    items:  Array< {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTurnsQueryVariables = {
  filter?: ModelTurnsFilterInput | null,
  gameId?: string | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
  turnNumber?: ModelIntKeyConditionInput | null,
};

export type ListTurnsQuery = {
  listTurns?:  {
    __typename: "ModelTurnsConnection",
    items:  Array< {
      __typename: "Turns",
      createdAt: string,
      gameId: string,
      playerColor?: TurnsPlayerColor | null,
      playerId?: string | null,
      turnNumber: number,
      type?: TurnsType | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateFriendsMutationVariables = {
  condition?: ModelFriendsConditionInput | null,
  input: CreateFriendsInput,
};

export type CreateFriendsMutation = {
  createFriends?:  {
    __typename: "Friends",
    createdAt: string,
    id: string,
    isConfirmed?: boolean | null,
    updatedAt: string,
    userIdOne?: string | null,
    userIdTwo?: string | null,
    userOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    userTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
  } | null,
};

export type CreatePlayerMutationVariables = {
  condition?: ModelPlayerConditionInput | null,
  input: CreatePlayerInput,
};

export type CreatePlayerMutation = {
  createPlayer?:  {
    __typename: "Player",
    country?: string | null,
    createdAt: string,
    emoji?: string | null,
    friendsAsOne?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    friendsAsTwo?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    name?: string | null,
    profilePicColor?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsWon?:  {
      __typename: "ModelSessionStatConnection",
      nextToken?: string | null,
    } | null,
    turnsMade?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateSessionMutationVariables = {
  condition?: ModelSessionConditionInput | null,
  input: CreateSessionInput,
};

export type CreateSessionMutation = {
  createSession?:  {
    __typename: "Session",
    createdAt: string,
    gameType?: SessionGameType | null,
    id: string,
    isGameOver: boolean,
    playerOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    statisticId?: string | null,
    statistics?:  {
      __typename: "SessionStat",
      bet?: number | null,
      createdAt: string,
      doubleDiceValue?: number | null,
      duration?: number | null,
      gameId: string,
      gameType?: SessionStatGameType | null,
      id: string,
      numTurns?: number | null,
      reason?: SessionStatReason | null,
      updatedAt: string,
      winnerId?: string | null,
    } | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreateSessionStatMutationVariables = {
  condition?: ModelSessionStatConditionInput | null,
  input: CreateSessionStatInput,
};

export type CreateSessionStatMutation = {
  createSessionStat?:  {
    __typename: "SessionStat",
    bet?: number | null,
    createdAt: string,
    doubleDiceValue?: number | null,
    duration?: number | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    gameType?: SessionStatGameType | null,
    id: string,
    numTurns?: number | null,
    reason?: SessionStatReason | null,
    scores?:  {
      __typename: "SessionStatScores",
      black?: number | null,
      white?: number | null,
    } | null,
    updatedAt: string,
    winner?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    winnerId?: string | null,
  } | null,
};

export type CreateTurnsMutationVariables = {
  condition?: ModelTurnsConditionInput | null,
  input: CreateTurnsInput,
};

export type CreateTurnsMutation = {
  createTurns?:  {
    __typename: "Turns",
    createdAt: string,
    diceForNextTurn?:  {
      __typename: "Dice",
      dieOne?: number | null,
      dieTwo?: number | null,
    } | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    moves?:  Array< {
      __typename: "Move",
      from: number,
      to: number,
    } | null > | null,
    player?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};

export type DeleteFriendsMutationVariables = {
  condition?: ModelFriendsConditionInput | null,
  input: DeleteFriendsInput,
};

export type DeleteFriendsMutation = {
  deleteFriends?:  {
    __typename: "Friends",
    createdAt: string,
    id: string,
    isConfirmed?: boolean | null,
    updatedAt: string,
    userIdOne?: string | null,
    userIdTwo?: string | null,
    userOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    userTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
  } | null,
};

export type DeletePlayerMutationVariables = {
  condition?: ModelPlayerConditionInput | null,
  input: DeletePlayerInput,
};

export type DeletePlayerMutation = {
  deletePlayer?:  {
    __typename: "Player",
    country?: string | null,
    createdAt: string,
    emoji?: string | null,
    friendsAsOne?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    friendsAsTwo?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    name?: string | null,
    profilePicColor?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsWon?:  {
      __typename: "ModelSessionStatConnection",
      nextToken?: string | null,
    } | null,
    turnsMade?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteSessionMutationVariables = {
  condition?: ModelSessionConditionInput | null,
  input: DeleteSessionInput,
};

export type DeleteSessionMutation = {
  deleteSession?:  {
    __typename: "Session",
    createdAt: string,
    gameType?: SessionGameType | null,
    id: string,
    isGameOver: boolean,
    playerOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    statisticId?: string | null,
    statistics?:  {
      __typename: "SessionStat",
      bet?: number | null,
      createdAt: string,
      doubleDiceValue?: number | null,
      duration?: number | null,
      gameId: string,
      gameType?: SessionStatGameType | null,
      id: string,
      numTurns?: number | null,
      reason?: SessionStatReason | null,
      updatedAt: string,
      winnerId?: string | null,
    } | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteSessionStatMutationVariables = {
  condition?: ModelSessionStatConditionInput | null,
  input: DeleteSessionStatInput,
};

export type DeleteSessionStatMutation = {
  deleteSessionStat?:  {
    __typename: "SessionStat",
    bet?: number | null,
    createdAt: string,
    doubleDiceValue?: number | null,
    duration?: number | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    gameType?: SessionStatGameType | null,
    id: string,
    numTurns?: number | null,
    reason?: SessionStatReason | null,
    scores?:  {
      __typename: "SessionStatScores",
      black?: number | null,
      white?: number | null,
    } | null,
    updatedAt: string,
    winner?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    winnerId?: string | null,
  } | null,
};

export type DeleteTurnsMutationVariables = {
  condition?: ModelTurnsConditionInput | null,
  input: DeleteTurnsInput,
};

export type DeleteTurnsMutation = {
  deleteTurns?:  {
    __typename: "Turns",
    createdAt: string,
    diceForNextTurn?:  {
      __typename: "Dice",
      dieOne?: number | null,
      dieTwo?: number | null,
    } | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    moves?:  Array< {
      __typename: "Move",
      from: number,
      to: number,
    } | null > | null,
    player?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};

export type JoinGameMutationVariables = {
  gameId: string,
  userId: string,
};

export type JoinGameMutation = {
  joinGame?: string | null,
};

export type MakeTurnMutationVariables = {
  gameId: string,
  moves: string,
  type?: MakeTurnType | null,
  userId: string,
};

export type MakeTurnMutation = {
  makeTurn?:  {
    __typename: "Dice",
    dieOne?: number | null,
    dieTwo?: number | null,
  } | null,
};

export type UpdateFriendsMutationVariables = {
  condition?: ModelFriendsConditionInput | null,
  input: UpdateFriendsInput,
};

export type UpdateFriendsMutation = {
  updateFriends?:  {
    __typename: "Friends",
    createdAt: string,
    id: string,
    isConfirmed?: boolean | null,
    updatedAt: string,
    userIdOne?: string | null,
    userIdTwo?: string | null,
    userOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    userTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
  } | null,
};

export type UpdatePlayerMutationVariables = {
  condition?: ModelPlayerConditionInput | null,
  input: UpdatePlayerInput,
};

export type UpdatePlayerMutation = {
  updatePlayer?:  {
    __typename: "Player",
    country?: string | null,
    createdAt: string,
    emoji?: string | null,
    friendsAsOne?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    friendsAsTwo?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    name?: string | null,
    profilePicColor?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsWon?:  {
      __typename: "ModelSessionStatConnection",
      nextToken?: string | null,
    } | null,
    turnsMade?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateSessionMutationVariables = {
  condition?: ModelSessionConditionInput | null,
  input: UpdateSessionInput,
};

export type UpdateSessionMutation = {
  updateSession?:  {
    __typename: "Session",
    createdAt: string,
    gameType?: SessionGameType | null,
    id: string,
    isGameOver: boolean,
    playerOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    statisticId?: string | null,
    statistics?:  {
      __typename: "SessionStat",
      bet?: number | null,
      createdAt: string,
      doubleDiceValue?: number | null,
      duration?: number | null,
      gameId: string,
      gameType?: SessionStatGameType | null,
      id: string,
      numTurns?: number | null,
      reason?: SessionStatReason | null,
      updatedAt: string,
      winnerId?: string | null,
    } | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateSessionStatMutationVariables = {
  condition?: ModelSessionStatConditionInput | null,
  input: UpdateSessionStatInput,
};

export type UpdateSessionStatMutation = {
  updateSessionStat?:  {
    __typename: "SessionStat",
    bet?: number | null,
    createdAt: string,
    doubleDiceValue?: number | null,
    duration?: number | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    gameType?: SessionStatGameType | null,
    id: string,
    numTurns?: number | null,
    reason?: SessionStatReason | null,
    scores?:  {
      __typename: "SessionStatScores",
      black?: number | null,
      white?: number | null,
    } | null,
    updatedAt: string,
    winner?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    winnerId?: string | null,
  } | null,
};

export type UpdateTurnsMutationVariables = {
  condition?: ModelTurnsConditionInput | null,
  input: UpdateTurnsInput,
};

export type UpdateTurnsMutation = {
  updateTurns?:  {
    __typename: "Turns",
    createdAt: string,
    diceForNextTurn?:  {
      __typename: "Dice",
      dieOne?: number | null,
      dieTwo?: number | null,
    } | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    moves?:  Array< {
      __typename: "Move",
      from: number,
      to: number,
    } | null > | null,
    player?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};

export type OnCreateFriendsSubscriptionVariables = {
  filter?: ModelSubscriptionFriendsFilterInput | null,
};

export type OnCreateFriendsSubscription = {
  onCreateFriends?:  {
    __typename: "Friends",
    createdAt: string,
    id: string,
    isConfirmed?: boolean | null,
    updatedAt: string,
    userIdOne?: string | null,
    userIdTwo?: string | null,
    userOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    userTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
  } | null,
};

export type OnCreatePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
};

export type OnCreatePlayerSubscription = {
  onCreatePlayer?:  {
    __typename: "Player",
    country?: string | null,
    createdAt: string,
    emoji?: string | null,
    friendsAsOne?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    friendsAsTwo?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    name?: string | null,
    profilePicColor?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsWon?:  {
      __typename: "ModelSessionStatConnection",
      nextToken?: string | null,
    } | null,
    turnsMade?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnCreateSessionSubscription = {
  onCreateSession?:  {
    __typename: "Session",
    createdAt: string,
    gameType?: SessionGameType | null,
    id: string,
    isGameOver: boolean,
    playerOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    statisticId?: string | null,
    statistics?:  {
      __typename: "SessionStat",
      bet?: number | null,
      createdAt: string,
      doubleDiceValue?: number | null,
      duration?: number | null,
      gameId: string,
      gameType?: SessionStatGameType | null,
      id: string,
      numTurns?: number | null,
      reason?: SessionStatReason | null,
      updatedAt: string,
      winnerId?: string | null,
    } | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreateSessionStatSubscriptionVariables = {
  filter?: ModelSubscriptionSessionStatFilterInput | null,
};

export type OnCreateSessionStatSubscription = {
  onCreateSessionStat?:  {
    __typename: "SessionStat",
    bet?: number | null,
    createdAt: string,
    doubleDiceValue?: number | null,
    duration?: number | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    gameType?: SessionStatGameType | null,
    id: string,
    numTurns?: number | null,
    reason?: SessionStatReason | null,
    scores?:  {
      __typename: "SessionStatScores",
      black?: number | null,
      white?: number | null,
    } | null,
    updatedAt: string,
    winner?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    winnerId?: string | null,
  } | null,
};

export type OnCreateTurnsSubscriptionVariables = {
  filter?: ModelSubscriptionTurnsFilterInput | null,
};

export type OnCreateTurnsSubscription = {
  onCreateTurns?:  {
    __typename: "Turns",
    createdAt: string,
    diceForNextTurn?:  {
      __typename: "Dice",
      dieOne?: number | null,
      dieTwo?: number | null,
    } | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    moves?:  Array< {
      __typename: "Move",
      from: number,
      to: number,
    } | null > | null,
    player?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteFriendsSubscriptionVariables = {
  filter?: ModelSubscriptionFriendsFilterInput | null,
};

export type OnDeleteFriendsSubscription = {
  onDeleteFriends?:  {
    __typename: "Friends",
    createdAt: string,
    id: string,
    isConfirmed?: boolean | null,
    updatedAt: string,
    userIdOne?: string | null,
    userIdTwo?: string | null,
    userOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    userTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
  } | null,
};

export type OnDeletePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
};

export type OnDeletePlayerSubscription = {
  onDeletePlayer?:  {
    __typename: "Player",
    country?: string | null,
    createdAt: string,
    emoji?: string | null,
    friendsAsOne?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    friendsAsTwo?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    name?: string | null,
    profilePicColor?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsWon?:  {
      __typename: "ModelSessionStatConnection",
      nextToken?: string | null,
    } | null,
    turnsMade?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnDeleteSessionSubscription = {
  onDeleteSession?:  {
    __typename: "Session",
    createdAt: string,
    gameType?: SessionGameType | null,
    id: string,
    isGameOver: boolean,
    playerOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    statisticId?: string | null,
    statistics?:  {
      __typename: "SessionStat",
      bet?: number | null,
      createdAt: string,
      doubleDiceValue?: number | null,
      duration?: number | null,
      gameId: string,
      gameType?: SessionStatGameType | null,
      id: string,
      numTurns?: number | null,
      reason?: SessionStatReason | null,
      updatedAt: string,
      winnerId?: string | null,
    } | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteSessionStatSubscriptionVariables = {
  filter?: ModelSubscriptionSessionStatFilterInput | null,
};

export type OnDeleteSessionStatSubscription = {
  onDeleteSessionStat?:  {
    __typename: "SessionStat",
    bet?: number | null,
    createdAt: string,
    doubleDiceValue?: number | null,
    duration?: number | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    gameType?: SessionStatGameType | null,
    id: string,
    numTurns?: number | null,
    reason?: SessionStatReason | null,
    scores?:  {
      __typename: "SessionStatScores",
      black?: number | null,
      white?: number | null,
    } | null,
    updatedAt: string,
    winner?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    winnerId?: string | null,
  } | null,
};

export type OnDeleteTurnsSubscriptionVariables = {
  filter?: ModelSubscriptionTurnsFilterInput | null,
};

export type OnDeleteTurnsSubscription = {
  onDeleteTurns?:  {
    __typename: "Turns",
    createdAt: string,
    diceForNextTurn?:  {
      __typename: "Dice",
      dieOne?: number | null,
      dieTwo?: number | null,
    } | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    moves?:  Array< {
      __typename: "Move",
      from: number,
      to: number,
    } | null > | null,
    player?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateFriendsSubscriptionVariables = {
  filter?: ModelSubscriptionFriendsFilterInput | null,
};

export type OnUpdateFriendsSubscription = {
  onUpdateFriends?:  {
    __typename: "Friends",
    createdAt: string,
    id: string,
    isConfirmed?: boolean | null,
    updatedAt: string,
    userIdOne?: string | null,
    userIdTwo?: string | null,
    userOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    userTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
  } | null,
};

export type OnUpdatePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
};

export type OnUpdatePlayerSubscription = {
  onUpdatePlayer?:  {
    __typename: "Player",
    country?: string | null,
    createdAt: string,
    emoji?: string | null,
    friendsAsOne?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    friendsAsTwo?:  {
      __typename: "ModelFriendsConnection",
      nextToken?: string | null,
    } | null,
    id: string,
    name?: string | null,
    profilePicColor?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsWon?:  {
      __typename: "ModelSessionStatConnection",
      nextToken?: string | null,
    } | null,
    turnsMade?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnUpdateSessionSubscription = {
  onUpdateSession?:  {
    __typename: "Session",
    createdAt: string,
    gameType?: SessionGameType | null,
    id: string,
    isGameOver: boolean,
    playerOne?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    statisticId?: string | null,
    statistics?:  {
      __typename: "SessionStat",
      bet?: number | null,
      createdAt: string,
      doubleDiceValue?: number | null,
      duration?: number | null,
      gameId: string,
      gameType?: SessionStatGameType | null,
      id: string,
      numTurns?: number | null,
      reason?: SessionStatReason | null,
      updatedAt: string,
      winnerId?: string | null,
    } | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateSessionStatSubscriptionVariables = {
  filter?: ModelSubscriptionSessionStatFilterInput | null,
};

export type OnUpdateSessionStatSubscription = {
  onUpdateSessionStat?:  {
    __typename: "SessionStat",
    bet?: number | null,
    createdAt: string,
    doubleDiceValue?: number | null,
    duration?: number | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    gameType?: SessionStatGameType | null,
    id: string,
    numTurns?: number | null,
    reason?: SessionStatReason | null,
    scores?:  {
      __typename: "SessionStatScores",
      black?: number | null,
      white?: number | null,
    } | null,
    updatedAt: string,
    winner?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    winnerId?: string | null,
  } | null,
};

export type OnUpdateTurnsSubscriptionVariables = {
  filter?: ModelSubscriptionTurnsFilterInput | null,
};

export type OnUpdateTurnsSubscription = {
  onUpdateTurns?:  {
    __typename: "Turns",
    createdAt: string,
    diceForNextTurn?:  {
      __typename: "Dice",
      dieOne?: number | null,
      dieTwo?: number | null,
    } | null,
    game?:  {
      __typename: "Session",
      createdAt: string,
      gameType?: SessionGameType | null,
      id: string,
      isGameOver: boolean,
      playerOneID?: string | null,
      playerTwoID?: string | null,
      statisticId?: string | null,
      updatedAt: string,
    } | null,
    gameId: string,
    moves?:  Array< {
      __typename: "Move",
      from: number,
      to: number,
    } | null > | null,
    player?:  {
      __typename: "Player",
      country?: string | null,
      createdAt: string,
      emoji?: string | null,
      id: string,
      name?: string | null,
      profilePicColor?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};
