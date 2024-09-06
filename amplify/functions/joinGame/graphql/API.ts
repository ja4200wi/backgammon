/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Player = {
  __typename: "Player",
  createdAt: string,
  id: string,
  name?: string | null,
  owner?: string | null,
  sessionsAsPlayerOne?: ModelSessionConnection | null,
  sessionsAsPlayerTwo?: ModelSessionConnection | null,
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
  gameState?: SessionGameState | null,
  id: string,
  playerOne?: Player | null,
  playerOneID?: string | null,
  playerTwo?: Player | null,
  playerTwoID?: string | null,
  turns?:  Array<Turn | null > | null,
  updatedAt: string,
};

export type SessionGameState = {
  __typename: "SessionGameState",
  board?:  Array<Position | null > | null,
  currentPlayer?: SessionGameStateCurrentPlayer | null,
  dice?: Dice | null,
};

export type Position = {
  __typename: "Position",
  color?: PositionColor | null,
  count?: number | null,
  index?: number | null,
};

export enum PositionColor {
  BLACK = "BLACK",
  WHITE = "WHITE",
}


export enum SessionGameStateCurrentPlayer {
  BLACK = "BLACK",
  WHITE = "WHITE",
}


export type Dice = {
  __typename: "Dice",
  dieOne?: number | null,
  dieTwo?: number | null,
};

export type Turn = {
  __typename: "Turn",
  moves?:  Array<Move | null > | null,
  player?: TurnPlayer | null,
  type?: TurnType | null,
};

export type Move = {
  __typename: "Move",
  from?: number | null,
  to?: number | null,
};

export enum TurnPlayer {
  BLACK = "BLACK",
  WHITE = "WHITE",
}


export enum TurnType {
  DOUBLE = "DOUBLE",
  GIVE_UP = "GIVE_UP",
  MOVE = "MOVE",
}


export type ModelPlayerFilterInput = {
  and?: Array< ModelPlayerFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  not?: ModelPlayerFilterInput | null,
  or?: Array< ModelPlayerFilterInput | null > | null,
  owner?: ModelStringInput | null,
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

export type ModelPlayerConditionInput = {
  and?: Array< ModelPlayerConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  name?: ModelStringInput | null,
  not?: ModelPlayerConditionInput | null,
  or?: Array< ModelPlayerConditionInput | null > | null,
  owner?: ModelStringInput | null,
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
  gameState?: SessionGameStateInput | null,
  id?: string | null,
  playerOneID?: string | null,
  playerTwoID?: string | null,
  turns?: Array< TurnInput | null > | null,
};

export type SessionGameStateInput = {
  board?: Array< PositionInput | null > | null,
  currentPlayer?: SessionGameStateCurrentPlayer | null,
  dice?: DiceInput | null,
};

export type PositionInput = {
  color?: PositionColor | null,
  count?: number | null,
  index?: number | null,
};

export type DiceInput = {
  dieOne?: number | null,
  dieTwo?: number | null,
};

export type TurnInput = {
  moves?: Array< MoveInput | null > | null,
  player?: TurnPlayer | null,
  type?: TurnType | null,
};

export type MoveInput = {
  from?: number | null,
  to?: number | null,
};

export type DeletePlayerInput = {
  id: string,
};

export type DeleteSessionInput = {
  id: string,
};

export type UpdatePlayerInput = {
  id: string,
  name?: string | null,
};

export type UpdateSessionInput = {
  gameState?: SessionGameStateInput | null,
  id: string,
  playerOneID?: string | null,
  playerTwoID?: string | null,
  turns?: Array< TurnInput | null > | null,
};

export type ModelSubscriptionPlayerFilterInput = {
  and?: Array< ModelSubscriptionPlayerFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionPlayerFilterInput | null > | null,
  owner?: ModelStringInput | null,
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

export type GetPlayerQueryVariables = {
  id: string,
};

export type GetPlayerQuery = {
  getPlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    gameState?:  {
      __typename: "SessionGameState",
      currentPlayer?: SessionGameStateCurrentPlayer | null,
    } | null,
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  Array< {
      __typename: "Turn",
      player?: TurnPlayer | null,
      type?: TurnType | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type JoinGameQueryVariables = {
  gameId: string,
  userId: string,
};

export type JoinGameQuery = {
  joinGame?: string | null,
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
      owner?: string | null,
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

export type SayHelloQueryVariables = {
  name?: string | null,
};

export type SayHelloQuery = {
  sayHello?: string | null,
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
    owner?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    gameState?:  {
      __typename: "SessionGameState",
      currentPlayer?: SessionGameStateCurrentPlayer | null,
    } | null,
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  Array< {
      __typename: "Turn",
      player?: TurnPlayer | null,
      type?: TurnType | null,
    } | null > | null,
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
    owner?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    gameState?:  {
      __typename: "SessionGameState",
      currentPlayer?: SessionGameStateCurrentPlayer | null,
    } | null,
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  Array< {
      __typename: "Turn",
      player?: TurnPlayer | null,
      type?: TurnType | null,
    } | null > | null,
    updatedAt: string,
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
    owner?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    gameState?:  {
      __typename: "SessionGameState",
      currentPlayer?: SessionGameStateCurrentPlayer | null,
    } | null,
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  Array< {
      __typename: "Turn",
      player?: TurnPlayer | null,
      type?: TurnType | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
  owner?: string | null,
};

export type OnCreatePlayerSubscription = {
  onCreatePlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    gameState?:  {
      __typename: "SessionGameState",
      currentPlayer?: SessionGameStateCurrentPlayer | null,
    } | null,
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  Array< {
      __typename: "Turn",
      player?: TurnPlayer | null,
      type?: TurnType | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnDeletePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
  owner?: string | null,
};

export type OnDeletePlayerSubscription = {
  onDeletePlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    gameState?:  {
      __typename: "SessionGameState",
      currentPlayer?: SessionGameStateCurrentPlayer | null,
    } | null,
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  Array< {
      __typename: "Turn",
      player?: TurnPlayer | null,
      type?: TurnType | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};

export type OnUpdatePlayerSubscriptionVariables = {
  filter?: ModelSubscriptionPlayerFilterInput | null,
  owner?: string | null,
};

export type OnUpdatePlayerSubscription = {
  onUpdatePlayer?:  {
    __typename: "Player",
    createdAt: string,
    id: string,
    name?: string | null,
    owner?: string | null,
    sessionsAsPlayerOne?:  {
      __typename: "ModelSessionConnection",
      nextToken?: string | null,
    } | null,
    sessionsAsPlayerTwo?:  {
      __typename: "ModelSessionConnection",
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
    gameState?:  {
      __typename: "SessionGameState",
      currentPlayer?: SessionGameStateCurrentPlayer | null,
    } | null,
    id: string,
    playerOne?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerOneID?: string | null,
    playerTwo?:  {
      __typename: "Player",
      createdAt: string,
      id: string,
      name?: string | null,
      owner?: string | null,
      updatedAt: string,
    } | null,
    playerTwoID?: string | null,
    turns?:  Array< {
      __typename: "Turn",
      player?: TurnPlayer | null,
      type?: TurnType | null,
    } | null > | null,
    updatedAt: string,
  } | null,
};
