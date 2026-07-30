import React from 'react';
import {
  TextInput,
  StyleSheet,
} from 'react-native';

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginTop: 18,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});

export default CustomInput;