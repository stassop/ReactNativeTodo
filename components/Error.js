import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SafeAreaView, LayoutAnimation, StyleSheet, Platform, Text, UIManager, View } from 'react-native';

import { Colors, Fonts, FontSizes } from './Styles';

// Android LayoutAnimation fix
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const animate = () => {
  const config = {
    duration: 200,
    create: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity
    },
    delete: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity
    }
  };
  LayoutAnimation.configureNext(config);
};

export const Error = () => {
  const error = useSelector(state => state.error);
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    animate();
    setVisible(!!error);
  }, [ error ]);

  return (
    <>
      { visible && error &&
        <SafeAreaView style={ styles.container }>
          <Text style={ styles.text }>
            { error.message || error }
          </Text>
        </SafeAreaView>
      }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    color: 'white',
    fontSize: FontSizes.body,
    fontFamily: Fonts.medium,
    margin: 20,
  },
});
