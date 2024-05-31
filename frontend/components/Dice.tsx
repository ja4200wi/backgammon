import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  Animated,
} from 'react-native';

export interface DiceProps {
  diceOne: number;
  diceTwo: number;
}

const DICE_IMAGES: { [key: number]: ImageSourcePropType } = {
  1: require('../images/diceOne.png'),
  2: require('../images/diceTwo.png'),
  3: require('../images/diceThree.png'),
  4: require('../images/diceFour.png'),
  5: require('../images/diceFive.png'),
  6: require('../images/diceSix.png'),
};

const Dice: React.FC<DiceProps> = ({ diceOne, diceTwo }) => {
  const [curDice, setDice] = useState([DICE_IMAGES[diceOne], DICE_IMAGES[diceTwo]]);
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
      setDice([DICE_IMAGES[diceOne], DICE_IMAGES[diceTwo]]);
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
