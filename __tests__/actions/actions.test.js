import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import {
  addTodo,
  addTodoError,
  addTodoSuccess,
  completeTodo,
  completeTodoCancel,
  completeTodoError,
  completeTodoSuccess,
  deleteTodo,
  deleteTodoError,
  deleteTodoSuccess,
  fetchTodos,
  fetchTodosAsync,
  fetchTodosError,
  fetchTodosSuccess,
  filterTodos,
  ADD_TODO,
  ADD_TODO_ERROR,
  ADD_TODO_SUCCESS,
  COMPLETE_TODO,
  COMPLETE_TODO_CANCEL,
  COMPLETE_TODO_ERROR,
  COMPLETE_TODO_SUCCESS,
  DELETE_TODO,
  DELETE_TODO_ERROR,
  DELETE_TODO_SUCCESS,
  FETCH_TODOS,
  FETCH_TODOS_ERROR,
  FETCH_TODOS_SUCCESS,
  FILTER_TODOS
} from '../../actions';

import { Api } from '../../api/Api';
import { Filters } from '../../components/TodoFilters';

// Mocks
const mockStore = configureMockStore([thunk]);
const todo = {id: '1', text: 'Todo', complete: false};

// fetchTodosAsync() is an async thunk action, so we test it differently
describe('fetchTodosAsync()', () => {
  it('Handles successful todo fetch correctly', () => {
    const store = mockStore();
    const todos = [todo];

    // Because the action calls an async Api method, we need to mock it
    const fetchTodosMock = jest.spyOn(Api, 'fetchTodos')
      .mockImplementation(() => Promise.resolve(todos));

    const actions = [
      fetchTodos(),
      fetchTodosSuccess(todos)
    ];

    // If return is omitted, the test will pass by default
    return store
      // The action is processed by the store thunk middleware
      // so it has to be dispatched to take effect
      .dispatch(fetchTodosAsync())
      // The action async, so it has to complete before running tests
      .then(() => {
        // Expect the Api method to have been called
        expect(fetchTodosMock).toHaveBeenCalledWith();
        // And correct actions to have been dispatched
        expect(store.getActions()).toStrictEqual(actions);
        // Restore the original method
        fetchTodosMock.mockRestore();
      });
  });

  it('Handles unsuccessful todo fetch correctly', () => {
    const store = mockStore();
    const error = 'Some error';

    // Because the action calls an async Api method, we need to mock it
    const fetchTodosMock = jest.spyOn(Api, 'fetchTodos')
      .mockImplementation(() => Promise.reject(error));

    const actions = [
      fetchTodos(),
      fetchTodosError(error)
    ];

    // If return is omitted, the test will pass by default
    return store
      // The action is processed by the store thunk middleware
      // so it has to be dispatched to take effect
      .dispatch(fetchTodosAsync())
      // The action async, so it has to complete before running tests
      .then(() => {
        // Expect the Api method to have been called
        expect(fetchTodosMock).toHaveBeenCalledWith();
        // And correct actions to have been dispatched
        expect(store.getActions()).toStrictEqual(actions);
        // Restore the original method
        fetchTodosMock.mockRestore();
      });
  });
});

describe('addTodo()', () => {
	it('Creates ADD_TODO action', () => {
    const text = 'Todo';
    const action = {type: ADD_TODO, text};

    expect(addTodo(text)).toStrictEqual(action);
  });
});

describe('addTodoError()', () => {
	it('Creates ADD_TODO_ERROR action', () => {
    const error = 'Some error';
    const action = {type: ADD_TODO_ERROR, error};

    expect(addTodoError(error)).toStrictEqual(action);
	});
});

describe('addTodoSuccess()', () => {
	it('Creates ADD_TODO_SUCCESS action', () => {
    const action = {type: ADD_TODO_SUCCESS, todo};

    expect(addTodoSuccess(todo)).toStrictEqual(action);
	});
});

describe('completeTodo()', () => {
	it('Creates COMPLETE_TODO action', () => {
    const action = {type: COMPLETE_TODO, id: todo.id, complete: true};

    expect(completeTodo(todo.id, true)).toStrictEqual(action);
	});
});

describe('completeTodoCancel()', () => {
	it('Creates COMPLETE_TODO_CANCEL action', () => {
    const action = {type: COMPLETE_TODO_CANCEL};

    expect(completeTodoCancel()).toStrictEqual(action);
	});
});

describe('completeTodoError()', () => {
	it('Creates COMPLETE_TODO_ERROR action', () => {
    const error = 'Some error';
    const action = {type: COMPLETE_TODO_ERROR, id: todo.id, error};

    expect(completeTodoError(todo.id, error)).toStrictEqual(action);
	});
});

describe('completeTodoSuccess()', () => {
	it('Creates COMPLETE_TODO_SUCCESS action', () => {
    const action = {type: COMPLETE_TODO_SUCCESS, id: todo.id, complete: true};

    expect(completeTodoSuccess(todo.id, true)).toStrictEqual(action);
	});
});

describe('deleteTodo()', () => {
	it('Creates DELETE_TODO action', () => {
    const action = {type: DELETE_TODO, id: todo.id};

    expect(deleteTodo(todo.id)).toStrictEqual(action);
	});
});

describe('deleteTodoError()', () => {
	it('Creates DELETE_TODO_ERROR action', () => {
    const error = 'Some error';
    const action = {type: DELETE_TODO_ERROR, id: todo.id, error};

    expect(deleteTodoError(todo.id, error)).toStrictEqual(action);
	});
});

describe('deleteTodoSuccess()', () => {
	it('Creates DELETE_TODO_SUCCESS action', () => {
    const action = {type: DELETE_TODO_SUCCESS, id: todo.id};

    expect(deleteTodoSuccess(todo.id)).toStrictEqual(action);
	});
});

describe('filterTodos()', () => {
	it('Creates FILTER_TODOS action', () => {
    const action = {type: FILTER_TODOS, filter: Filters.ALL};

    expect(filterTodos(Filters.ALL)).toStrictEqual(action);
	});
});
