import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { sayHello } from '../functions/sayHello/resource';
import { joinGame } from '../functions/joinGame/resource';

const schema = a
  .schema({
    Position: a.customType({
      index: a.integer(),
      color: a.enum(['WHITE', 'BLACK']),
      count: a.integer(),
    }),
    Dice: a.customType({
      dieOne: a.integer(),
      dieTwo: a.integer(),
    }),
    Move: a.customType({
      from: a.integer(),
      to: a.integer(),
    }),
    Turn: a.customType({
      moves: a.ref('Move').array(),
      type: a.enum(['MOVE', 'GIVE_UP', 'DOUBLE']),
      player: a.enum(['WHITE', 'BLACK']),
    }),
    Session: a
      .model({
        playerOneID: a.id(),
        playerOne: a.belongsTo('Player', 'playerOneID'),
        playerTwoID: a.id(),
        playerTwo: a.belongsTo('Player', 'playerTwoID'),
        gameState: a.customType({
          board: a.ref('Position').array(),
          dice: a.ref('Dice'),
          currentPlayer: a.enum(['WHITE', 'BLACK']),
        }),
        turns: a.ref('Turn').array(),
      })
      .authorization((allow) => [allow.authenticated()]),
    Player: a
      .model({
        name: a.string(),
        sessionsAsPlayerOne: a.hasMany('Session', 'playerOneID'),
        sessionsAsPlayerTwo: a.hasMany('Session', 'playerTwoID'),
      })
      .authorization((allow) => [allow.owner()]),
    sayHello: a
      .query()
      .arguments({
        name: a.string(),
      })
      .returns(a.string())
      .handler(a.handler.function(sayHello))
      .authorization((allow) => [allow.guest()]),
    joinGame: a
      .query()
      .arguments({
        gameId: a.string().required(),
        userId: a.string().required(),
      })
      .returns(a.string())
      .handler(a.handler.function(joinGame))
      .authorization((allow) => [allow.authenticated()]),
  })
  .authorization((allow) => [allow.resource(joinGame)]);

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
