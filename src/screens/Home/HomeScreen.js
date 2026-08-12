import React, { useEffect, useState, useContext } from 'react';
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

import ProductCard from '../../components/ProductCard';
import HomeHeader from '../../components/HomeHeader';
import SearchBar from '../../components/SearchBar';
import Banner from '../../components/Banner';
import CategoryList from '../../components/CategoryList';

import api from '../../api/api';
import { CartContext } from '../../context/CartContext';
import COLORS from '../../theme/colors';
import categories from '../../data/categories';

// Map category id → name for filtering
const getCategoryName = (id) => {
  const cat = categories.find((c) => c.id === id);
  return cat?.name || '';
};

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      const list = response.data.products || [];
      setProducts(list);
      setFiltered(list);
    } catch (error) {
      const msg =
        error.code === 'ECONNABORTED'
          ? 'Server timeout. Check your connection.'
          : 'Unable to load products. Is the server running?';
      Alert.alert('Error', msg);
      setProducts([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  // Central filter — runs whenever search or category changes
  const applyFilters = (query, categoryId, allProducts) => {
    let result = allProducts;

    // Category filter — id '1' is "All"
    if (categoryId && categoryId !== '1') {
      const catName = getCategoryName(categoryId);
      result = result.filter(
        (p) => p.category?.toLowerCase() === catName.toLowerCase()
      );
    }

    // Search filter
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, activeCategory, products);
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    applyFilters(searchQuery, categoryId, products);
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    Alert.alert('Added to Cart', `${item.name} added successfully`);
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      item={item}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      onAddToCart={handleAddToCart}
    />
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loaderText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <FlatList
        data={filtered}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <>
            <HomeHeader navigation={navigation} />
            <SearchBar onPress={() => navigation.navigate('Search')} />
            <Banner navigation={navigation} />
            <CategoryList onSelect={handleCategorySelect} />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeCategory && activeCategory !== '1'
                  ? getCategoryName(activeCategory)
                  : 'Featured Products'}
              </Text>
              <Text style={styles.sectionCount}>{filtered.length} items</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="storefront-outline" size={52} color={COLORS.border} />
            <Text style={styles.emptyText}>No products found</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchProducts}>
              <Text style={styles.retryText}>Tap to retry</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: 12,
  },
  loaderText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  list: {
    paddingBottom: 30,
    paddingHorizontal: 4,
  },
  row: {
    paddingHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  sectionCount: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 15,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
  },
  retryText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default HomeScreen;
