import 'react-native';
import React from 'react';
// Test renderer must be imported after react-native
import TestRenderer from 'react-test-renderer';
import { Text, LayoutAnimation } from 'react-native';

import { Error } from '../../components/Error';

// We need this to prevent jest errors related to animation
jest.spyOn(LayoutAnimation, 'configureNext')
  .mockImplementation(jest.fn());

describe('Error', () => {
  it('Renders correctly when error text is provided', () => {
    const error = 'Some error';
    let testRenderer;

    // Wrap TestRenderer.create() in TestRenderer.act() for hooks to take effect
    TestRenderer.act(() => {
      testRenderer = TestRenderer.create(
        <Error text={error} />
      );
    });

    const component = testRenderer.root;
    const text = component.findByProps({children: error});

    expect(text.type).toBe(Text);
  });

  it('Renders nothing when no error text is provided', () => {
    let testRenderer;

    // Wrap TestRenderer.create() in TestRenderer.act() for hooks to take effect
    TestRenderer.act(() => {
      testRenderer = TestRenderer.create(
        <Error />
      );
    });

    const component = testRenderer.root;

    expect(component.children.length).toBe(0);
  });
});
