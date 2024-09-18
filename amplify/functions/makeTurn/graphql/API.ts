/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Player = {
  __typename: "Player",
  createdAt: string,
  id: string,
  name?: string | null,
  sessionsAsPlayerOne?: ModelSessionConnection | null,
  sessionsAsPlayerTwo?: ModelSessionConnection | null,
  turnsMade?: ModelTurnsConnection | null,
  updatedAt: string,
};

export type ModelSessionConnection = {
  __typename: "ModelSessionConnection",
  items:  Array<Session | null >,
  nextToken?: string | null,
};

export type Session = {
  __typename: "Session",
  createdAt: string,
  id: string,
  playerOne?: Player | null,
  playerOneID?: string | null,
  playerTwo?: Player | null,
  playerTwoID?: string | null,
  turns?: ModelTurnsConnection | null,
  updatedAt: string,
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
  GIVE_UP = "GIVE_UP",
  INIT = "INIT",
  MOVE = "MOVE",
}


export type ModelPlayerFilterInput = {
  and?: Array< ModelPlayerFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelPlayerFilterInput | null,
  or?: Array< ModelPlayerFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
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

export type ModelPlayerConnection = {
  __typename: "ModelPlayerConnection",
  items:  Array<Player | null >,
  nextToken?: string | null,
};

export type ModelSessionFilterInput = {
  and?: Array< ModelSessionFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  not?: ModelSessionFilterInput | null,
  or?: Array< ModelSessionFilterInput | null > | null,
  playerOneID?: ModelIDInput | null,
  playerTwoID?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
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

export type ModelPlayerConditionInput = {
  and?: Array< ModelPlayerConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelPlayerConditionInput | null,
  or?: Array< ModelPlayerConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreatePlayerInput = {
  id?: string | null,
  name?: string | null,
};

export type ModelSessionConditionInput = {
  and?: Array< ModelSessionConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  not?: ModelSessionConditionInput | null,
  or?: Array< ModelSessionConditionInput | null > | null,
  playerOneID?: ModelIDInput | null,
  playerTwoID?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateSessionInput = {
  id?: string | null,
  playerOneID?: string | null,
  playerTwoID?: string | null,
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

export type DeletePlayerInput = {
  id: string,
};

export type DeleteSessionInput = {
  id: string,
};

export type DeleteTurnsInput = {
  gameId: string,
  turnNumber: number,
};

export enum MakeTurnType {
  DOUBLE = "DOUBLE",
  GIVE_UP = "GIVE_UP",
  INIT = "INIT",
  MOVE = "MOVE",
}


export type UpdatePlayerInput = {
  id: string,
  name?: string | null,
};

export type UpdateSessionInput = {
  id: string,
  playerOneID?: string | null,
  playerTwoID?: string | null,
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

export type ModelSubscriptionPlayerFilterInput = {
  and?: Array< ModelSubscriptionPlayerFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPlayerFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
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

export type ModelSubscriptionSessionFilterInput = {
  and?: Array< ModelSubscriptionSessionFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  or?: Array< ModelSubscriptionSessionFilterInput | null > | null,
  playerOneID?: ModelSubscriptionIDInput | null,
  playerTwoID?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
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

export type GetPlayerQueryVariables = {
  id: string,
};

export type GetPlayerQuery = {
  getPlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      id: string,
      playerOneID?: string | null,
      playerTwoID?: string | null,
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
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
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
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
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
      id: string,
      playerOneID?: string | null,
      playerTwoID?: string | null,
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

export type CreatePlayerMutationVariables = {
  condition?: ModelPlayerConditionInput | null,
  input: CreatePlayerInput,
};

export type CreatePlayerMutation = {
  createPlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      id: string,
      playerOneID?: string | null,
      playerTwoID?: string | null,
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
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};

export type DeletePlayerMutationVariables = {
  condition?: ModelPlayerConditionInput | null,
  input: DeletePlayerInput,
};

export type DeletePlayerMutation = {
  deletePlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      id: string,
      playerOneID?: string | null,
      playerTwoID?: string | null,
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
      createdAt: string,
      id: string,
      name?: string | null,
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

export type UpdatePlayerMutationVariables = {
  condition?: ModelPlayerConditionInput | null,
  input: UpdatePlayerInput,
};

export type UpdatePlayerMutation = {
  updatePlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      id: string,
      playerOneID?: string | null,
      playerTwoID?: string | null,
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
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
};

export type OnCreatePlayerSubscription = {
  onCreatePlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      id: string,
      playerOneID?: string | null,
      playerTwoID?: string | null,
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
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
};

export type OnDeletePlayerSubscription = {
  onDeletePlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      id: string,
      playerOneID?: string | null,
      playerTwoID?: string | null,
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
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
};

export type OnUpdatePlayerSubscription = {
  onUpdatePlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  {
      __typename: "ModelTurnsConnection",
      nextToken?: string | null,
    } | null,
    updatedAt: string,
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
      id: string,
      playerOneID?: string | null,
      playerTwoID?: string | null,
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
      createdAt: string,
      id: string,
      name?: string | null,
      updatedAt: string,
    } | null,
    playerColor?: TurnsPlayerColor | null,
    playerId?: string | null,
    turnNumber: number,
    type?: TurnsType | null,
    updatedAt: string,
  } | null,
};
