import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';

import { Checkbox } from '../../components/Checkbox';
import { Colors } from '../../components/Styles';
import { Icon } from '../../components/Icon';

describe('Checkbox', () => {
  it('Handles unchecked state', () => {
    const renderer = TestRenderer.create(
      <Checkbox checked={ false } />
    );
    const root = renderer.root;
    const icon = root.findByType(Icon);

    expect(icon.props.icon).toBe('radio_button_unchecked');
  });

  it('Handles checked state', () => {
    const renderer = TestRenderer.create(
      <Checkbox checked={ true } />
    );
    const root = renderer.root;
    const icon = root.findByType(Icon);

    expect(icon.props.icon).toBe('radio_button_checked');
  });

  it('Handles disabled state', () => {
    const renderer = TestRenderer.create(
      <Checkbox disabled={ true } />
    );
    const root = renderer.root;
    const touchable = root.findByType(TouchableOpacity);

    expect(touchable.props.disabled).toBe(true);
  });

  it('Handles press', () => {
    const onChangeMock = jest.fn();
    const renderer = TestRenderer.create(
      <Checkbox checked={ false } onChange={ onChangeMock } />
    );
    const root = renderer.root;
    const touchable = root.findByType(TouchableOpacity);

    touchable.props.onPress();

    expect(onChangeMock).toHaveBeenCalledWith(true);
  });
});
