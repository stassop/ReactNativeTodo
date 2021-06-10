import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import * as reactRedux from 'react-redux'

import { Error } from '../../components/Error';

jest.useFakeTimers(); // Prevent issues with LayoutAnimation

describe('Error', () => {
  it('Renders an error', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue('Error'); // state.error

    let renderer;
    // Wrap create() in act() for hooks to take effect
    TestRenderer.act(() => {
      renderer = TestRenderer.create(
        <Error />
      );
    });
    const root = renderer.root;
    const text = root.findByType(Text);

    expect(text.props.children).toBe('Error');
  });

  it('Renders nothing without an error', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(null); // state.error

    let renderer;
    // Wrap create() in act() for hooks to take effect
    TestRenderer.act(() => {
      renderer = TestRenderer.create(
        <Error />
      );
    });
    const root = renderer.root;

    expect(root.children.length).toBe(0);
  });
});
