import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '../theme/colors';

const CustomButton = ({ title, onPress, disabled = false, variant = 'primary' }) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.outline,
        disabled && styles.disabled,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      {disabled ? (
        <ActivityIndicator color={isPrimary ? '#fff' : COLORS.primary} size="small" />
      ) : (
        <Text style={[styles.text, !isPrimary && styles.outlineText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 10,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.65,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineText: {
    color: COLORS.primary,
  },
});

export default CustomButton;
