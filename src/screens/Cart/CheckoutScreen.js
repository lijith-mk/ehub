import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import api from '../../api/api';
import { CartContext } from '../../context/CartContext';
import CustomInput from '../../components/CustomInput';
import COLORS from '../../theme/colors';

const CheckoutScreen = ({ navigation, route }) => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { total } = route.params || { total: 0 };

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!name || !phone || !address || !city || !pincode) {
      Alert.alert('Missing Fields', 'Please fill all delivery details');
      return;
    }
    try {
      setLoading(true);

      const products = cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const deliveryFee = total >= 499 ? 0 : 49;

      await api.post('/orders', {
        products,
        totalPrice: total + deliveryFee,
        deliveryAddress: { name, phone, address, city, pincode },
      });

      clearCart();
      navigation.replace('OrderSuccess');
    } catch (error) {
      Alert.alert(
        'Order Failed',
        error.response?.data?.message || 'Unable to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>

        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Checkout</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            <CustomInput placeholder="Full Name" value={name} onChangeText={setName} icon="person-outline" />
            <CustomInput placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" icon="call-outline" />
            <CustomInput placeholder="Street Address" value={address} onChangeText={setAddress} icon="home-outline" />
            <CustomInput placeholder="City" value={city} onChangeText={setCity} icon="business-outline" />
            <CustomInput placeholder="Pincode" value={pincode} onChangeText={setPincode} keyboardType="number-pad" icon="map-outline" />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Order Summary</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{total.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                  {total >= 499 ? 'FREE' : '₹49'}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Payable</Text>
                <Text style={styles.totalValue}>
                  ₹{(total >= 499 ? total : total + 49).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card-outline" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Payment Method</Text>
            </View>
            <TouchableOpacity style={styles.payOption}>
              <View style={styles.payLeft}>
                <Ionicons name="cash-outline" size={22} color={COLORS.primary} />
                <Text style={styles.payLabel}>Cash on Delivery</Text>
              </View>
              <View style={styles.radioActive}>
                <View style={styles.radioDot} />
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.placeBtn, loading && styles.placeBtnDisabled]}
            onPress={placeOrder}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.placeBtnText}>{loading ? 'Placing Order...' : 'Place Order'}</Text>
            {!loading && <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  payLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  radioActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  placeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 17,
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  placeBtnDisabled: {
    opacity: 0.65,
  },
  placeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CheckoutScreen;
