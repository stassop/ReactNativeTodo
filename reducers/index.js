import {
  ADD_TODO,
  ADD_TODO_ERROR,
  ADD_TODO_SUCCESS,
  COMPLETE_TODO,
  COMPLETE_TODO_ERROR,
  COMPLETE_TODO_SUCCESS,
  DELETE_TODO,
  DELETE_TODO_ERROR,
  DELETE_TODO_SUCCESS,
  FETCH_TODOS,
  FETCH_TODOS_ERROR,
  FETCH_TODOS_SUCCESS,
  FILTER_TODOS,
} from '../actions';

import { Filters } from '../components/TodoFilters';

export const initialState = {
  todos: [],
  adding: false,
  error: null,
  fetching: false,
  filter: Filters.ALL
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        adding: true,
        error: null
      };
    case ADD_TODO_ERROR:
      return {
        ...state,
        adding: false,
        error: action.error
      };
    case ADD_TODO_SUCCESS:
      return {
        ...state,
        adding: false,
        todos: [
          ...state.todos,
          {...action.todo, progress: false}
        ]
    };
    case COMPLETE_TODO:
      return {
        ...state,
        error: null,
        todos: state.todos.map(todo => {
          return todo.id === action.id
            ? {...todo, progress: true}
            : todo
        })
      };
    case COMPLETE_TODO_ERROR:
      return {
        ...state,
        error: action.error,
        todos: state.todos.map(todo => {
          return todo.id === action.id
            ? {...todo, progress: false}
            : todo
        })
      };
    case COMPLETE_TODO_SUCCESS:
      return {
        ...state,
        todos: state.todos.map(todo => {
          return todo.id === action.id
            ? {...todo, progress: false, complete: action.complete}
            : todo
        })
      };
    case DELETE_TODO:
      return {
        ...state,
        error: null,
        todos: state.todos.map(todo => {
          return todo.id === action.id
            ? {...todo, progress: true}
            : todo
        })
      };
    case DELETE_TODO_ERROR:
      return {
        ...state,
        error: action.error,
        todos: state.todos.map(todo => {
          return todo.id === action.id
            ? {...todo, progress: false}
            : todo
        })
      };
    case DELETE_TODO_SUCCESS:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      };
    case FETCH_TODOS:
      return {
        ...state,
        fetching: true,
        error: null
      };
    case FETCH_TODOS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.error
      };
    case FETCH_TODOS_SUCCESS:
      return {
        ...state,
        fetching: false,
        todos: action.todos.map(todo => ({...todo, progress: false}))
      };
    case FILTER_TODOS:
      return {
        ...state,
        filter: action.filter
      };
    default:
      return state;
  }
};
