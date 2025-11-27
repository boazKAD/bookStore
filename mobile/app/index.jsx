import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={Styles.container }
    >
      <Text style={Styles.title}>Hello</Text>
      <Link href="auth/signup">Signup</Link>
      <Link href="auth"> Login</Link>
    </View>
  );
}
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
  },
});
