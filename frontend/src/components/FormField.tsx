import type React from "react"
import { View, StyleSheet, type TextInputProps } from "react-native"
import { TextInput, HelperText } from "react-native-paper"
import { spacing } from "../theme"

interface FormFieldProps extends TextInputProps {
  label: string
  value: string
  onChangeText: (text: string) => void
  error?: string
  secureTextEntry?: boolean
  icon?: string
  multiline?: boolean
  numberOfLines?: number
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  icon,
  multiline,
  numberOfLines,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[styles.input, multiline && styles.multilineInput]}
        left={icon ? <TextInput.Icon icon={icon} /> : undefined}
        error={!!error}
        {...rest}
      />
      {error ? <HelperText type="error">{error}</HelperText> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
  },
  input: {
    backgroundColor: "transparent",
  },
  multilineInput: {
    minHeight: 100,
  },
})

export default FormField
