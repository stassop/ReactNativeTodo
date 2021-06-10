import { rootReducer, initialState } from '../../reducers';
import * as Actions from '../../actions';

describe('rootReducer()', () => {
	it('Returns initial state', () => {
    const state = rootReducer(undefined, {});
    expect(state).toStrictEqual(initialState);
	});

  it('Handles FETCH_TODOS', () => {
    const action = Actions.fetchTodos();
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      fetching: true,
    };
    expect(state).toStrictEqual(expectedState);
  });

  it('Handles FETCH_TODOS_ERROR', () => {
    const action = Actions.fetchTodosError('Error');
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      fetching: false,
      error: 'Error',
    };
    expect(state).toStrictEqual(expectedState);
  });

  it('Handles FETCH_TODOS_SUCCESS', () => {
    const todos = [{ text: 'Text', id: 123, done: false }];
    const action = Actions.fetchTodosSuccess(todos);
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: todos,
      fetching: false,
      error: null,
    };
    expect(state).toStrictEqual(expectedState);
  });

	it('Handles CREATE_TODO', () => {
    const action = Actions.createTodo();
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      creating: true,
    };
    expect(state).toStrictEqual(expectedState);
	});

  it('Handles CREATE_TODO_ERROR', () => {
    const action = Actions.createTodoError('Error');
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      creating: false,
      error: 'Error',
    };
    expect(state).toStrictEqual(expectedState);
	});

  it('Handles CREATE_TODO_SUCCESS', () => {
    const todo = { text: 'Text', id: 123, done: false };
    const action = Actions.createTodoSuccess(todo);
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [ todo ],
      creating: false,
      error: null,
    };
    expect(state).toStrictEqual(expectedState);
	});

  it('Handles TOGGLE_TODO', () => {
    const todo = { text: 'Text', id: 123, done: false };
    const action = Actions.toggleTodo(123);
    const initialState = { ...initialState, todos: [ todo ] };
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{ ...todo, progress: true }],
    };
    expect(state).toStrictEqual(expectedState);
  });

  it('Handles TOGGLE_TODO_ERROR', () => {
    const todo = { text: 'Text', id: 123, done: false };
    const action = Actions.toggleTodoError(123, 'Error');
    const initialState = { ...initialState, todos: [ todo ] };
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{ ...todo, progress: false }],
      error: 'Error',
    };
    expect(state).toStrictEqual(expectedState);
  });

  it('Handles TOGGLE_TODO_SUCCESS', () => {
    const todo = { text: 'Text', id: 123, done: false };
    const action = Actions.toggleTodoSuccess(123, true);
    const initialState = { ...initialState, todos: [ todo ] };
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{ ...todo, progress: false, done: true }],
      error: null,
    };
    expect(state).toStrictEqual(expectedState);
  });

  it('Handles DELETE_TODO', () => {
    const todo = { text: 'Text', id: 123, done: false };
    const action = Actions.deleteTodo(123);
    const initialState = { ...initialState, todos: [ todo ] };
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{ ...todo, progress: true }],
    };
    expect(state).toStrictEqual(expectedState);
  });

  it('Handles DELETE_TODO_ERROR', () => {
    const todo = { text: 'Text', id: 123, done: false };
    const action = Actions.deleteTodoError(123, 'Error');
    const initialState = { ...initialState, todos: [ todo ] };
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{ ...todo, progress: false }],
      error: 'Error',
    };
    expect(state).toStrictEqual(expectedState);
  });

  it('Handles DELETE_TODO_SUCCESS', () => {
    const todo = { text: 'Text', id: 123, done: false };
    const action = Actions.deleteTodoSuccess(123);
    const initialState = { ...initialState, todos: [ todo ] };
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [],
      error: null,
    };
    expect(state).toStrictEqual(expectedState);
  });

  it('Handles FILTER_TODOS', () => {
    const action = Actions.filterTodos('Done');
    const state = rootReducer(initialState, action);
    const expectedState = {
      ...initialState,
      filter: 'Done'
    };
    expect(state).toStrictEqual(expectedState);
  });
});
