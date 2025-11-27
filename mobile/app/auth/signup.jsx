import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "../../assets/styles/signup.styles";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { user, isLoading, register } = useAuthStore();
    console.log(user);
    const handleSignup = async () => {
        // Handle signup logic here
        const result = await register(username, email, password);
        if (!result.success) Alert.alert("Signup Failed", result.message);
    }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>BookWorm🐛</Text>
            <Text style={styles.subtitle}>Share your favorite reads</Text>
          </View>
            {/* FORM */}
            <View style={styles.formContainer}>
                {/* USERNAME INPUT */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Username</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            placeholderTextColor={COLORS.placeholderText}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>
                </View>
                {/* EMAIL INPUT */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor={COLORS.placeholderText}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                </View>
                {/* PASSWORD INPUT */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={COLORS.placeholderText}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={COLORS.primary}
                            style={styles.inputIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    </View>
                </View>
                {/* SIGNUP BUTTON */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
                        <Text style={styles.buttonText}>{isLoading ? "Signing Up..." : "Sign Up"}</Text>
                    </TouchableOpacity>
                </View>
                {/* FOOTER */}
            <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Text style={styles.link} onPress={() => router.back()}> Login</Text>
            </View>
            </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
