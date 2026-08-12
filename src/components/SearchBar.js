import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import COLORS from '../theme/colors';

// When onPress is provided (from HomeScreen), tapping opens the SearchScreen.
// When onSearch is provided (standalone mode), it acts as a live input.
const SearchBar = ({ onPress, onSearch }) => {
  if (onPress) {
    // Tappable version — navigates to dedicated SearchScreen
    return (
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
        <Ionicons name="search-outline" size={18} color={COLORS.textLight} style={styles.icon} />
        <Text style={styles.placeholder}>Search products, brands...</Text>
        <View style={styles.filterBtn}>
          <Ionicons name="options-outline" size={16} color={COLORS.primary} />
        </View>
      </TouchableOpacity>
    );
  }

  // Kept for any standalone use
  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 14,
    paddingHorizontal: 14,
    height: 52,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  icon: { marginRight: 10 },
  placeholder: {
    flex: 1, fontSize: 14, color: COLORS.textLight,
  },
  filterBtn: {
    marginLeft: 8, width: 34, height: 34, borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
});

export default SearchBar;
