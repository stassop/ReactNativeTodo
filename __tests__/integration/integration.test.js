import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import * as Api from '../../api';

import { App } from '../../components/App';
import { Checkbox } from '../../components/Checkbox';
import { Error } from '../../components/Error';
import { IconButton } from '../../components/IconButton';
import { Todo } from '../../components/Todo';
import { TodoFilter } from '../../components/TodoFilters';

import { rootReducer } from '../../reducers';
import { rootSaga } from '../../sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(thunk, sagaMiddleware));
sagaMiddleware.run(rootSaga);

jest.useFakeTimers(); // Prevent issues with LayoutAnimation

jest.spyOn(Api, 'fetchTodos').mockResolvedValue([
  { id: 1, text: 'Todo one', done: false },
  { id: 2, text: 'Todo two', done: false },
]);

describe('App', () => {
  // Use async/await to allow for async calls to resolve
  // https://reactjs.org/docs/testing-recipes.html#data-fetching
  let root;
  beforeAll(() => TestRenderer.act(async () => {
    const renderer = await TestRenderer.create(
      <Provider store={ store }>
        <App />
      </Provider>
    );
    root = renderer.root;
  }));

  it('Fetches todos', () => {
    const todos = root.findAllByType(Todo);

    expect(todos).toHaveLength(2);
    expect(todos[0].props.text).toBe('Todo one');
    expect(todos[1].props.text).toBe('Todo two');
  });

  it('Creates todos', async () => {
    const textInput = root.findByType(TextInput);
    const createTodoMock = jest.spyOn(Api, 'createTodo')
      .mockResolvedValue({ id: 3, text: 'Todo three', done: false });

    // Wrap each call in act() for it to take effect before the next one
    await TestRenderer.act(async () => {
      textInput.props.onChangeText('Todo three');
    });

    await TestRenderer.act(async () => {
      textInput.props.onSubmitEditing();
    });

    const todos = root.findAllByType(Todo);

    expect(todos).toHaveLength(3);
    expect(todos[2].props.text).toBe('Todo three');
  });

  it('Deletes todos', async () => {
    const deleteTodoMock = jest.spyOn(Api, 'deleteTodo')
      .mockResolvedValue({ id: 3 });

    let todos = root.findAllByType(Todo);
    const deleteButton = todos[2].findByType(IconButton);

    await TestRenderer.act(async () => {
      deleteButton.props.onPress();
    });

    expect(root.findAllByType(Todo)).toHaveLength(2);
  });

  it('Toggles todos', async () => {
    jest.spyOn(Api, 'toggleTodo')
      .mockResolvedValue({ id: 2, done: true });

    const todos = root.findAllByType(Todo);
    const checkbox = todos[1].findByType(Checkbox);

    await TestRenderer.act(async () => {
      checkbox.props.onChange();
    });

    expect(todos[1].props.done).toBe(true);
  });

  it('Handles errors', async () => {
    jest.spyOn(Api, 'toggleTodo')
      .mockRejectedValue('Error');

    const todos = root.findAllByType(Todo);
    const checkbox = todos[1].findByType(Checkbox);

    await TestRenderer.act(async () => {
      checkbox.props.onChange();
    });

    const error = root.findByType(Error);
    const errorText = error.findByType(Text);

    expect(errorText.props.children).toBe('Error');
  });

  it('Filters todos', async () => {
    const filters = root.findAllByType(TodoFilter);
    const touchable = filters[2].findByType(TouchableOpacity);

    await TestRenderer.act(async () => {
      touchable.props.onPress();
    });

    const todos = root.findAllByType(Todo);

    expect(todos).toHaveLength(1);
    expect(todos[0].props.done).toBe(true);
  });
});
