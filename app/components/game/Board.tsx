import React, { useState, useEffect, useRef, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, findNodeHandle } from 'react-native';
import Spike from './Spike';
import Checker from './Checker';
import Dice from './Dice';
import { DiceProps } from './Dice';
import Prison from './Prison';
import Home from './Home';
import PipCount from './PipCount';
import { DICE_COLORS, PLAYER_COLORS, DIMENSIONS, BOARD_COLORS, GAME_SETTINGS } from '../../utils/constants';
import { DoubleDice } from '../../gameLogic/doubleDice';
import AnimatedChecker from './AnimatedChecker';
import { identifyUser } from 'aws-amplify/in-app-messaging';

export interface Position {
  index: number;
  color: PLAYER_COLORS;
  count: number;
}
const colors = {
  backgroundColor: BOARD_COLORS.BACKGROUND,
  spikeDarkColor: BOARD_COLORS.SPIKEDARK,
  spikeLightColor: BOARD_COLORS.SPIKELIGHT,
  prisonColor: BOARD_COLORS.PRISON, 
}

interface BoardProps {
  positions: Position[];
  currentPlayer: PLAYER_COLORS;
  pipCount: number[];
  homeCount: number[];
  dice: DiceProps;
  disableScreen: boolean;
  doubleDice: DoubleDice;
  onMoveChecker: (sourceIndex: number, targetIndex: number) => Promise<boolean>;
  legalMovesFrom: (sourceIndex: number) => number[];
  handleAnimation: (startX:number,startY:number,endX:number,endY:number) => void;
  onUpdatePosition?: (sourceIndex:number,targetIndex:number) => void;
}

const Board = forwardRef<any, BoardProps>(({
  dice,
  currentPlayer,
  positions,
  pipCount,
  homeCount,
  disableScreen,
  doubleDice,
  legalMovesFrom,
  onMoveChecker,
  handleAnimation,
  onUpdatePosition,
}, ref) => {
  const spikeRefs = useRef<Array<View | null>>([]);
  const checkerRefs = useRef<Array<View | null>>([]);
  const homeRefs = useRef<{ [key: string]: View | null }>({
    white: null,
    black: null,
  });
  const initialSpikes = Array.from({ length: 26 }, (_, index) => ({
    height: DIMENSIONS.spikeHeight,
    color: index % 2 === 0 ? colors.spikeDarkColor : colors.spikeLightColor,
    width: DIMENSIONS.spikeWidth,
    invert: index >= 12 ? true : false,
    checkers: [] as React.ReactElement[],
    onPress: handleSpikePress,
  }));

  const [spikes, setSpikes] = useState(initialSpikes);
  const [spikePositions, setSpikePositions] = useState<{ index:number, x:number, y:number }[]>([])
  const [checkerPos,setCheckerPos] = useState<{ index:number, x:number, y:number }[]>([])
  const [homePositions, setHomePositions] = useState<{ [key: string]: {homeX: number; homeY: number } }>({
    white: { homeX: 0, homeY: 0 },
    black: { homeX: 0, homeY: 0 },
  });
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [lastMoves,setLastMoves] = useState<{index:number,from:number,to:number,indexHit?:number,fromHit?:number,toHit?:number}[]>([])
  const [prisonCheckers, setPrisonCheckers] = useState<React.ReactElement[]>(
    []
  );
  const [homeChecker, setHomeChecker] = useState<React.ReactElement[]>(
    []
  );
  const WHITEHOMEINDEX = 0
  const BLACKHOMEINDEX = 1
  const [possibleMoves, setPossibleMoves] = useState<number[]>([]);
  const moveChecker = async (sourceIndex: number, targetIndex: number) => {
    const success = await onMoveChecker(sourceIndex, targetIndex);
    if (success) {
      updatePosition(sourceIndex,targetIndex)
      setPossibleMoves([]);
      setSelectedSource(null);
    } else {
      setSelectedSource(null);
    }
  };
  const updatePosition = async (sourceIndex:number,targetIndex:number, type?: 'UNDO' | 'DISTRIBUTE') => {
    if(type === 'UNDO') {
      undoPosition()
    } else if(type === 'DISTRIBUTE') {
      distributeCheckers()
    } else {
    const newSpikes = [...spikes];
    const checker = getChecker(sourceIndex,newSpikes)

    doAnimation(checker,targetIndex)
    await pause(GAME_SETTINGS.checkerAnimationDuration - 25)

    pushChecker(checker,sourceIndex,targetIndex)
    
    // Timeout used to await DOM rendering (works eventhough timeout is at 0)
    setTimeout(async ()=> {
      await measureChecker()
    },0)
    setSpikes(newSpikes)
    }
    
  }
  const getChecker = (sourceIndex:number, newSpikes:any) => {
    let checker:React.ReactElement<any, string | React.JSXElementConstructor<any>>
    if(sourceIndex === 0 || sourceIndex === 25) {
      const indexToRemove = prisonCheckers.findIndex(checker => checker.props.color === PLAYER_COLORS.WHITE);
      checker = prisonCheckers.splice(indexToRemove, 1).pop()!
    } else {
      checker = newSpikes[sourceIndex].checkers.pop()!
    }
    return checker
  }
  const doAnimation = (checker:React.ReactElement<any, string | React.JSXElementConstructor<any>>,targetIndex:number) => {
    if(targetIndex !== 100) {
      const checkerCoordsStart = checkerPos.find((item) => item.index === checker.props.index)
      const endSpike = spikePositions.find((item) => item.index === targetIndex)
      const checkerCoordsEnd = calculateAnimationPositionHelper(false,endSpike!)
      handleAnimation(checkerCoordsStart!.x,checkerCoordsStart!.y,checkerCoordsEnd[0],checkerCoordsEnd[1])
      } else {
        const checkerCoordsStart = checkerPos.find((item) => item.index === checker.props.index)
        const homeCoords = calculateAnimationHomeCoords()
        handleAnimation(checkerCoordsStart!.x,checkerCoordsStart!.y,homeCoords[0],homeCoords[1])
      }
  }
  const pushChecker = (checker:any,sourceIndex:number,targetIndex:number) => {
    const oppColor = currentPlayer === PLAYER_COLORS.WHITE ? PLAYER_COLORS.BLACK : PLAYER_COLORS.WHITE
    if (checker) {
      if (targetIndex === 0 || targetIndex === 25) {
        prisonCheckers.unshift(checker); // Push the checker to the bottom of the prison stack
      } else if (targetIndex === 100) {
        lastMoves.push({ index: checker.props.index, from: sourceIndex, to: targetIndex });
        homeChecker.unshift(checker); // Push the checker to the bottom of the home stack
      } else {
        if (spikes[targetIndex].checkers[0]?.props.color === oppColor && spikes[targetIndex].checkers.length === 1) {
          const oppChecker = spikes[targetIndex].checkers.pop()!;
          const prisonIndex = oppChecker.props.color === PLAYER_COLORS.WHITE ? 0 : 25;
          lastMoves.push({
            index: checker.props.index,
            from: sourceIndex,
            to: targetIndex,
            indexHit: oppChecker.props.index,
            fromHit: targetIndex,
            toHit: prisonIndex
          });
          prisonCheckers.unshift(oppChecker); // Push the opponent's checker to the bottom of the prison stack
        } else {
          lastMoves.push({ index: checker.props.index, from: sourceIndex, to: targetIndex });
        }
        spikes[targetIndex].checkers.unshift(checker); // Push the checker to the bottom of the spike stack
      }
    }
  }
  const undoPosition = async () => {
    const currentLastMove = lastMoves.pop()
    let checker:React.ReactElement<any, string | React.JSXElementConstructor<any>>
    let oppChecker:React.ReactElement<any, string | React.JSXElementConstructor<any>>
    if(currentLastMove) {
      if(currentLastMove.to === 100) {
        const indexToRemove = homeChecker.findIndex(checker => checker.props.index === currentLastMove.index);
        checker = homeChecker.splice(indexToRemove, 1).pop()!
      } else {
        checker = spikes[currentLastMove.to].checkers.pop()!
      }
      spikes[currentLastMove.from].checkers.push(checker)
      if(currentLastMove.indexHit) {
        const indexToRemove = prisonCheckers.findIndex(checker => checker.props.index === currentLastMove.indexHit);
        oppChecker = prisonCheckers.splice(indexToRemove, 1).pop()!
        spikes[currentLastMove.fromHit!].checkers.push(checker)
      }
    }
    setSpikes([...spikes])
    setPrisonCheckers([...prisonCheckers])
    setHomeChecker([...homeChecker])
    setTimeout(() => {
      measureChecker()
    }, 0);
  }
  const handlePrisonPress = (index: number) => {
    if (selectedSource === null && prisonCheckers.length > 0) {
      if (currentPlayer === PLAYER_COLORS.WHITE) {
        setSelectedSource(0);
      } else {
        setSelectedSource(25);
      }
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index);
    }
  };
  const handleSpikePress = (index: number) => {
    if (selectedSource === null && spikes[index].checkers.length > 0) {
      setSelectedSource(index);
    } else if (selectedSource !== null) {
      if(possibleMoves.includes(index)) {
        moveChecker(selectedSource, index);
      } else {
        setSelectedSource(index)
      }
    }
  };
  const handleHomePress = (index: number) => {
    if (selectedSource === null) {
      return;
    } else if (selectedSource !== null) {
      moveChecker(selectedSource, index);
    }
  };
  const measureSpikes = async () => {
    const positions: { index: number; x: number; y: number }[] = [];
    const measurePromises = spikeRefs.current.map((spikeRef, index) => {
      return new Promise<void>((resolve) => {
        if (spikeRef) {
          spikeRef.measure((x, y, width, height, pageX, pageY) => {
            const centerX = pageX
            const centerY = pageY

            positions.push({ index, x: centerX, y: centerY });
            resolve(); 
          });
        } else {
          resolve(); 
        }
      });
    });
    await Promise.all(measurePromises);
    setSpikePositions(positions);
  };
  const measureChecker = async () => {
    try {
      const positions: { index: number; x: number; y: number }[] = [];
      const measurePromises = checkerRefs.current.map((checkerRef, index) => {
        return new Promise<void>((resolve, reject) => {
          if (checkerRef) {
            checkerRef.measure((x, y, width, height, pageX, pageY) => {
              if (pageX !== undefined && pageY !== undefined) {
                const centerX = pageX;
                const centerY = pageY;
                positions.push({ index, x: centerX, y: centerY });
              }
              resolve(); 
            });
          } else {
            positions.push({index,x:0,y:0})
            resolve(); // Resolve even if there's no ref to avoid blocking
          }
        });
      });
  
      await Promise.all(measurePromises);
  
      if (positions.length > 0) {
        setCheckerPos(positions);
      }
    } catch (error) {
      console.error('Error measuring checkers:', error);
    }
  };
  const measureHome = (color: 'white' | 'black') => {
    if (homeRefs.current[color]) {
      homeRefs.current[color]?.measure((x, y, width, height, pageX, pageY) => {
        const homeX = pageX + DIMENSIONS.homeWidth - DIMENSIONS.spikeWidth - 5 ;
        const homeY = pageY + (DIMENSIONS.spikeWidth / 3) - 4;
        setHomePositions((prevPositions) => ({
          ...prevPositions,
          [color]: {homeX, homeY },
        }));
      });
    }
  };
  const pause = async (duration: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, duration);
    });
  };
  const calculateAnimationPositionHelper = (isStart: boolean,spikePos:{index: number ; x: number; y: number}) => {
    let x = spikePos.x
    let y = spikePos.y 
    const checkerWidth = DIMENSIONS.spikeWidth
    const spike = positions.find((item)=> item.index === spikePos.index)
    const hitBonus = spike?.color !== currentPlayer ? -checkerWidth : 0

    const endingBonus = isStart ? 0 : checkerWidth
    if(spikePos.index <= 12) {
      if(spike) {
        if(spike.count === 1) {y = spikePos.y + endingBonus + hitBonus}
        else if(spike.count === 2) {y = spikePos.y + checkerWidth + endingBonus}
        else if(spike.count === 3) {y = spikePos.y + 2*checkerWidth + endingBonus}
        else if(spike.count === 4) {y = spikePos.y + 3*checkerWidth + endingBonus}
        else if(spike.count === 5) {y = spikePos.y + 3*checkerWidth + endingBonus}
        else if(spike.count > 5) {y = spikePos.y + 3*checkerWidth +endingBonus}
      } else {
        y = spikePos.y
      }
    } else {
      if(spike) {
        if(spike.count === 1) {y = spikePos.y + DIMENSIONS.spikeHeight - 1*checkerWidth - endingBonus - hitBonus}
        else if(spike.count === 2) {y = spikePos.y + DIMENSIONS.spikeHeight - 2*checkerWidth - endingBonus}
        else if(spike.count === 3) {y = spikePos.y + DIMENSIONS.spikeHeight - 3*checkerWidth - endingBonus}
        else if(spike.count === 4) {y = spikePos.y + DIMENSIONS.spikeHeight - 4*checkerWidth - endingBonus}
        else if(spike.count === 5) {y = spikePos.y + DIMENSIONS.spikeHeight - 4*checkerWidth - endingBonus}
        else if(spike.count > 5) {y = spikePos.y + DIMENSIONS.spikeHeight - 4*checkerWidth - endingBonus}
      } else {
        y = spikePos.y + DIMENSIONS.spikeHeight - endingBonus
      }
    }
    return[x,y]
  }
  const calculateAnimationHomeCoords = () => {
    const home = currentPlayer === PLAYER_COLORS.WHITE ? homePositions['white'] : homePositions['black']
    const homeCount = homeChecker.filter((item) => item.props.color === currentPlayer).length
    return [home.homeX - (homeCount * 6),home.homeY]
  }
  const distributeCheckers = () => {
    const newSpikes = Array.from({ length: 26 }, (_, index) => ({
      height: DIMENSIONS.spikeHeight,
      color: index % 2 === 0 ? colors.spikeDarkColor : colors.spikeLightColor,
      width: DIMENSIONS.spikeWidth,
      invert: index >= 13 ? true : false,
      checkers: [] as React.ReactElement[],
      onPress: handleSpikePress,
    }));
  
    const tempPrisonCheckers: React.ReactElement[] = [];
    const tempHomeCheckers: React.ReactElement[] = [];
  
    let checkerIndex = 0;
    
    positions.forEach((position) => {
      const { index, color, count } = position;
      for (let i = 0; i < count; i++) {
        const checker = (
          <Checker
            key={checkerIndex}
            color={color}
            width={DIMENSIONS.spikeWidth}
            height={DIMENSIONS.spikeWidth}
            index={checkerIndex}
            ref={setCheckerRef(checkerIndex)} // Use the setCheckerRef function here
          />
        );
        checkerIndex++; // Increment the checker index to handle multiple refs
        if (index === 0 || index === 25) {
          tempPrisonCheckers.push(checker);
        } else if (index === 100) {
          tempHomeCheckers.push(checker);
        } else {
          newSpikes[index].checkers.push(checker);
        }
      }
    });
  
    setPrisonCheckers(tempPrisonCheckers);
    setHomeChecker(tempHomeCheckers)
    setSpikes(newSpikes);
    if(!dice.startingSeq) {
        setTimeout(() => {
        measureChecker()
      }, 0);
    }
  };
  const setCheckerRef = (index: number) => (ref: View | null) => {
    if (ref) {
      checkerRefs.current[index] = ref;
    } else {
      checkerRefs.current[index] = null;
    }
  };
  const calculatePossibleMoves = (sourceIndex: number) => {
    const possibleMovesFrom = legalMovesFrom(sourceIndex);
    setPossibleMoves(possibleMovesFrom);
  };
  useImperativeHandle(ref, () => ({
    updatePosition, 
  }));
  useLayoutEffect(() => {
    if(dice.startingSeq) {
      setTimeout(() => {
        measureChecker();
        measureSpikes()
        measureHome('black')
        measureHome('white')
      }, 500);
    }
  }, [positions]);
  useEffect(() => {
    if(dice.startingSeq) {
      distributeCheckers();
    }
  }, [positions]);
  useEffect(() => {
    if (selectedSource !== null) {
      calculatePossibleMoves(selectedSource);
    }
    if (selectedSource === null) {
      setPossibleMoves([]);
    }
  }, [selectedSource]);

  const SixSpikes = (startIndex: number) => (
    <>
      {spikes.slice(startIndex, startIndex + 6).map((spike, idx) => (
        <Spike
          key={startIndex + idx}
          height={spike.height}
          color={spike.color}
          width={spike.width}
          invert={spike.invert}
          isHighlighted={possibleMoves.includes(startIndex + idx)}
          checkers={spike.checkers}
          onPress={() => handleSpikePress(startIndex + idx)}
          ref={(ref) => (spikeRefs.current[startIndex + idx] = ref)}
        />
      ))}
    </>
  );

  return (
    <View style={{ position: 'relative' }}>
      {disableScreen && <View style={styles.overlay} />}
      <View style={styles.row}>
        <PipCount color={PLAYER_COLORS.BLACK} count={pipCount[1]} />
        <Home
          onPress={handleHomePress}
          count={homeCount[1]}
          player={PLAYER_COLORS.BLACK}
          doubleDice={doubleDice}
          isHighlighted={possibleMoves.includes(100) && currentPlayer === PLAYER_COLORS.BLACK}
          checker={homeChecker}
          ref={(ref) => (homeRefs.current.black = ref)}
        />
      </View>
  
      <View
        style={[
          styles.board,
          {
            backgroundColor: colors.backgroundColor,
            width: DIMENSIONS.boardWidth,
            height: DIMENSIONS.boardHeight,
          },
        ]}
      >
        {/* Other board components */}
        {dice.startingSeq && (
          <View style={styles.TopDice}>
            <Dice
              diceOne={dice.diceOne}
              diceTwo={dice.diceTwo}
              color={dice.color}
              startingSeq={dice.startingSeq}
              firstRoll={dice.firstRoll}
            />
          </View>
        )}
  
        <View style={[styles.boardHalf]}>
          <View style={[styles.reverse]}>{SixSpikes(7)}</View>
          <View
            style={{ height: DIMENSIONS.spikeHeight, justifyContent: 'center' }}
          >
            {!dice.startingSeq && dice.color === DICE_COLORS.WHITE && (
              <Dice
                diceOne={dice.diceOne}
                diceTwo={dice.diceTwo}
                color={dice.color}
                startingSeq={dice.startingSeq}
                firstRoll={dice.firstRoll}
              />
            )}
          </View>
          <View style={[styles.sixSpikes]}>{SixSpikes(13)}</View>
        </View>
  
        <Prison
          backgroundColor={colors.prisonColor}
          width={DIMENSIONS.spikeWidth}
          height={DIMENSIONS.boardHeight}
          checkers={prisonCheckers}
          onPress={handlePrisonPress}
        />
  
        <View style={[styles.boardHalf]}>
          <View style={[styles.reverse]}>{SixSpikes(1)}</View>
          <View
            style={{ height: DIMENSIONS.spikeHeight, justifyContent: 'center' }}
          >
            {!dice.startingSeq && dice.color === DICE_COLORS.BLACK && (
              <Dice
                diceOne={dice.diceOne}
                diceTwo={dice.diceTwo}
                color={dice.color}
                startingSeq={dice.startingSeq}
                firstRoll={dice.firstRoll}
              />
            )}
          </View>
          <View style={[styles.sixSpikes]}>{SixSpikes(19)}</View>
        </View>
      </View>
  
      <View style={styles.row}>
        <PipCount color={PLAYER_COLORS.WHITE} count={pipCount[0]} />
        <Home
          onPress={handleHomePress}
          count={homeCount[0]}
          player={PLAYER_COLORS.WHITE}
          doubleDice={doubleDice}
          isHighlighted={possibleMoves.includes(100) && currentPlayer === PLAYER_COLORS.WHITE}
          checker={homeChecker}
          ref={(ref) => (homeRefs.current.white = ref)}
        />
      </View>
    </View>
  );
  
});

const styles = StyleSheet.create({
  board: {
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  boardHalf: {
    flexDirection: 'column',
  },
  sixSpikes: {
    flexDirection: 'row',
  },
  reverse: {
    flexDirection: 'row-reverse',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  TopDice: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 100,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -125 }, { translateY: -30 }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 100,
  },
});


export default Board;