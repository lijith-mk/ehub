import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';
import COLORS from '../theme/colors';

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  icon,
}) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.outerWrap}>
      <View style={[styles.wrapper, focused && styles.wrapperFocused]}>
        {icon && (
          <Ionicons
            name={icon}
            size={19}
            color={focused ? COLORS.primary : COLORS.textLight}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setHidden(!hidden)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={19}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrap: {
    marginTop: 14,
    height: 56,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    // NO elevation here — elevation changes cause layout recalculation loop on Android
  },
  wrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    // No elevation, no shadow — purely color change only
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 0,
    includeFontPadding: false,
  },
});

export default CustomInput;
