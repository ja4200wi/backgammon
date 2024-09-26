import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../data/resource';
import { env } from '$amplify/env/joinGame'; // replace with your function name
import { updateSession } from './graphql/mutations';

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

export const handler: Schema['joinGame']['functionHandler'] = async (event) => {
  const { gameId } = event.arguments;
  const { userId } = event.arguments;
  const session = {
    id: gameId!,
    playerTwoID: userId,
  };
  await client
    .graphql({
      query: updateSession,
      variables: {
        input: session,
      },
    })
    .catch((err) => {
      console.log('Error from updateSession call in joinGame handler: ', err);
      return err;
    });
  return `Player ${userId} joined game with ID: ${gameId}`;
};
