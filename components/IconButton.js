import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { Icon } from './Icon';
import { Colors  } from './Styles';

export const IconButton = ({ icon, onPress, disabled }) => (
  <TouchableOpacity
    disabled={ disabled }
    onPress={ onPress }
  >
    <Icon
      icon={ icon }
      style={[ styles.icon, disabled && styles.disabled ]}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  icon: {
    color: Colors.buttonActive,
    fontSize: 32,
  },
  disabled: {
    color: Colors.buttonDisabled,
  }
});
