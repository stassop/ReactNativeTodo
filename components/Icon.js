import React from 'react';
import { StyleSheet, Text } from 'react-native';

export const Icon = props => (
  <>
    {
      props.icon &&
      <Text style={[styles.icon, props.style]}>
        {props.icon}
      </Text>
    }
  </>
);

const styles = StyleSheet.create({
  icon: {
    fontFamily: 'MaterialIcons-Regular',
    fontSize: 30,
  },
});
