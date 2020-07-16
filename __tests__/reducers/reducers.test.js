import { reducer, initialState } from '../../reducers';

import {
  addTodo,
  addTodoError,
  addTodoSuccess,
  changeTodoText,
  completeTodo,
  completeTodoError,
  completeTodoSuccess,
  deleteTodo,
  deleteTodoError,
  deleteTodoSuccess,
  fetchTodos,
  fetchTodosError,
  fetchTodosSuccess,
  filterTodos,
} from '../../actions';

import { Filters } from '../../components/TodoFilters';

// Mock
const todo = {id: '1', text: 'Todo', complete: false};

describe('Main reducer', () => {
	it('Returns initial state when action type is unknown', () => {
    const state = reducer(undefined, {});

    expect(state).toStrictEqual(initialState);
	});

  it('Changes fetching state on FETCH_TODOS', () => {
    const action = fetchTodos();
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      fetching: true,
      error: null
    };

    expect(state).toStrictEqual(expectedState);
  });

  it('Changes error state on FETCH_TODOS_ERROR', () => {
    const error = 'Some error';
    const action = fetchTodosError(error);
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      error,
      fetching: false
    };

    expect(state).toStrictEqual(expectedState);
  });

  it('Changes todos state on FETCH_TODOS_SUCCESS', () => {
    const action = fetchTodosSuccess([todo]);
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{...todo, progress: false}],
      fetching: false
    };

    expect(state).toStrictEqual(expectedState);
  });

	it('Changes adding state on ADD_TODO', () => {
    const action = addTodo();
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      adding: true,
      error: null
    };

    expect(state).toStrictEqual(expectedState);
	});

  it('Changes error state on ADD_TODO_ERROR', () => {
    const error = 'Some error';
    const action = addTodoError(error);
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      adding: false,
      error
    };

    expect(state).toStrictEqual(expectedState);
	});

  it('Changes todos state on ADD_TODO_SUCCESS', () => {
    const action = addTodoSuccess(todo);
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{...todo, progress: false}],
      adding: false
    };

    expect(state).toStrictEqual(expectedState);
	});

  it('Changes todo progress state on COMPLETE_TODO', () => {
    const action = completeTodo(todo.id);
    const initialState = {...initialState, todos: [todo]};
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{...todo, progress: true}],
      error: null
    };

    expect(state).toStrictEqual(expectedState);
  });

  it('Changes error state on COMPLETE_TODO_ERROR', () => {
    const error = 'Some error';
    const action = completeTodoError(todo.id, error);
    const initialState = {...initialState, todos: [todo]};
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{...todo, progress: false}],
      error
    };

    expect(state).toStrictEqual(expectedState);
  });

  it('Changes todo complete state on COMPLETE_TODO_SUCCESS', () => {
    const action = completeTodoSuccess(todo.id, true);
    const initialState = {...initialState, todos: [todo]};
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{...todo, progress: false, complete: true}]
    };

    expect(state).toStrictEqual(expectedState);
  });

  it('Changes todo progress on DELETE_TODO', () => {
    const action = deleteTodo(todo.id);
    const initialState = {...initialState, todos: [todo]};
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{...todo, progress: true}],
      error: null
    };

    expect(state).toStrictEqual(expectedState);
  });

  it('Changes error state on DELETE_TODO_ERROR', () => {
    const error = 'Some error';
    const action = deleteTodoError(todo.id, error);
    const initialState = {...initialState, todos: [todo]};
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{...todo, progress: false}],
      error
    };

    expect(state).toStrictEqual(expectedState);
  });

  it('Changes todos state on DELETE_TODO_SUCCESS', () => {
    const action = deleteTodoSuccess(todo.id);
    const initialState = {...initialState, todos: [todo]};
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: []
    };

    expect(state).toStrictEqual(expectedState);
  });

  it('Changes filter state on CHANGE_FILTER', () => {
    const action = filterTodos(Filters.COMPLETED);
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      filter: Filters.COMPLETED
    };

    expect(state).toStrictEqual(expectedState);
  });
});
