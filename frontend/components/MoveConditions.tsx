export enum MoveConditions {
    EMPTY_SPIKE = 'EMPTY_SPIKE',
    OPPONENT_CHECKERS = 'OPPONENT_CHECKERS',
    WRONG_DIRECTION = 'WRONG_DIRECTION',
    WITHIN_BOARD_LIMITS = 'WITHIN_BOARD_LIMITS',
  }

  export enum DifficultyLevel {
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard',
  }
  
  
  export const validateMove = (
    sourceIndex: number,
    targetIndex: number,
    spikes: any[],
    currentPlayer: string,
    direction: number
  ): MoveConditions[] => {
    const conditions: MoveConditions[] = [];
  
    if (spikes[sourceIndex].checkers.length === 0) {
      conditions.push(MoveConditions.EMPTY_SPIKE);
    }
  
    const targetSpike = spikes[targetIndex];
    if (targetSpike.checkers.length > 2 && targetSpike.checkers[0].props.color !== currentPlayer) {
      conditions.push(MoveConditions.OPPONENT_CHECKERS);
    }
  
    if (direction * (targetIndex - sourceIndex) <= 0) {
      conditions.push(MoveConditions.WRONG_DIRECTION);
    }
  
    if (targetIndex < 1 || targetIndex >= 25) {
      conditions.push(MoveConditions.WITHIN_BOARD_LIMITS);
    }
  
    return conditions;
  };
  
  export const getValidMoves = (
    sourceIndex: number,
    diceValues: number[],
    spikes: any[],
    currentPlayer: string,
    usedDice: { [key: number]: number },
    difficulty: DifficultyLevel
  ): number[] => {
    const direction = currentPlayer === 'white' ? 1 : -1;
    const remainingMoves = diceValues.flatMap(die => {
      const maxUses = (die === diceValues[0] && die === diceValues[1]) ? 4 : 1;
      const used = usedDice[die] || 0;
      return Array(maxUses - used).fill(die * direction);
    });
  
    const validMoves = remainingMoves
        .map(move => sourceIndex + move)
        .filter(target => {
            const conditions = validateMove(sourceIndex, target, spikes, currentPlayer, direction);
            if (difficulty === 'easy') {
                return conditions.length === 0;
            } else if (difficulty === 'medium') {
                return !conditions.includes(MoveConditions.OPPONENT_CHECKERS as any);
            } else {
                return conditions.length === 0 && !conditions.includes(MoveConditions.OPPONENT_CHECKERS as any);
            }
        });
  
    return validMoves;
  };
  