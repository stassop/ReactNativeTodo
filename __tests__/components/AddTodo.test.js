import 'react-native';
import React from 'react';
// Test renderer must be imported after react-native
import TestRenderer from 'react-test-renderer';
import { Button, TextInput, ActivityIndicator } from 'react-native';

import { AddTodo } from '../../components/AddTodo';

describe('AddTodo', () => {
  it('Handles add actions correctly', () => {
    const text = 'Todo';
    const onAdd = jest.fn();
    let testRenderer;

    // Wrap TestRenderer.create() in TestRenderer.act() for hooks to take effect
    TestRenderer.act(() => {
      testRenderer = TestRenderer.create(
        <AddTodo onAdd={onAdd} />
      );
    });

    const component = testRenderer.root;
    const button = component.findByType(Button);
    const textInput = component.findByType(TextInput);

    // Wrap each method call in a seaprate TestRenderer.act()
    // to make sure each call takes effect before the next one
    TestRenderer.act(() => {
      textInput.props.onChangeText(text);
    });

    TestRenderer.act(() => {
      button.props.onPress();
    });

    expect(onAdd).toHaveBeenCalledWith(text);
  });

  it('Renders correctly when in progress', () => {
    const testRenderer = TestRenderer.create(
      <AddTodo progress={true} />
    );

    const component = testRenderer.root;
    const button = component.findByType(Button);
    const activityIndicator = component.findByType(ActivityIndicator);

    expect(button.props.disabled).toBe(true);
  });
});
