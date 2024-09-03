import { StyleSheet } from "react-native";
import { APP_COLORS, DIMENSIONS } from "./constants";

export const GLOBAL_STYLES = StyleSheet.create({
    buttonDisabled: {
      backgroundColor: 'white',
      opacity: 0.3,
    },
    buttonActive: {
      backgroundColor: 'white',
    },
    card: {
      borderRadius: 15,
      borderColor: 'transparent',
      backgroundColor: APP_COLORS.cardBackgroundColor,
      opacity: .9,
      padding: 16,
      marginBottom: 20,
      elevation: 0, // Remove elevation on Android
      shadowColor: 'transparent', // Remove shadow color on iOS
    },
    headline: {
      color: '#FFF',
      fontSize: 24,
      fontWeight: '500',
      flex: 1,
      //fontFamily: 'Roboto-Regular',
    },
    lineItems: {
      color: '#FFF',
      fontSize: 16,
    }
    // Add other styles as needed
  });