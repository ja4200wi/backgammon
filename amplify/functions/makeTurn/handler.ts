import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../data/resource';
import { env } from '$amplify/env/joinGame'; // replace with your function name
import { getSession, getTurns, listTurns } from './graphql/queries';
import { createTurns } from './graphql/mutations';
import { TurnsPlayerColor, TurnsType } from './graphql/API';

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT, // replace with your defineData name
        region: env.AWS_REGION,
        defaultAuthMode: 'iam',
      },
    },
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => ({
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            sessionToken: env.AWS_SESSION_TOKEN,
          },
        }),
        clearCredentialsAndIdentityId: () => {
          /* noop */
        },
      },
    },
  }
);

const client = generateClient<Schema>();

type Move = {
  from: number;
  to: number;
};

export const handler: Schema['makeTurn']['functionHandler'] = async (event) => {
  const { gameId, userId, moves, type } = event.arguments;
  if (type === null || type === undefined) {
    return 'FAIL';
  }
  const newType = type as TurnsType;

  let parsedMoves: Move[];
  if (typeof moves === 'string') {
    try {
      parsedMoves = JSON.parse(moves);
    } catch (error) {
      return `Invalid 'moves' format: ${error}`;
    }
  } else {
    return `Invalid 'moves' type`;
  }
  const nextDice = type === 'INIT' ? rollFirstDice() : rollDice();

  const { errors, data: turns } = await client.graphql({
    query: listTurns,
    variables: {
      gameId,
    },
  });
  const turnNumber = type === 'INIT' ? 0 : turns.listTurns.items.length;

  const color = (await getColorOfPlayer(gameId, userId)) as TurnsPlayerColor;

  const { errors: createTurnErrors, data: createTurnData } =
    await client.graphql({
      query: createTurns,
      variables: {
        input: {
          gameId,
          playerId: userId,
          playerColor: color,
          type: newType,
          moves: parsedMoves,
          turnNumber,
          diceForNextTurn: nextDice,
        },
      },
    });

  return 'Hello from Lambda!';
};

function rollFirstDice(): { dieOne: number; dieTwo: number } {
  let dieOne: number;
  let dieTwo: number;
  do {
    dieOne = Math.floor(Math.random() * 6) + 1;
    dieTwo = Math.floor(Math.random() * 6) + 1;
  } while (dieOne === dieTwo);
  return {
    dieOne,
    dieTwo,
  };
}

async function getColorOfPlayer(
  gameId: string,
  userId: string
): Promise<'WHITE' | 'BLACK' | 'NAP'> {
  const { errors, data: session } = await client.graphql({
    query: getSession,
    variables: {
      id: gameId,
    },
  });
  if (session.getSession === null || session.getSession === undefined) {
    return 'NAP';
  }
  if (session.getSession.playerOneID === userId) {
    return 'WHITE';
  } else if (session.getSession.playerTwoID === userId) {
    return 'BLACK';
  }
  return 'NAP';
}

function rollDice(): { dieOne: number; dieTwo: number } {
  return {
    dieOne: Math.floor(Math.random() * 6) + 1,
    dieTwo: Math.floor(Math.random() * 6) + 1,
  };
}
