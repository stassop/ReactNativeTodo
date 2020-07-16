import 'react-native';
import React from 'react';
// Test renderer must be imported after react-native
import TestRenderer from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';

import { Icon } from '../../components/Icon';
import { Checkbox } from '../../components/Checkbox';

describe('Checkbox', () => {
  it('Renders correctly when unchecked', () => {
    const testRenderer = TestRenderer.create(
      <Checkbox checked={false} />
    );

    const component = testRenderer.root;
    const icon = component.findByType(Icon);

    expect(icon.props.icon).toBe('check_box_outline_blank');
  });

  it('Renders correctly when checked', () => {
    const testRenderer = TestRenderer.create(
      <Checkbox checked={true} />
    );

    const component = testRenderer.root;
    const icon = component.findByType(Icon);

    expect(icon.props.icon).toBe('check_box');
  });

  it('Renders correctly when disabled', () => {
    const testRenderer = TestRenderer.create(
      <Checkbox disabled={true} />
    );

    const component = testRenderer.root;
    const touchable = component.findByType(TouchableOpacity);
    const icon = component.findByType(Icon);
    const style = {color: 'lightgray'};

    expect(touchable.props.disabled).toBe(true);
    expect(icon.props.style).toContainEqual(style);
  });

  it('Handles press actions correctly', () => {
    const onChange = jest.fn();

    const testRenderer = TestRenderer.create(
      <Checkbox
        checked={false}
        onChange={onChange}
      />
    );

    const component = testRenderer.root;
    const touchable = component.findByType(TouchableOpacity);

    touchable.props.onPress();

    expect(onChange).toHaveBeenCalledWith(true);
  });
});
