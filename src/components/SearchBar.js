import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import COLORS from '../theme/colors';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <Ionicons name="search-outline" size={20} color={focused ? COLORS.primary : COLORS.textLight} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Search products, brands..."
        placeholderTextColor={COLORS.textLight}
        value={query}
        onChangeText={(t) => {
          setQuery(t);
          onSearch && onSearch(t);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={() => { setQuery(''); onSearch && onSearch(''); }}>
          <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.filterBtn}>
        <Ionicons name="options-outline" size={18} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
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
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  focused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 0,
  },
  filterBtn: {
    marginLeft: 8,
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;
