import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { joinGame } from './functions/joinGame/resource';
import { postConfirmation } from './auth/post-confirmation/resource';
import { makeTurn } from './functions/makeTurn/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  data,
  postConfirmation,
  makeTurn,
  joinGame,
});
