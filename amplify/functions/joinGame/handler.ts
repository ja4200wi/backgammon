import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../data/resource';
import { env } from '$amplify/env/joinGame'; // replace with your function name
import { listSessions } from './graphql/queries';
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
  const { errors: sessionErrors, data: sessionsData } = await client.graphql({
    query: listSessions,
  });
  console.log('Sessions Data', sessionsData.listSessions.items);
  const { errors, data } = await client.graphql({
    query: updateSession,
    variables: {
      input: session,
    },
  });
  console.log('Data from graphql call: ', data.updateSession);
  //const response = await client.models.Session.update(session);
  return `Joining game with ID: ${gameId}`;
};
