import React from 'react';
import TestRenderer from 'react-test-renderer';

import { App } from '../../components/App';
import { Error } from '../../components/Error';
import { TodoList } from '../../components/TodoList';

jest.useFakeTimers(); // Prevent issues with LayoutAnimation

describe('App', () => {
  it('Renders other components', () => {
    const renderer = TestRenderer.create(<App />);
    const root = renderer.root;

    expect(root.findAllByType(Error)).toHaveLength(1);
    expect(root.findAllByType(TodoList)).toHaveLength(1);
  });
});
