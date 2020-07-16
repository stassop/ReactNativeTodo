import 'react-native';
import React from 'react';
// Test renderer must be imported after react-native
import TestRenderer from 'react-test-renderer';
import { Text, ActivityIndicator } from 'react-native';

import { Todo } from '../../components/Todo';
import { Checkbox } from '../../components/Checkbox';
import { IconButton } from '../../components/IconButton';

// Mock
const todo = {id: '1', text: 'Todo', complete: true};

describe('Todo', () => {
  it('Renders correctly when completed', () => {
    const testRenderer = TestRenderer.create(
      <Todo {...todo} />
    );

    const component = testRenderer.root;
    const checkbox = component.findByType(Checkbox);
    const text = component.findByProps({children: todo.text});
    const style = {textDecorationLine: 'line-through', color: 'gray'};

    expect(text.type).toBe(Text);
    expect(text.props.style).toContainEqual(style);
    expect(checkbox.props.checked).toBe(todo.complete);
  });

  it('Handles complete actions correctly', () => {
    const onComplete = jest.fn();

    const testRenderer = TestRenderer.create(
      <Todo
        {...todo}
        onComplete={onComplete}
      />
    );

    const component = testRenderer.root;
    const checkbox = component.findByType(Checkbox);

    checkbox.props.onChange(false);

    expect(onComplete).toHaveBeenCalledWith(todo.id, false);
  });

  it('Handles delete actions correctly', () => {
    const onDelete = jest.fn();

    const testRenderer = TestRenderer.create(
      <Todo
        {...todo}
        onDelete={onDelete}
      />
    );

    const component = testRenderer.root;
    const deleteButton = component.findByType(IconButton);

    deleteButton.props.onPress();

    expect(onDelete).toHaveBeenCalledWith(todo.id);
  });

  it('Renders correctly when in progress', () => {
    const testRenderer = TestRenderer.create(
      <Todo
        {...todo}
        progress={true}
      />
    );

    const component = testRenderer.root;
    const checkbox = component.findByType(Checkbox);
    const deleteButton = component.findByType(IconButton);
    const activityIndicator = component.findByType(ActivityIndicator);

    expect(checkbox.props.disabled).toBe(true);
    expect(deleteButton.props.disabled).toBe(true);
  });
});
