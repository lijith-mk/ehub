import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductDetailsScreen = ({ route }) => {

  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Text>{product.name}</Text>
      <Text>₹ {product.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetailsScreen;