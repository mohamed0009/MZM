import React from 'react';
import { StyleSheet, Text, TextInput as RNTextInput, View, ViewStyle, TextInputProps, StyleProp, TextStyle, Platform } from 'react-native';
import Colors from '@/constants/Colors';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textInputStyle?: StyleProp<TextStyle>;
}

export default function TextInput({
  label,
  error,
  containerStyle,
  icon,
  rightIcon,
  multiline,
  textInputStyle,
  ...props
}: CustomTextInputProps) {
  const inputHeight = multiline ? (props.numberOfLines ? props.numberOfLines * 24 : 100) : 50;
  
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer, 
        error && styles.inputError,
        multiline && styles.multilineContainer
      ]}>
        {icon && <View style={[styles.iconContainer, multiline && styles.iconContainerMultiline]}>{icon}</View>}
        <RNTextInput
          style={[
            styles.input, 
            { height: inputHeight },
            multiline && styles.multilineInput,
            icon ? styles.inputWithIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            textInputStyle
          ]}
          placeholderTextColor="#9CA3AF"
          textAlignVertical={multiline ? "top" : "center"}
          multiline={multiline}
          {...props}
        />
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  multilineContainer: {
    alignItems: 'flex-start',
  },
  input: {
    fontFamily: 'Poppins-Regular',
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  multilineInput: {
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  iconContainer: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
  iconContainerMultiline: {
    paddingTop: 16,
  },
  rightIconContainer: {
    justifyContent: 'center',
    paddingRight: 12,
  },
  error: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.light.error,
    marginTop: 4,
  },
});