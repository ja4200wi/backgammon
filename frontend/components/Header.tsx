import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { Card, Icon, Button, Tooltip } from '@rneui/themed';
import { APP_COLORS, DIMENSIONS } from '../utils/constants';
import NavBar from '../components/NavBar';
import Friends from '../images/group.svg';


export default function Header({}) {
  return (
    <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => console.log('Friends')}>
          <Icon name="people" type="material" color={APP_COLORS.iconGrey} size={30} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Gammon.com</Text>
          <TouchableOpacity onPress={() => console.log('Settings')}>
          <Icon name="settings" type="material" color={APP_COLORS.iconGrey} size={30} />
          </TouchableOpacity>
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
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
      },
      headerContainer: {
        paddingRight: 16,
        paddingLeft: 16,
        backgroundColor: APP_COLORS.headerBackGroundColor,
        zIndex: 2
      },
});

