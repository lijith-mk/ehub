import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';

import ProductCard from '../../components/ProductCard';
import HomeHeader from '../../components/HomeHeader';
import SearchBar from '../../components/SearchBar';
import Banner from '../../components/Banner';
import CategoryList from '../../components/CategoryList';

import api from '../../api/api';

import COLORS from '../../theme/colors';
import SPACING from '../../theme/spacing';
import TYPOGRAPHY from '../../theme/typography';

const HomeScreen = ({ navigation }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {

      const response = await api.get('/products');

      setProducts(response.data.products);

    } catch (error) {

      Alert.alert(
        'Error',
        'Unable to load products'
      );

      console.log(error.response?.data || error.message);

    } finally {

      setLoading(false);

    }
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      item={item}
      onPress={() =>
        navigation.navigate('ProductDetails', {
          product: item,
        })
      }
    />
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        ListHeaderComponent={
          <>
            <HomeHeader />

            <SearchBar />

            <Banner />

            <CategoryList />

            <View style={styles.featuredContainer}>
              <Text style={styles.featuredTitle}>
                Featured Products
              </Text>
            </View>
          </>
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

  productList: {
    paddingHorizontal: 8,
    paddingBottom: SPACING.xl,
  },

  featuredContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },

  featuredTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.titleWeight,
    color: COLORS.text,
  },

});

export default HomeScreen;