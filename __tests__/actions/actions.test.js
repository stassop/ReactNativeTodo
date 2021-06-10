import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as Api from '../../api';
import * as Actions from '../../actions';

const mockStore = configureMockStore([ thunk ]);

describe('Async actions', () => {
  it('Handles successful fetch', () => {
    const store = mockStore();
    const todos = [{ text: 'Text', id: 123, done: false }];
    // Mock async API method success
    const fetchTodosMock = jest.spyOn(Api, 'fetchTodos').mockResolvedValue(todos);

    const expectedActions = [
      Actions.fetchTodos(),
      Actions.fetchTodosSuccess(todos),
    ];

    // If a test returns nothing it will pass by default
    return store
      // Dispatch async action
      .dispatch(Actions.fetchTodosAsync())
      // Wait for async action to complete
      .then(() => {
        // Mocked method is called
        expect(fetchTodosMock).toHaveBeenCalled();
        // Expected actions are dispatched
        expect(store.getActions()).toStrictEqual(expectedActions);
      });
  });

  it('Handles unsuccessful fetch', () => {
    const store = mockStore();
    // Mock async API method error
    const fetchTodosMock = jest.spyOn(Api, 'fetchTodos').mockRejectedValue('Error');

    const expectedActions = [
      Actions.fetchTodos(),
      Actions.fetchTodosError('Error')
    ];

    // If a test returns nothing it will pass by default
    return store
      // Dispatch async action
      .dispatch(Actions.fetchTodosAsync())
      // Wait for async action to complete
      .then(() => {
        // Mocked method is called
        expect(fetchTodosMock).toHaveBeenCalled();
        // Expected actions are dispatched
        expect(store.getActions()).toStrictEqual(expectedActions);
      });
  });
});

describe('Action creators', () => {
	it('Creates CREATE_TODO action', () => {
    const action = { type: Actions.CREATE_TODO, text: 'Todo' };
    expect(Actions.createTodo('Todo')).toStrictEqual(action);
  });

	it('Creates CREATE_TODO_ERROR action', () => {
    const action = { type: Actions.CREATE_TODO_ERROR, error: 'Error' };
    expect(Actions.createTodoError('Error')).toStrictEqual(action);
	});

	it('Creates CREATE_TODO_SUCCESS action', () => {
    const todo = { text: 'Text', id: 123, done: false };
    const action = { type: Actions.CREATE_TODO_SUCCESS, todo };
    expect(Actions.createTodoSuccess(todo)).toStrictEqual(action);
	});

  it('Creates DELETE_TODO action', () => {
    const action = { type: Actions.DELETE_TODO, id: 123 };
    expect(Actions.deleteTodo(123)).toStrictEqual(action);
  });

  it('Creates DELETE_TODO_ERROR action', () => {
    const action = { type: Actions.DELETE_TODO_ERROR, id: 123, error: 'Error' };
    expect(Actions.deleteTodoError(123, 'Error')).toStrictEqual(action);
  });

  it('Creates DELETE_TODO_SUCCESS action', () => {
    const action = { type: Actions.DELETE_TODO_SUCCESS, id: 123 };
    expect(Actions.deleteTodoSuccess(123)).toStrictEqual(action);
  });

  it('Creates FETCH_TODOS action', () => {
    const action = { type: Actions.FETCH_TODOS };
    expect(Actions.fetchTodos()).toStrictEqual(action);
  });

  it('Creates FETCH_TODOS_ERROR action', () => {
    const action = { type: Actions.FETCH_TODOS_ERROR, error: 'Error' };
    expect(Actions.fetchTodosError('Error')).toStrictEqual(action);
  });

  it('Creates FETCH_TODOS_SUCCESS action', () => {
    const todos = [{ text: 'Text', id: 123, done: false }];
    const action = { type: Actions.FETCH_TODOS_SUCCESS, todos };
    expect(Actions.fetchTodosSuccess(todos)).toStrictEqual(action);
  });

  it('Creates FILTER_TODOS action', () => {
    const action = { type: Actions.FILTER_TODOS, filter: 'All' };
    expect(Actions.filterTodos('All')).toStrictEqual(action);
  });

	it('Creates TOGGLE_TODO action', () => {
    const action = { type: Actions.TOGGLE_TODO, id: 123, done: true };
    expect(Actions.toggleTodo(123, true)).toStrictEqual(action);
	});

	it('Creates TOGGLE_TODO_CANCEL action', () => {
    const action = { type: Actions.TOGGLE_TODO_CANCEL };
    expect(Actions.toggleTodoCancel()).toStrictEqual(action);
	});

	it('Creates TOGGLE_TODO_ERROR action', () => {
    const action = { type: Actions.TOGGLE_TODO_ERROR, id: 123, error: 'Error' };
    expect(Actions.toggleTodoError(123, 'Error')).toStrictEqual(action);
	});

	it('Creates TOGGLE_TODO_SUCCESS action', () => {
    const action = { type: Actions.TOGGLE_TODO_SUCCESS, id: 123, done: true };
    expect(Actions.toggleTodoSuccess(123, true)).toStrictEqual(action);
	});
});
