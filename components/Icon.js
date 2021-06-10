import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Fonts, FontSizes } from './Styles';

export const Icon = ({ icon, style }) => (
  <Text style={[ styles.icon, style ]}>
    { icon }
  </Text>
);

const styles = StyleSheet.create({
  icon: {
    fontFamily: Fonts.icon,
    fontSize: FontSizes.icon,
  },
});
