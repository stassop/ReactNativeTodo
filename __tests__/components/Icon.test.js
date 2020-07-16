import 'react-native';
import React from 'react';
// Test renderer must be imported after react-native
import TestRenderer from 'react-test-renderer';
import { Text } from 'react-native';

import { Icon } from '../../components/Icon';

describe('Icon', () => {
  it('Renders correctly when icon name is provided', () => {
    const icon = 'delete';
    const style = {color: 'red'};
    const defaultStyle = {fontFamily: 'MaterialIcons-Regular', fontSize: 30};

    const testRenderer = TestRenderer.create(
      <Icon
        icon={icon}
        style={style}
      />
    );

    const component = testRenderer.root;
    const text = component.findByType(Text);

    expect(text.props.children).toBe(icon);
    expect(text.props.style).toStrictEqual([defaultStyle, style]);
  });

  it('Renders correctly when no icon name is provided', () => {
    const testRenderer = TestRenderer.create(
      <Icon />
    );

    const component = testRenderer.root;

    expect(component.children.length).toBe(0);
  });
});
