import * as Api from '../api';

export const CREATE_TODO = 'CREATE_TODO';
export const CREATE_TODO_ERROR = 'CREATE_TODO_ERROR';
export const CREATE_TODO_SUCCESS = 'CREATE_TODO_SUCCESS';
export const DELETE_TODO = 'DELETE_TODO';
export const DELETE_TODO_ERROR = 'DELETE_TODO_ERROR';
export const DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS';
export const FETCH_TODOS = 'FETCH_TODOS';
export const FETCH_TODOS_ERROR = 'FETCH_TODOS_ERROR';
export const FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS';
export const FILTER_TODOS = 'FILTER_TODOS';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const TOGGLE_TODO_CANCEL = 'TOGGLE_TODO_CANCEL';
export const TOGGLE_TODO_ERROR = 'TOGGLE_TODO_ERROR';
export const TOGGLE_TODO_SUCCESS = 'TOGGLE_TODO_SUCCESS';

export const fetchTodosAsync = () => {
  return (dispatch) => {
    dispatch(fetchTodos());
    return Api.fetchTodos()
      .then(todos => dispatch(fetchTodosSuccess(todos)))
      .catch(error => dispatch(fetchTodosError(error)));
  }
};

export const createTodo = (text) => ({ type: CREATE_TODO, text });
export const createTodoError = (error) => ({ type: CREATE_TODO_ERROR, error });
export const createTodoSuccess = (todo) => ({ type: CREATE_TODO_SUCCESS, todo });
export const deleteTodo = (id) => ({ type: DELETE_TODO, id });
export const deleteTodoError = (id, error) => ({ type: DELETE_TODO_ERROR, id, error });
export const deleteTodoSuccess = (id) => ({ type: DELETE_TODO_SUCCESS, id });
export const fetchTodos = () => ({ type: FETCH_TODOS });
export const fetchTodosError = (error) => ({ type: FETCH_TODOS_ERROR, error });
export const fetchTodosSuccess = (todos) => ({ type: FETCH_TODOS_SUCCESS, todos });
export const filterTodos = (filter) => ({ type: FILTER_TODOS, filter });
export const toggleTodo = (id, done) => ({ type: TOGGLE_TODO, id, done });
export const toggleTodoCancel = () => ({ type: TOGGLE_TODO_CANCEL });
export const toggleTodoError = (id, error) => ({ type: TOGGLE_TODO_ERROR, id, error });
export const toggleTodoSuccess = (id, done) => ({ type: TOGGLE_TODO_SUCCESS, id, done });
