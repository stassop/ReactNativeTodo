import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { Icon } from './Icon';
import { Colors } from './Styles';

export const Checkbox = ({ onChange, checked, disabled }) => (
  <TouchableOpacity
    disabled={ disabled }
    onPress={ () => onChange(!checked) }
  >
    <Icon
      icon={ checked ? 'radio_button_checked' : 'radio_button_unchecked' }
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
  },
});
