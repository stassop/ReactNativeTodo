import React from 'react';
import TestRenderer from 'react-test-renderer';
import { FlatList, ActivityIndicator } from 'react-native';
import * as reactRedux from 'react-redux';

import { TodoList } from '../../components/TodoList';
import { Todo } from '../../components/Todo';
import * as Actions  from '../../actions';

// useDispatch() will be called by every test
const useDispatchMock = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(useDispatchMock);
// fetchTodosAsync() will be called by every test
jest.spyOn(Actions, 'fetchTodosAsync').mockImplementation(jest.fn());

describe('TodoList', () => {
  it('Renders busy state', () => {
    // useSelector() mocks must be defined in the same order as the calls
    jest.spyOn(reactRedux, 'useSelector')
      .mockReturnValueOnce([]) // state.todos
      .mockReturnValueOnce(null) // state.filter
      .mockReturnValueOnce(true) // state.fetching
      .mockReturnValue(null); // any other selector

    const renderer = TestRenderer.create(
      <TodoList />
    );
    const root = renderer.root;

    expect(root.findAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it('Renders ready state', () => {
    const todosMock = [
      { id: 1, text: 'Todo one', done: false },
      { id: 2, text: 'Todo two', done: true },
    ];
    // useSelector() mocks must be defined in the same order as the calls
    jest.spyOn(reactRedux, 'useSelector')
      .mockReturnValueOnce(todosMock) // state.todos
      .mockReturnValueOnce(null) // state.filter
      .mockReturnValueOnce(false) // state.fetching
      .mockReturnValue(null); // any other selector

    const renderer = TestRenderer.create(
      <TodoList />
    );
    const root = renderer.root;
    const todos = root.findAllByType(Todo);

    expect(todos).toHaveLength(2);
    expect(todos[0].props.text).toBe('Todo one');
    expect(todos[1].props.text).toBe('Todo two');
  });

  it('Handles filters', () => {
    const todosMock = [
      { id: 1, text: 'Todo one', done: false },
      { id: 2, text: 'Todo two', done: true },
    ];
    // useSelector() mocks must be defined in the same order as the calls
    jest.spyOn(reactRedux, 'useSelector')
      .mockReturnValueOnce(todosMock) // state.todos
      .mockReturnValueOnce('Done') // state.filter
      .mockReturnValueOnce(false) // state.fetching
      .mockReturnValue(null); // any other selector

    const renderer = TestRenderer.create(
      <TodoList />
    );
    const root = renderer.root;
    const todos = root.findAllByType(Todo);

    expect(todos).toHaveLength(1);
    expect(todos[0].props.done).toBe(true);
  });

  it('Handles mounting and unmounting', () => {
    // useSelector() mocks must be defined in the same order as the calls
    jest.spyOn(reactRedux, 'useSelector')
      .mockReturnValueOnce([]) // state.todos
      .mockReturnValueOnce(null) // state.filter
      .mockReturnValueOnce(false) // state.fetching
      .mockReturnValue(null); // any other selector

    let renderer;
    // Wrap create() in act() for hooks to take effect
    TestRenderer.act(() => {
      renderer = TestRenderer.create(
        <TodoList />
      );
    });
    // fetchTodosAsync() called on mount
    expect(useDispatchMock).toHaveBeenCalledWith(Actions.fetchTodosAsync());

    TestRenderer.act(() => {
      renderer.unmount();
    });
    // toggleTodoCancel() called on unmount
    expect(useDispatchMock).toHaveBeenCalledWith(Actions.toggleTodoCancel());
  });
});
