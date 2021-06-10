import * as Actions from '../actions';

export const initialState = {
  todos: [],
  creating: false,
  error: null,
  fetching: false,
  filter: 'All',
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.CREATE_TODO:
      return {
        ...state,
        creating: true,
      };
    case Actions.CREATE_TODO_ERROR:
      return {
        ...state,
        creating: false,
        error: action.error
      };
    case Actions.CREATE_TODO_SUCCESS:
      return {
        ...state,
        creating: false,
        todos: [ ...state.todos, action.todo ],
        error: null,
      };
    case Actions.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => todo.id === action.id
          ? { ...todo, progress: true }
          : todo
        )
      };
    case Actions.DELETE_TODO_ERROR:
      return {
        ...state,
        error: action.error,
        todos: state.todos.map(todo => todo.id === action.id
          ? { ...todo, progress: false }
          : todo
        )
      };
    case Actions.DELETE_TODO_SUCCESS:
      return {
        ...state,
        error: null,
        todos: state.todos.filter(todo => todo.id !== action.id)
      };
    case Actions.FETCH_TODOS:
      return {
        ...state,
        fetching: true,
      };
    case Actions.FETCH_TODOS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.error
      };
    case Actions.FETCH_TODOS_SUCCESS:
      return {
        ...state,
        fetching: false,
        todos: action.todos,
        error: null,
      };
    case Actions.FILTER_TODOS:
      return {
        ...state,
        filter: action.filter
      };
    case Actions.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => todo.id === action.id
          ? { ...todo, progress: true }
          : todo
        )
      };
    case Actions.TOGGLE_TODO_ERROR:
      return {
        ...state,
        error: action.error,
        todos: state.todos.map(todo => todo.id === action.id
          ? { ...todo, progress: false }
          : todo
        )
      };
    case Actions.TOGGLE_TODO_SUCCESS:
      return {
        ...state,
        error: null,
        todos: state.todos.map(todo => todo.id === action.id
          ? { ...todo, progress: false, done: action.done }
          : todo
        )
      };
    default:
      return state;
  }
};
