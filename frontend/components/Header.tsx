import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { Card, Icon, Button, Tooltip } from '@rneui/themed';
import { DIMENSIONS } from '../utils/constants';
import NavBar from '../components/NavBar';
import Friends from '../images/group.svg';


export default function Header({}) {
  return (
    <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Icon name="people" type="material" color="white" size={30} />
          <Text style={styles.headerText}>Gammon.com</Text>
          <Icon name="settings" type="material" color="white" size={30} />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
      },
      headerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
      },
      headerContainer: {
        paddingRight: 16,
        paddingLeft: 16,
        backgroundColor: '#312F2C',
        zIndex: 2
      },
});