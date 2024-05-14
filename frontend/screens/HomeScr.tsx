import { View, Text, StyleSheet, Button, SafeAreaView, ScrollView, StatusBar} from "react-native";

export default function HomeScr({navigation}) {
  return (
    
    <SafeAreaView style={[styles.container,{backgroundColor: "#28231C"}]}>
      <StatusBar
        barStyle={'dark-content'}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[{backgroundColor: "#1f4336"}]}>
        <View
          style={{
            backgroundColor: "#1f4336",
          }}>
    <View>
      <Text style={styles.text}>Home Screen</Text>
      <Button
            title="Press to play"
            onPress={() => navigation.navigate("Game")}
          />
    </View>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#F5E8B6",
  },
});
