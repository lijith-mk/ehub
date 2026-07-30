import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';

import COLORS from '../theme/colors';
import SPACING from '../theme/spacing';
import SHADOWS from '../theme/shadows';

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search products..."
        placeholderTextColor={COLORS.textLight}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
  },

  input: {
    height: 50,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.card,
  },
});

export default SearchBar;