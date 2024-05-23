import React, {useState} from 'react';
import {View, StyleSheet, Image, ImageSourcePropType, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface diceProps {
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

//später just use diceOne and diceTwo um würfel anzuzeigen

const Dice: React.FC<diceProps> = (diceOne, diceTwo) => {
  const randnumb = () => {
    return Math.floor(Math.random() * 6) + 1;
  };
  const [curDice, setDice] = useState([DICE_IMAGES[1], DICE_IMAGES[2]]);
  const rolldice = () => {
    setDice([DICE_IMAGES[randnumb()], DICE_IMAGES[randnumb()]]);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={rolldice}>
      <View style={styles.diceContainer}>
        <Image style={styles.dice} source={curDice[0]} />
        <Image style={styles.dice} source={curDice[1]} />
      </View>
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
  button: {
    backgroundColor: 'green',
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Dice;
