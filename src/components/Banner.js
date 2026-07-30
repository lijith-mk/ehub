import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import COLORS from '../theme/colors';
import SPACING from '../theme/spacing';
import TYPOGRAPHY from '../theme/typography';

const Banner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🔥 Summer Sale
      </Text>

      <Text style={styles.subtitle}>
        Up to 50% OFF on selected products
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Shop Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    borderRadius: 15,
    padding: SPACING.lg,
  },

  title: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.titleWeight,
    color: COLORS.white,
  },

  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.white,
    marginTop: 8,
    marginBottom: 15,
  },

  button: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default Banner;