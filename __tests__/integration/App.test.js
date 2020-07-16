import 'react-native';
import React from 'react';
import { TextInput, Button, LayoutAnimation } from 'react-native';
// Note: test testRenderer must be required after react-native.
import TestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import { reducer } from '../../reducers';
import { rootSaga } from '../../sagas';

import { Api } from '../../api/Api';
import { App } from '../../components/App';
import { Todo } from '../../components/Todo';
import { AddTodo } from '../../components/AddTodo';
import { TodoFilters, Filters } from '../../components/TodoFilters';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(thunk, sagaMiddleware));
sagaMiddleware.run(rootSaga);

// Mocks
const todos = [
  {id: '1', text: 'First todo', complete: false},
  {id: '2', text: 'Second todo', complete: false},
];

// We need this to prevent jest errors related to animation
jest.spyOn(LayoutAnimation, 'configureNext')
  .mockImplementation(() => jest.fn());

describe('App', () => {
  let testRenderer;

  // This mock must be created before the App instance
  // because it gets called when the TodoList component mounts
  const fetchTodosMock = jest.spyOn(Api, 'fetchTodos')
    .mockImplementation(() => Promise.resolve([todos[0]]));

  // If this looks weird, check the links for explanation
  // https://jestjs.io/docs/en/setup-teardown#one-time-setup
  // https://reactjs.org/blog/2019/08/08/react-v16.9.0.html#async-act-for-testing
  beforeAll(() => {
    return TestRenderer.act(async () => {
      testRenderer = TestRenderer.create(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });
  });

  afterAll(() => {
    fetchTodosMock.mockRestore();
  });

  it('Loads todos', () => {
    const app = testRenderer.root;
    const todoComponents = app.findAllByType(Todo);

    expect(fetchTodosMock).toHaveBeenCalledWith();
    expect(todoComponents.length).toBe(1);
  });

  it('Adds todos', async () => {
    const addTodoMock = jest.spyOn(Api, 'addTodo')
      .mockImplementation(() => Promise.resolve(todos[1]));

    const app = testRenderer.root;
    const addTodo = app.findByType(AddTodo);

    await TestRenderer.act(async () => {
      addTodo.props.onAdd(todos[1].text);
    });

    const todoComponents = app.findAllByType(Todo);

    expect(addTodoMock).toHaveBeenCalledWith(todos[1].text);
    expect(todoComponents.length).toBe(2);

    addTodoMock.mockRestore();
  });

  it('Completes todos', async () => {
    const completeTodoMock = jest.spyOn(Api, 'completeTodo')
      .mockImplementation(() => Promise.resolve({...todos[0], complete: true}));

    const app = testRenderer.root;
    const todoComponents = app.findAllByType(Todo);

    await TestRenderer.act(async () => {
      todoComponents[0].props.onComplete(todos[0].id, true);
    });

    expect(completeTodoMock).toHaveBeenCalledWith(todos[0].id, true);
    expect(todoComponents[0].props.complete).toBe(true);

    completeTodoMock.mockRestore();
  });

  it('Deletes todos', async () => {
    const todo = todos[0];
    const deleteTodoMock = jest.spyOn(Api, 'deleteTodo')
      .mockImplementation(() => Promise.resolve(todos[0]));

    const app = testRenderer.root;
    let todoComponents = app.findAllByType(Todo);

    await TestRenderer.act(async () => {
      todoComponents[0].props.onDelete(todos[0].id);
    });

    todoComponents = app.findAllByType(Todo);

    expect(deleteTodoMock).toHaveBeenCalledWith(todos[0].id);
    expect(todoComponents.length).toBe(1);

    deleteTodoMock.mockRestore();
  });

  it('Filters todos', async () => {
    const app = testRenderer.root;
    const todoFilters = app.findByType(TodoFilters);

    await TestRenderer.act(async () => {
      todoFilters.props.onChange(Filters.COMPLETE);
    });

    const todoComponents = app.findAllByType(Todo);

    expect(todoComponents.length).toBe(0);
    expect(todoFilters.props.selected).toBe(Filters.COMPLETE);
  });
});
