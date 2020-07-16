import 'react-native';
import React from 'react';
// Test testRenderer must be imported after react-native
import TestRenderer from 'react-test-renderer';
import { ActivityIndicator, LayoutAnimation } from 'react-native';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { TodoFilters, Filters } from '../../components/TodoFilters';
import { TodoListContainer } from '../../components/TodoList';
import { AddTodo } from '../../components/AddTodo';
import { Error } from '../../components/Error';
import { Todo } from '../../components/Todo';

import {
  addTodo,
  completeTodo,
  completeTodoCancel,
  deleteTodo,
  fetchTodos,
  filterTodos,
} from '../../actions';

// We need this to prevent jest errors related to animation
jest.spyOn(LayoutAnimation, 'configureNext')
  .mockImplementation(jest.fn());

// Mocks
const todos = [
  {id: '1', text: 'First todo', complete: false},
  {id: '2', text: 'Second todo', complete: true},
];

const mockStore = configureMockStore([thunk]);

describe('TodoList', () => {
  it('Fetches todos when mounted', () => {
    const store = mockStore();
    let testRenderer;

    // Wrap TestRenderer.create() in TestRenderer.act() for hooks to take effect
    TestRenderer.act(() => {
      testRenderer = TestRenderer.create(
        <Provider store={store}>
          <TodoListContainer />
        </Provider>
      );
    });

    const actions = store.getActions();
    const expectedActions = [fetchTodos()];

    expect(actions).toStrictEqual(expectedActions);
  });

  it('Renders correctly when in progress', () => {
    const store = mockStore({fetching: true});

    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>
    );

    const component = testRenderer.root;
    const activityIndicator = component.findByType(ActivityIndicator);

    expect(activityIndicator.props.size).toBe('large');
  });

  it('Renders correctly when filters are applied', () => {
    const store = mockStore({todos, filter: Filters.ACTIVE});

    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>
    );

    const component = testRenderer.root;
    const todoComponents = component.findAllByType(Todo);
    const todoFilters = component.findByType(TodoFilters);

    expect(todoComponents.length).toBe(1);
    expect(todoComponents[0].props.id).toBe(todos[0].id);
    expect(todoFilters.props.selected).toBe(Filters.ACTIVE);
  });

  it('Handles complete and delete actions correctly', () => {
    const store = mockStore({todos});

    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>
    );

    const component = testRenderer.root;
    const todoComponents = component.findAllByType(Todo);

    store.clearActions();

    todoComponents[0].props.onComplete(todos[0].id, true);
    todoComponents[1].props.onDelete(todos[1].id);

    const actions = store.getActions();
    const expectedActions = [
      completeTodo(todos[0].id, true),
      deleteTodo(todos[1].id)
    ];

    expect(actions).toStrictEqual(expectedActions);
  });

  it('Handles add actions correctly', () => {
    const text = 'New todo';
    const store = mockStore();

    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>
    );

    const component = testRenderer.root;
    const addTodoComponent = component.findByType(AddTodo);

    store.clearActions();

    addTodoComponent.props.onAdd(text);

    const actions = store.getActions();
    const expectedActions = [addTodo(text)];

    expect(actions).toStrictEqual(expectedActions);
  });

  it('Handles filter actions correctly', () => {
    const store = mockStore({todos, filter: Filters.ACTIVE});

    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>
    );

    const component = testRenderer.root;
    const todoFilters = component.findByType(TodoFilters);

    store.clearActions();

    todoFilters.props.onChange(Filters.COMPLETE);

    const actions = store.getActions();
    const expectedActions = [filterTodos(Filters.COMPLETE)];

    expect(actions).toStrictEqual(expectedActions);
  });

  it('Renders correctly when an error occurs', () => {
    const error = 'Some error';
    const store = mockStore({error});

    const testRenderer = TestRenderer.create(
      <Provider store={store}>
        <TodoListContainer />
      </Provider>
    );

    const component = testRenderer.root;
    const errorComponent = component.findByType(Error);

    expect(errorComponent.props.text).toBe(error);
  });

  it('Cancels pending calls when unmounted', () => {
    const store = mockStore();
    let testRenderer;

    // Wrap TestRenderer.create() in TestRenderer.act() for hooks to take effect
    TestRenderer.act(() => {
      testRenderer = TestRenderer.create(
        <Provider store={store}>
          <TodoListContainer />
        </Provider>
      );
    });

    store.clearActions();

    // We can test our hooks unmount callback
    // by calling TestRenderer's unmount() method
    // and checking if the store has received the correct action
    TestRenderer.act(() => {
      testRenderer.unmount();
    });

    const actions = store.getActions();
    const expectedActions = [completeTodoCancel()];

    expect(actions).toStrictEqual(expectedActions);
  });
});
