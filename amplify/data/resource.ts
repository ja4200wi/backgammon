import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { joinGame } from '../functions/joinGame/resource';
import { makeTurn } from '../functions/makeTurn/resource';
import { postConfirmation } from '../auth/post-confirmation/resource';

const schema = a
  .schema({
    Dice: a.customType({
      dieOne: a.integer(),
      dieTwo: a.integer(),
    }),
    Move: a.customType({
      from: a.integer().required(),
      to: a.integer().required(),
    }),
    Turns: a
      .model({
        turnNumber: a.integer().required(),
        gameId: a.id().required(),
        game: a.belongsTo('Session', 'gameId'),
        type: a.enum(['MOVE', 'GIVE_UP', 'DOUBLE', 'INIT', 'GAME_OVER']),
        playerColor: a.enum(['WHITE', 'BLACK']),
        playerId: a.id(),
        player: a.belongsTo('Player', 'playerId'),
        moves: a.ref('Move').array(),
        diceForNextTurn: a.ref('Dice'),
      })
      .identifier(['gameId', 'turnNumber'])
      .authorization((allow) => [allow.authenticated()]),
    Session: a
      .model({
        playerOneID: a.id(),
        playerOne: a.belongsTo('Player', 'playerOneID'),
        playerTwoID: a.id(),
        playerTwo: a.belongsTo('Player', 'playerTwoID'),
        gameType: a.enum(['ELO', 'RANDOM', 'FRIENDLIST', 'COMPUTER']),
        isGameOver: a.boolean().required(),
        isGameStarted: a.boolean().required(),
        turns: a.hasMany('Turns', 'gameId'),
        statisticId: a.id(),
        statistics: a.hasOne('SessionStat', 'gameId'),
      })
      .authorization((allow) => [allow.authenticated()]),
    SessionStat: a
      .model({
        gameId: a.id().required(),
        game: a.belongsTo('Session', 'gameId'),
        gameType: a.enum(['ELO', 'RANDOM', 'FRIENDLIST', 'COMPUTER']),
        winnerId: a.id(),
        loserId: a.id(),
        winner: a.belongsTo('Player', 'winnerId'),
        loser: a.belongsTo('Player', 'loserId'),
        scores: a.customType({
          white: a.integer(),
          black: a.integer(),
        }),
        bet: a.integer(),
        doubleDiceValue: a.integer(),
        duration: a.integer(),
        reason: a.enum(['GIVE_UP', 'DOUBLE', 'TIMEOUT', 'GAME_OVER']),
        numTurns: a.integer(),
      })
      .authorization((allow) => [allow.authenticated()]),
    Player: a
      .model({
        name: a.string(),
        country: a.string(),
        emoji: a.string(),
        profilePicColor: a.string(),
        sessionsAsPlayerOne: a.hasMany('Session', 'playerOneID'),
        sessionsAsPlayerTwo: a.hasMany('Session', 'playerTwoID'),
        sessionsWon: a.hasMany('SessionStat', 'winnerId'),
        sessionsLost: a.hasMany('SessionStat', 'loserId'),
        friendsAsOne: a.hasMany('Friends', 'userIdOne'),
        friendsAsTwo: a.hasMany('Friends', 'userIdTwo'),
        turnsMade: a.hasMany('Turns', 'playerId'),
      })
      .authorization((allow) => [allow.authenticated()]),
    Friends: a
      .model({
        userIdOne: a.id(),
        userOne: a.belongsTo('Player', 'userIdOne'),
        userIdTwo: a.id(),
        userTwo: a.belongsTo('Player', 'userIdTwo'),
        isConfirmed: a.boolean(),
      })
      .authorization((allow) => [allow.authenticated()]),
    joinGame: a
      .mutation()
      .arguments({
        gameId: a.string().required(),
        userId: a.string().required(),
      })
      .returns(a.string())
      .handler(a.handler.function(joinGame))
      .authorization((allow) => [allow.authenticated()]),
    makeTurn: a
      .mutation()
      .arguments({
        gameId: a.string().required(),
        userId: a.string().required(),
        moves: a.json().required(),
        type: a.enum(['MOVE', 'GIVE_UP', 'DOUBLE', 'INIT', 'GAME_OVER']),
      })
      .returns(a.ref('Dice'))
      .handler(a.handler.function(makeTurn))
      .authorization((allow) => [allow.authenticated()]),
  })
  .authorization((allow) => [
    allow.resource(joinGame),
    allow.resource(makeTurn),
    allow.resource(postConfirmation),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
