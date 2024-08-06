import { View, Text, StyleSheet } from "react-native";
import AcceptMoveButton from "../components/AcceptMoveButton";
import UndoMoveButton from "../components/UndoMoveButton";
import DoubleButton from "../components/DoulbeButton";

export default function SignupScr() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Signup Screen</Text>
      <AcceptMoveButton onPress={() => {}} disabled={false} />
      <AcceptMoveButton onPress={() => {}} disabled={true} />
      <UndoMoveButton onPress={() => {}} disabled={false} />
      <UndoMoveButton onPress={() => {}} disabled={true} />
      <DoubleButton onPress={() => {}} disabled={false} />
      <DoubleButton onPress={() => {}} disabled={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'brown'
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
