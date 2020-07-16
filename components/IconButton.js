import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { Icon } from './Icon';

export const IconButton = props => (
  <TouchableOpacity
    disabled={props.disabled}
    onPress={props.onPress}
  >
    <Icon
      icon={props.icon}
      style={props.disabled ? styles.disabled : styles.active}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  active: {
    color: '#2196f3'
  },
  disabled: {
    color: 'lightgray'
  }
});
