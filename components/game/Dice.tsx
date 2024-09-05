import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Animated,
} from 'react-native';
import { DICE_COLORS } from '../../utils/constants';

export interface DiceProps {
  diceOne: number;
  diceTwo: number;
  color: DICE_COLORS;
  startingSeq: boolean;
  firstRoll: boolean;
}

const WHITE_DICE_IMAGES: { [key: number]: ImageSourcePropType } = {
  1: require('../images/diceOne.png'),
  2: require('../images/diceTwo.png'),
  3: require('../images/diceThree.png'),
  4: require('../images/diceFour.png'),
  5: require('../images/diceFive.png'),
  6: require('../images/diceSix.png'),
};

const BLACK_DICE_IMAGES: { [key: number]: ImageSourcePropType } = {
  1: require('../images/diceBlackOne.png'),
  2: require('../images/diceBlackTwo.png'),
  3: require('../images/diceBlackThree.png'),
  4: require('../images/diceBlackFour.png'),
  5: require('../images/diceBlackFive.png'),
  6: require('../images/diceBlackSix.png'),
};

const Dice: React.FC<DiceProps> = ({
  diceOne,
  diceTwo,
  color,
  startingSeq,
  firstRoll,
}) => {
  const [curDice, setDice] = useState([
    WHITE_DICE_IMAGES[diceOne], // First dice is white by default in starting sequence
    BLACK_DICE_IMAGES[diceTwo], // Second dice is black by default in starting sequence
  ]);

  const [shakeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (startingSeq) {
      animateStartingSequence();
    } else {
      animateDice(); // Normal animation when not in starting sequence
    }
  }, [diceOne, diceTwo]);

  const animateStartingSequence = () => {
    let intervalId: NodeJS.Timeout | null = null;
    const randomDiceSequence = [1, 2, 3, 4, 5, 6];
    let currentIndex = 0;

    // Start shaking and rolling dice for 2 seconds
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 1,
        duration: 250, // Shaking phase
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    // Change dice images every 100ms for 2 seconds
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % randomDiceSequence.length;
      const randomDiceOne = randomDiceSequence[currentIndex];
      const randomDiceTwo =
        randomDiceSequence[(currentIndex + 1) % randomDiceSequence.length];
      setDice([
        WHITE_DICE_IMAGES[randomDiceOne],
        BLACK_DICE_IMAGES[randomDiceTwo],
      ]);
    }, 100);

    // After 2 seconds, stop rolling and compare dice
    const timeoutID = setTimeout(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }

      // Show the actual dice results (pause for 0.5 seconds)
      setDice([WHITE_DICE_IMAGES[diceOne], BLACK_DICE_IMAGES[diceTwo]]);
    }, 1400);
    return () => clearTimeout(timeoutID);
  };
  const animateDice = () => {
    if (!firstRoll) {
      let intervalId: NodeJS.Timeout | null = null;
      const randomDiceSequence = [1, 2, 3, 4, 5, 6];
      let currentIndex = 0;

      // Start shaking animation
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 1,
          duration: 250, // Shake phase
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 250, // Return to original
          useNativeDriver: true,
        }),
      ]).start();

      // Set interval for random dice images every 100ms
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % randomDiceSequence.length;
        const randomDiceOne = randomDiceSequence[currentIndex];
        const randomDiceTwo =
          randomDiceSequence[(currentIndex + 1) % randomDiceSequence.length];
        if (color === DICE_COLORS.WHITE) {
          setDice([
            WHITE_DICE_IMAGES[randomDiceOne],
            WHITE_DICE_IMAGES[randomDiceTwo],
          ]);
        } else {
          setDice([
            BLACK_DICE_IMAGES[randomDiceOne],
            BLACK_DICE_IMAGES[randomDiceTwo],
          ]);
        }
      }, 100);

      // Stop after 500ms and show final dice
      const timeoutID = setTimeout(() => {
        if (intervalId) {
          clearInterval(intervalId);
        }

        if (color === DICE_COLORS.WHITE) {
          setDice([WHITE_DICE_IMAGES[diceOne], WHITE_DICE_IMAGES[diceTwo]]);
        } else {
          setDice([BLACK_DICE_IMAGES[diceOne], BLACK_DICE_IMAGES[diceTwo]]);
        }
      }, 500); // Normal dice rolling lasts for 500ms
      return () => clearTimeout(timeoutID);
    } else {
      if (diceOne && diceTwo) {
        if (color === DICE_COLORS.WHITE) {
          setDice([WHITE_DICE_IMAGES[diceOne], WHITE_DICE_IMAGES[diceTwo]]);
        } else {
          setDice([BLACK_DICE_IMAGES[diceOne], BLACK_DICE_IMAGES[diceTwo]]);
        }
      }
    }
  };

  // Shake interpolation
  const shakeInterpolate = shakeAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '10deg', '-10deg'],
  });

  const animatedStyle = {
    transform: [
      {
        rotate: shakeInterpolate,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.diceContainer,
          {
            width: startingSeq ? 250 : 'auto',
            justifyContent: startingSeq ? 'space-evenly' : 'center',
          },
          animatedStyle,
        ]}
      >
        <Image style={styles.dice} source={curDice[0]} />
        <Image style={styles.dice} source={curDice[1]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  diceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dice: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
});

export default Dice;
