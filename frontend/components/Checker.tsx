import React from 'react';
import {View, StyleSheet} from 'react-native';

interface CheckerProps {
  color: string;
  width: number;
  height: number;
  style?: any;
}

const Checker: React.FC<CheckerProps> = ({color, width, height}) => {
  return (
    <View
      style={[
        styles.checker,
        {backgroundColor: color, width: width, height: height},
      ]}
    />
  );
};

const styles = StyleSheet.create({
  checker: {
    borderRadius: 100,
  },
});

export default Checker;
