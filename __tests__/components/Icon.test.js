import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Text } from 'react-native';

import { Icon } from '../../components/Icon';
import { Fonts, FontSizes } from '../../components/Styles';

describe('Icon', () => {
  it('Renders an icon', () => {
    const iconName = 'delete';
    const renderer = TestRenderer.create(
      <Icon icon={ iconName } />
    );
    const root = renderer.root;
    const text = root.findByType(Text);
    const baseStyle = {
      fontFamily: Fonts.icon,
      fontSize: FontSizes.icon,
    };

    expect(text.props.children).toBe(iconName);
    expect(text.props.style).toContainEqual(baseStyle);
  });
});
