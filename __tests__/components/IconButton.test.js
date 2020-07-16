import 'react-native';
import React from 'react';
// Test renderer must be imported after react-native
import TestRenderer from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';

import { Icon } from '../../components/Icon';
import { IconButton } from '../../components/IconButton';

describe('IconButton', () => {
  it('Renders correctly when active', () => {
    const iconName = 'delete';

    const testRenderer = TestRenderer.create(
      <IconButton icon={iconName} />
    );

    const component = testRenderer.root;
    const icon = component.findByType(Icon);

    expect(icon.props.icon).toBe(iconName);
  });

  it('Renders correctly when disabled', () => {
    const iconName = 'delete';

    const testRenderer = TestRenderer.create(
      <IconButton
        icon={iconName}
        disabled={true}
      />
    );

    const component = testRenderer.root;
    const touchable = component.findByType(TouchableOpacity);
    const icon = component.findByType(Icon);
    const style = {color: 'lightgray'};

    expect(touchable.props.disabled).toBe(true);
    expect(icon.props.style).toEqual(style);
  });

  it('Handles press actions correctly', () => {
    const iconName = 'delete';
    const onPress = jest.fn();

    const testRenderer = TestRenderer.create(
      <IconButton
        icon={iconName}
        onPress={onPress}
      />
    );

    const component = testRenderer.root;
    const touchable = component.findByType(TouchableOpacity);

    touchable.props.onPress();

    expect(onPress).toHaveBeenCalled();
  });
});
