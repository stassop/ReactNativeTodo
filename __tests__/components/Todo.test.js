import React from 'react';
import TestRenderer from 'react-test-renderer';
import * as reactRedux from 'react-redux';

import { Todo } from '../../components/Todo';
import { Colors } from '../../components/Styles';
import { Checkbox } from '../../components/Checkbox';
import { IconButton } from '../../components/IconButton';
import * as Actions from '../../actions';

// useDispatch() will be called by every test
const useDispatchMock = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(useDispatchMock);

describe('Todo', () => {
  it('Handles active state', () => {
    const renderer = TestRenderer.create(
      <Todo text={ 'Todo' } done={ false } />
    );
    const root = renderer.root;
    const checkbox = root.findByType(Checkbox);
    const text = root.findByProps({ children: 'Todo' });
    const doneStyle = {
      textDecorationLine: 'line-through',
      color: Colors.todoDone,
    };

    expect(checkbox.props.checked).toBe(false);
    expect(text.props.style).not.toContainEqual(doneStyle);
  });

  it('Handles done state', () => {
    const renderer = TestRenderer.create(
      <Todo text={ 'Todo' } done={ true } />
    );
    const root = renderer.root;
    const checkbox = root.findByType(Checkbox);
    const text = root.findByProps({ children: 'Todo' });
    const doneStyle = {
      textDecorationLine: 'line-through',
      color: Colors.todoDone,
    };

    expect(checkbox.props.checked).toBe(true);
    expect(text.props.style).toContainEqual(doneStyle);
  });

  it('Handles busy state', () => {
    const renderer = TestRenderer.create(
      <Todo progress={ true } />
    );
    const root = renderer.root;
    const checkbox = root.findByType(Checkbox);
    const deleteButton = root.findByType(IconButton);

    expect(checkbox.props.disabled).toBe(true);
    expect(deleteButton.props.disabled).toBe(true);
  });

  it('Handles user actions', () => {
    const renderer = TestRenderer.create(
      <Todo id={ 123 } done={ false } />
    );
    const root = renderer.root;
    const checkbox = root.findByType(Checkbox);
    const deleteButton = root.findByType(IconButton);

    checkbox.props.onChange(true);
    deleteButton.props.onPress();

    expect(useDispatchMock).toHaveBeenCalledWith(Actions.toggleTodo(123, true));
    expect(useDispatchMock).toHaveBeenCalledWith(Actions.deleteTodo(123));
  });
});
