import { defineBackend } from '@aws-amplify/backend';

import { data } from './data/resource';
import { joinGame } from './functions/joinGame/resource';
import { makeTurn } from './functions/makeTurn/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  data,
  makeTurn,
  joinGame,
});
