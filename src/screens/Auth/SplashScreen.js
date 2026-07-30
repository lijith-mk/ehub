import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';

const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor="#2563EB"
        barStyle="light-content"
      />

      <View style={styles.container}>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>E</Text>
        </View>

        <Text style={styles.title}>
          Ehub
        </Text>

        <Text style={styles.tagline}>
          Everything You Need, One Hub.
        </Text>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },

  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  tagline: {
    marginTop: 10,
    fontSize: 16,
    color: '#E5E7EB',
  },
});

export default SplashScreen;