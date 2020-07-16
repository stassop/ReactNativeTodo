import React, { useState, useEffect } from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Platform,
  Text,
  UIManager,
  View,
} from 'react-native';

import { Icon } from './Icon';

// Android LayoutAnimation fix
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const styles = StyleSheet.create({
  error: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    flexDirection: 'row',
    marginBottom: 20,
    padding: 20,
  },
  text: {
    color: 'white',
    flex: 1,
    fontSize: 20,
  },
  icon: {
    color: 'white',
    marginRight: 10,
  }
});

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

export const Error = props => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    animate();
    setIsVisible(!!props.text);
  }, [props.text]);

  return (
    <>
      {
        isVisible &&
        <View style={styles.error}>
          <Icon icon="error" style={styles.icon} />
          <Text style={styles.text}>
            {props.text}
          </Text>
        </View>
      }
    </>
  );
};
