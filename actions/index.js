export const ADD_TODO = 'ADD_TODO';
export const ADD_TODO_ERROR = 'ADD_TODO_ERROR';
export const ADD_TODO_SUCCESS = 'ADD_TODO_SUCCESS';
export const COMPLETE_TODO = 'COMPLETE_TODO';
export const COMPLETE_TODO_CANCEL = 'COMPLETE_TODO_CANCEL';
export const COMPLETE_TODO_ERROR = 'COMPLETE_TODO_ERROR';
export const COMPLETE_TODO_SUCCESS = 'COMPLETE_TODO_SUCCESS';
export const DELETE_TODO = 'DELETE_TODO';
export const DELETE_TODO_ERROR = 'DELETE_TODO_ERROR';
export const DELETE_TODO_SUCCESS = 'DELETE_TODO_SUCCESS';
export const FETCH_TODOS = 'FETCH_TODOS';
export const FETCH_TODOS_ERROR = 'FETCH_TODOS_ERROR';
export const FETCH_TODOS_SUCCESS = 'FETCH_TODOS_SUCCESS';
export const FILTER_TODOS = 'FILTER_TODOS';

import { Api } from '../api/Api';

export const fetchTodosAsync = () => {
  return dispatch => {
    dispatch(fetchTodos());
    return Api.fetchTodos()
      .then(todos => dispatch(fetchTodosSuccess(todos)))
      .catch(error => dispatch(fetchTodosError(error)));
  }
};

export const addTodo = text => ({
  type: ADD_TODO,
  text
});

export const addTodoError = error => ({
  type: ADD_TODO_ERROR,
  error
});

export const addTodoSuccess = todo => ({
  type: ADD_TODO_SUCCESS,
  todo
});

export const completeTodo = (id, complete) => ({
  type: COMPLETE_TODO,
  id,
  complete
});

export const completeTodoError = (id, error) => ({
  type: COMPLETE_TODO_ERROR,
  id,
  error
});

export const completeTodoSuccess = (id, complete) => ({
  type: COMPLETE_TODO_SUCCESS,
  id,
  complete
});

export const completeTodoCancel = () => ({
  type: COMPLETE_TODO_CANCEL
});

export const deleteTodo = id => ({
  type: DELETE_TODO,
  id
});

export const deleteTodoError = (id, error) => ({
  type: DELETE_TODO_ERROR,
  id,
  error
});

export const deleteTodoSuccess = id => ({
  type: DELETE_TODO_SUCCESS,
  id
});

export const fetchTodos = () => ({
  type: FETCH_TODOS
});

export const fetchTodosError = error => ({
  type: FETCH_TODOS_ERROR,
  error
})

export const fetchTodosSuccess = todos => ({
  type: FETCH_TODOS_SUCCESS,
  todos
});

export const filterTodos = filter => ({
  type: FILTER_TODOS,
  filter
});
