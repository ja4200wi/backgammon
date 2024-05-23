import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  Animated,
} from 'react-native';

interface DiceProps {
  diceOne: number;
  diceTwo: number;
}

const DICE_IMAGES: {[key: number]: ImageSourcePropType} = {
  1: require('../images/diceOne.png'),
  2: require('../images/diceTwo.png'),
  3: require('../images/diceThree.png'),
  4: require('../images/diceFour.png'),
  5: require('../images/diceFive.png'),
  6: require('../images/diceSix.png'),
};

const Dice: React.FC<DiceProps> = ({diceOne, diceTwo}) => {
  const randnumb = () => Math.floor(Math.random() * 6) + 1;
  const [curDice, setDice] = useState([DICE_IMAGES[1], DICE_IMAGES[2]]);
  const [shakeAnimation] = useState(new Animated.Value(0));

  const rolldice = () => {
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
      setTimeout(() => {
        setDice([DICE_IMAGES[randnumb()], DICE_IMAGES[randnumb()]]);
      }, 100);
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
    <TouchableOpacity style={styles.container} onPress={rolldice}>
      <Animated.View style={[styles.diceContainer, animatedStyle]}>
        <Image style={styles.dice} source={curDice[0]} />
        <Image style={styles.dice} source={curDice[1]} />
      </Animated.View>
    </TouchableOpacity>
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
