import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";
import { useGameState } from "./GameStateContext";
import { PLAYER_COLORS } from "../utils/constants";
import { useGameHelper } from "./useGameLogicHelper";

const client = generateClient<Schema>();

export const useGameEffects = (
) => {

    const {
        gameId,
        setOnlineTurns,
        localPlayerId,
        setWhoAmI,setOpponentPlayerId
    } = useGameState()
    const {
        forceRender
    } = useGameHelper()

    const syncOnlineTunrs = () => {
        if (gameId !== undefined && gameId !== null) {
          const sub = client.models.Turns.observeQuery({
            filter: { gameId: { eq: gameId } },
          }).subscribe({
            next: ({ items, isSynced }) => {
              setOnlineTurns([...items]);
            },
          });
    
          return () => sub.unsubscribe();
        }
      }
      const setLocalPlayerColor = async () => {
        const { data: session, errors } = await client.models.Session.get({
          id: gameId,
        });
        if (session === null || session === undefined) {
          setWhoAmI(PLAYER_COLORS.NAP);
          return
        }
        if (session.playerOneID === localPlayerId) {
          setOpponentPlayerId(
            session.playerTwoID === null ? '' : session.playerTwoID
          );
          setWhoAmI(PLAYER_COLORS.WHITE)
          forceRender()
          return
        } else {
          setOpponentPlayerId(
            session.playerOneID === null ? '' : session.playerOneID
          );
          setWhoAmI(PLAYER_COLORS.BLACK)
          forceRender()
          return
        }
      };
    return{
        syncOnlineTunrs,
        setLocalPlayerColor,
    }
}