import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import COLORS from '../../theme/colors';
import categories from '../../data/categories';

const TRENDING = [
  'Wireless Earbuds', 'Laptop', 'Smart Watch', 'Running Shoes', 'Smartphone',
];

const RECENT_KEY = 'recent_searches';
const MAX_RECENT = 8;

const SORT_OPTIONS = [
  { key: 'default', label: 'Relevance' },
  { key: 'price_asc', label: 'Price: Low to High' },
  { key: 'price_desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Top Rated' },
];

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSort, setActiveSort] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const [searched, setSearched] = useState(false);

  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
    loadRecent();
    fetchAllProducts();
  }, []);

  const loadRecent = () => {
    AsyncStorage.getItem(RECENT_KEY)
      .then((data) => { if (data) setRecentSearches(JSON.parse(data)); })
      .catch(() => {});
  };

  const saveRecent = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((r) => r !== term)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated)).catch(() => {});
  };

  const clearRecent = () => {
    setRecentSearches([]);
    AsyncStorage.removeItem(RECENT_KEY).catch(() => {});
  };

  const fetchAllProducts = () => {
    api.get('/products?limit=100')
      .then((res) => setAllProducts(res.data.products || []))
      .catch(() => {});
  };

  const applyFilters = useCallback((q, catId, sort, products) => {
    let result = [...products];

    if (q.trim()) {
      const lower = q.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(lower) ||
          p.category?.toLowerCase().includes(lower) ||
          p.description?.toLowerCase().includes(lower)
      );
    }

    if (catId && catId !== '1') {
      const catName = categories.find((c) => c.id === catId)?.name || '';
      result = result.filter(
        (p) => p.category?.toLowerCase() === catName.toLowerCase()
      );
    }

    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return result;
  }, []);

  const handleQueryChange = (text) => {
    setQuery(text);
    setSearched(text.length > 0);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const filtered = applyFilters(text, activeCategory, activeSort, allProducts);
      setResults(filtered);
    }, 300);
  };

  const handleSearch = (term) => {
    const q = term || query;
    if (!q.trim()) return;
    setQuery(q);
    setSearched(true);
    saveRecent(q);
    const filtered = applyFilters(q, activeCategory, activeSort, allProducts);
    setResults(filtered);
  };

  const handleCategoryPress = (catId) => {
    const next = activeCategory === catId ? null : catId;
    setActiveCategory(next);
    const filtered = applyFilters(query, next, activeSort, allProducts);
    setResults(filtered);
    if (query || next) setSearched(true);
  };

  const handleSortPress = (sortKey) => {
    setActiveSort(sortKey);
    setShowSort(false);
    const filtered = applyFilters(query, activeCategory, sortKey, allProducts);
    setResults(filtered);
  };

  const renderResultItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultCard}
      activeOpacity={0.85}
      onPress={() => {
        saveRecent(query || item.category || '');
        navigation.navigate('ProductDetails', { product: item });
      }}
    >
      <Image source={{ uri: item.image }} style={styles.resultImg} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultCategory}>{item.category}</Text>
        <Text style={styles.resultName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.resultMeta}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating || '4.0'}</Text>
          </View>
        </View>
        <Text style={styles.resultPrice}>₹{item.price?.toLocaleString()}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  const activeSortLabel = SORT_OPTIONS.find((s) => s.key === activeSort)?.label || 'Sort';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.inputWrap}>
          <Ionicons name="search-outline" size={18} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search products, brands..."
            placeholderTextColor={COLORS.textLight}
            value={query}
            onChangeText={handleQueryChange}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setSearched(false); setResults([]); }}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category filter chips */}
      <View>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => {
            const active = activeCategory === item.id;
            return (
              <TouchableOpacity
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => handleCategoryPress(item.id)}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={item.icon}
                  size={14}
                  color={active ? '#fff' : COLORS.primary}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results area */}
      {!searched ? (
        <FlatList
          data={[]}
          keyExtractor={() => ''}
          renderItem={null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.emptyContent}
          ListEmptyComponent={
            <View>
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={clearRecent}>
                      <Text style={styles.clearText}>Clear all</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tagsWrap}>
                    {recentSearches.map((r, i) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.recentTag}
                        onPress={() => handleSearch(r)}
                      >
                        <Ionicons name="time-outline" size={13} color={COLORS.textLight} />
                        <Text style={styles.recentTagText}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Trending */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
                <View style={styles.tagsWrap}>
                  {TRENDING.map((t, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.trendingTag}
                      onPress={() => handleSearch(t)}
                    >
                      <Ionicons name="trending-up-outline" size={13} color={COLORS.primary} />
                      <Text style={styles.trendingTagText}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Popular categories */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Browse Categories</Text>
                <View style={styles.catGrid}>
                  {categories.filter((c) => c.id !== '1').map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.catGridItem}
                      onPress={() => handleCategoryPress(cat.id)}
                    >
                      <View style={styles.catGridIcon}>
                        <Ionicons name={cat.icon} size={24} color={COLORS.primary} />
                      </View>
                      <Text style={styles.catGridName}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          {/* Sort bar */}
          <View style={styles.sortBar}>
            <Text style={styles.resultsCount}>
              {results.length} result{results.length !== 1 ? 's' : ''}
              {query ? ` for "${query}"` : ''}
            </Text>
            <TouchableOpacity
              style={styles.sortBtn}
              onPress={() => setShowSort(!showSort)}
            >
              <Ionicons name="funnel-outline" size={14} color={COLORS.primary} />
              <Text style={styles.sortBtnText}>{activeSortLabel}</Text>
              <Ionicons name={showSort ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Sort dropdown */}
          {showSort && (
            <View style={styles.sortDropdown}>
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.sortOption, activeSort === opt.key && styles.sortOptionActive]}
                  onPress={() => handleSortPress(opt.key)}
                >
                  <Text style={[styles.sortOptionText, activeSort === opt.key && styles.sortOptionTextActive]}>
                    {opt.label}
                  </Text>
                  {activeSort === opt.key && (
                    <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <FlatList
            data={results}
            keyExtractor={(item) => item._id}
            renderItem={renderResultItem}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.noResults}>
                <View style={styles.noResultsIcon}>
                  <Ionicons name="search-outline" size={44} color={COLORS.primary} />
                </View>
                <Text style={styles.noResultsTitle}>No results found</Text>
                <Text style={styles.noResultsSub}>
                  Try different keywords or browse categories
                </Text>
                <TouchableOpacity
                  style={styles.browseBtn}
                  onPress={() => { setQuery(''); setSearched(false); }}
                >
                  <Text style={styles.browseBtnText}>Browse All</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 12,
  },
  backBtn: {
    width: 42, height: 42, borderRadius: 13, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 14,
    paddingHorizontal: 14, height: 48,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  searchIcon: { marginRight: 8 },
  input: {
    flex: 1, fontSize: 14, color: COLORS.text,
    paddingVertical: 0, includeFontPadding: false,
  },

  // Chips
  chips: { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: COLORS.primaryLight,
    borderWidth: 1, borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: COLORS.primary, borderColor: COLORS.primary,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  chipTextActive: { color: '#fff' },

  // Pre-search content
  emptyContent: { paddingBottom: 30 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  clearText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  recentTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: COLORS.white, borderRadius: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  recentTagText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  trendingTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: COLORS.primaryLight, borderRadius: 20,
  },
  trendingTagText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  // Category grid
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  catGridItem: { width: '21%', alignItems: 'center' },
  catGridIcon: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 6,
  },
  catGridName: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center' },

  // Sort bar
  sortBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 10,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  resultsCount: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  sortBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: COLORS.primaryLight, borderRadius: 10,
  },
  sortBtnText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },

  // Sort dropdown
  sortDropdown: {
    position: 'absolute', top: 50, right: 16, zIndex: 100,
    backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, elevation: 10,
    minWidth: 200,
  },
  sortOption: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  sortOptionActive: { backgroundColor: COLORS.primaryLight },
  sortOptionText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  sortOptionTextActive: { color: COLORS.primary, fontWeight: '700' },

  // Result items
  resultsList: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 30 },
  resultCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 16,
    padding: 12, marginBottom: 10, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  resultImg: {
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: COLORS.inputBg, resizeMode: 'cover',
  },
  resultInfo: { flex: 1 },
  resultCategory: {
    fontSize: 10, fontWeight: '600', color: COLORS.textLight,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3,
  },
  resultName: { fontSize: 14, fontWeight: '700', color: COLORS.text, lineHeight: 19, marginBottom: 5 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  resultPrice: { fontSize: 16, fontWeight: '800', color: COLORS.primary },

  // No results
  noResults: { alignItems: 'center', paddingTop: 60, gap: 10 },
  noResultsIcon: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  noResultsTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  noResultsSub: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', paddingHorizontal: 40 },
  browseBtn: {
    marginTop: 12, paddingHorizontal: 28, paddingVertical: 12,
    backgroundColor: COLORS.primary, borderRadius: 14,
  },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default SearchScreen;
