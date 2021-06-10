import React from 'react';
import TestRenderer from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';

import { Icon } from '../../components/Icon';
import { IconButton } from '../../components/IconButton';

describe('IconButton', () => {
  it('Handles active state', () => {
    const iconName = 'delete';
    const renderer = TestRenderer.create(
      <IconButton icon={ iconName } />
    );
    const root = renderer.root;
    const icon = root.findByType(Icon);

    expect(icon.props.icon).toBe(iconName);
  });

  it('Handles disabled state', () => {
    const renderer = TestRenderer.create(
      <IconButton disabled={ true } />
    );
    const root = renderer.root;
    const touchable = root.findByType(TouchableOpacity);

    expect(touchable.props.disabled).toBe(true);
  });

  it('Handles press', () => {
    const onPressMock = jest.fn();
    const renderer = TestRenderer.create(
      <IconButton onPress={ onPressMock } />
    );
    const root = renderer.root;
    const touchable = root.findByType(TouchableOpacity);

    touchable.props.onPress();

    expect(onPressMock).toHaveBeenCalled();
  });
});
