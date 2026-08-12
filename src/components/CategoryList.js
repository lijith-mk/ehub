import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import categories from '../data/categories';
import COLORS from '../theme/colors';

const CategoryList = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    const next = selected === id ? null : id;
    setSelected(next);
    onSelect && onSelect(next);
  };

  const renderCategory = ({ item }) => {
    const isActive = selected === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, isActive && styles.cardActive]}
        onPress={() => handleSelect(item.id)}
        activeOpacity={0.75}
      >
        <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
          <Ionicons name={item.icon} size={24} color={isActive ? '#fff' : COLORS.primary} />
        </View>
        <Text style={[styles.name, isActive && styles.nameActive]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
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
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    gap: 12,
  },
  card: {
    alignItems: 'center',
    width: 80,
  },
  cardActive: {},
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  iconWrapActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  nameActive: {
    color: COLORS.primary,
  },
});

export default CategoryList;
