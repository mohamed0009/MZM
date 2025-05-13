"use client"

import { useState } from "react"
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { TextInput, Button, Text, HelperText, Appbar } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { authService } from "../../services/authService"
import { colors, spacing } from "../../theme"

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigation = useNavigation()

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  async function handleResetPassword() {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      await authService.forgotPassword(email)
      setSuccess(true)
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Reset Password" />
      </Appbar.Header>

      <View style={styles.content}>
        {success ? (
          <View style={styles.successContainer}>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.message}>
              We've sent password reset instructions to {email}. Please check your inbox.
            </Text>
            <Button mode="contained" onPress={() => navigation.navigate("Login")} style={styles.button}>
              Back to Login
            </Button>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
            />

            {error ? <HelperText type="error">{error}</HelperText> : null}

            <Button
              mode="contained"
              onPress={handleResetPassword}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Send Reset Instructions
            </Button>

            <Button mode="text" onPress={() => navigation.navigate("Login")} style={styles.backButton}>
              Back to Login
            </Button>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.l,
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  successContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    opacity: 0.7,
    marginBottom: spacing.l,
  },
  message: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.l,
  },
  input: {
    marginBottom: spacing.m,
  },
  button: {
    marginTop: spacing.m,
    paddingVertical: spacing.xs,
  },
  backButton: {
    marginTop: spacing.m,
  },
})
