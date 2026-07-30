import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

import categories from '../data/categories';

import COLORS from '../theme/colors';
import SPACING from '../theme/spacing';
import TYPOGRAPHY from '../theme/typography';
import SHADOWS from '../theme/shadows';

const CategoryList = () => {

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Ionicons
  name={item.icon}
  size={28}
  color={COLORS.primary}
/>
      <Text style={styles.categoryName}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>

      <Text style={styles.title}>
        Categories
      </Text>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

    </View>
  );
};

const styles = StyleSheet.create({

  title: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.titleWeight,
    color: COLORS.text,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },

  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },

  categoryCard: {
    width: 90,
    height: 90,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.card,
  },

  categoryName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

});

export default CategoryList;