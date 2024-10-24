import React, { createContext, useContext, useState,useRef } from 'react';
import { BOT_NAMES, GAME_SETTINGS, GAME_TYPE, PLAYER_COLORS } from '../utils/constants';
import { Bot } from '../gameLogic/bot';
import { Game } from '../gameLogic/backgammon';
import { DoubleDice } from '../gameLogic/doubleDice';

// Create the context
const GameStateContext = createContext();

// Create the provider
export const GameStateProvider = ({ children }) => {
  const boardRef = useRef(null);
  const [isStartingPhase, setStartingPhase] = useState(true);
  const [firstRoll, setFirstRoll] = useState(true);
  const [disableScreen, setDisableScreen] = useState(false);
  const [isLoadingGame, setIsLoadingGame] = useState(true);
  const [gameIsRunning, setGameIsRunning] = useState(false);

  const [game, setGame] = useState(null);
  const [positions, setPositions] = useState(GAME_SETTINGS.startingPositions);
  const [doubleDice, setDoubleDice] = useState(new DoubleDice());

  const [gamemode, setGameMode] = useState();
  const [gameOver, setGameOver] = useState({
    gameover: false,
    winner: PLAYER_COLORS.NAP,
  });

  // Delete in the future
  const [dice, setDice] = useState(GAME_SETTINGS.startDice);

  // BOT CONSTANTS
  const [bot, setBot] = useState(new Bot(BOT_NAMES.DEFAULT));

  // ONLINE CONSTANTS
  const [gameId,setGameId] = useState();
  const [localPlayerId, setLocalPlayerId] = useState()
  const [whoAmI, setWhoAmI] = useState();
  const [opponentPlayerId, setOpponentPlayerId] = useState();
  const [onlineTurns, setOnlineTurns] = useState();

  //const [playerOneId,setPlayerOneId] = useState<string>("")
  //const [playerTwoId,setPlayerTwoId] = useState<string>("")

  return (
    <GameStateContext.Provider
      value={{
        isStartingPhase,
        setStartingPhase,
        firstRoll,
        setFirstRoll,
        disableScreen,
        setDisableScreen,
        isLoadingGame,
        setIsLoadingGame,
        gameIsRunning,
        setGameIsRunning,
        game,
        setGame,
        positions,
        setPositions,
        doubleDice,
        setDoubleDice,
        gamemode,
        setGameMode,
        gameOver,
        setGameOver,
        dice,
        setDice,
        bot,
        setBot,
        gameId,
        setGameId,
        localPlayerId,
        setLocalPlayerId,
        opponentPlayerId,
        setOpponentPlayerId,
        whoAmI,
        setWhoAmI,
        onlineTurns,
        setOnlineTurns,
        boardRef
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

// Custom hook to use the GameStateContext
export const useGameState = () => useContext(GameStateContext);
