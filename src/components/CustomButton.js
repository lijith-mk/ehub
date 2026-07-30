import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563EB',
    height: 55,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default CustomButton;