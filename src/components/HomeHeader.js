import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import COLORS from '../theme/colors';
import SPACING from '../theme/spacing';
import TYPOGRAPHY from '../theme/typography';

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hello 👋
      </Text>

      <Text style={styles.title}>
        Welcome to Ehub
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
  },

  greeting: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textLight,
  },

  title: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: TYPOGRAPHY.titleWeight,
    color: COLORS.text,
    marginTop: 5,
  },
});

export default HomeHeader;