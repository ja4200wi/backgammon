import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Animated,
} from 'react-native';
import { DICE_COLORS } from '../utils/constants';

export interface DiceProps {
  diceOne: number;
  diceTwo: number;
  color: DICE_COLORS;
}

const WHITE_DICE_IMAGES: {[key: number]: ImageSourcePropType} = {
  1: require('../images/diceOne.png'),
  2: require('../images/diceTwo.png'),
  3: require('../images/diceThree.png'),
  4: require('../images/diceFour.png'),
  5: require('../images/diceFive.png'),
  6: require('../images/diceSix.png'),
};

const BLACK_DICE_IMAGES: {[key: number]: ImageSourcePropType} = {
  1: require('../images/diceBlackOne.png'),
  2: require('../images/diceBlackTwo.png'),
  3: require('../images/diceBlackThree.png'),
  4: require('../images/diceBlackFour.png'),
  5: require('../images/diceBlackFive.png'),
  6: require('../images/diceBlackSix.png'),
};

const Dice: React.FC<DiceProps> = ({diceOne, diceTwo, color}) => {
  const [curDice, setDice] =
    color == DICE_COLORS.WHITE
      ? useState([WHITE_DICE_IMAGES[diceOne], WHITE_DICE_IMAGES[diceTwo]])
      : useState([BLACK_DICE_IMAGES[diceOne], BLACK_DICE_IMAGES[diceTwo]]);
  const [shakeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    animateDice();
  }, [diceOne, diceTwo]);

  const animateDice = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (color == DICE_COLORS.WHITE) {
        setDice([WHITE_DICE_IMAGES[diceOne], WHITE_DICE_IMAGES[diceTwo]]);
      } else {
        setDice([BLACK_DICE_IMAGES[diceOne], BLACK_DICE_IMAGES[diceTwo]]);
      }
    });
  };

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
      <Animated.View style={[styles.diceContainer, animatedStyle]}>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
});

export default Dice;
