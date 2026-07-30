import React from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  StyleSheet,
  View,
} from 'react-native';

import ProductCard from '../../components/ProductCard';
import HomeHeader from '../../components/HomeHeader';
import SearchBar from '../../components/SearchBar';
import Banner from '../../components/Banner';
import CategoryList from '../../components/CategoryList';

import products from '../../data/products';

import COLORS from '../../theme/colors';
import SPACING from '../../theme/spacing';
import TYPOGRAPHY from '../../theme/typography';

const HomeScreen = ({ navigation }) => {

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

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
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