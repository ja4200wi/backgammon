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
  checkArguments(gameId, userId, moves, type);
  const newType = type as TurnsType;

  let parsedMoves: Move[] = moves as Move[];

  const nextDice = type === 'INIT' ? rollFirstDice() : rollDice();
  const turns = await client
    .graphql({
      query: listTurns,
      variables: {
        gameId,
      },
    })
    .catch((err) => {
      console.log('Error from listTurns call in makeTurn handler: ', err);
      return null;
    });
  const turnNumber = type === 'INIT' ? 0 : turns!.data.listTurns.items.length;

  const color = (await getColorOfPlayer(gameId, userId)) as TurnsPlayerColor;
  console.log('color: ', color);

  const createTurnResponse = await client
    .graphql({
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
    })
    .catch((err) => {
      console.log('Error from createTurns call in makeTurn handler: ', err);
      return null;
    });
  return createTurnResponse!.data.createTurns.diceForNextTurn;
};

function checkArguments(gameId: string, userId: string, moves: any, type: any) {
  if (gameId === undefined || gameId === null) {
    console.log('gameId is required');
    return null;
  }
  if (userId === undefined || userId === null) {
    console.log('userId is required');
    return null;
  }
  if (moves === undefined || moves === null) {
    console.log('moves is required');
    return null;
  }
  if (type === undefined || type === null) {
    console.log('type is required');
    return null;
  }
}

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
  const session = await client
    .graphql({
      query: getSession,
      variables: {
        id: gameId,
      },
    })
    .catch((err) => {
      console.log('Error from getSession call in makeTurn handler: ', err);
      return null;
    });
  if (
    session?.data.getSession === null ||
    session?.data.getSession === undefined
  ) {
    return 'NAP';
  }
  if (session?.data.getSession.playerOneID === userId) {
    return 'WHITE';
  } else if (session.data.getSession.playerTwoID === userId) {
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
