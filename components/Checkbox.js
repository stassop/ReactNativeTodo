import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { Icon } from './Icon';

export const Checkbox = props => (
  <TouchableOpacity
    disabled={props.disabled}
    onPress={() => props.onChange(!props.checked)}
  >
    <Icon
      icon={props.checked ? 'check_box' : 'check_box_outline_blank'}
      style={[
        props.checked ? styles.checked : styles.unchecked,
        props.disabled && styles.disabled,
      ]}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  checked: {
    color: '#2196f3'
  },
  unchecked: {
    color: 'gray'
  },
  disabled: {
    color: 'lightgray'
  }
});
