import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk';

import { rootReducer } from '../reducers';
import { rootSaga } from '../sagas';

import { Error } from './Error';
import { TodoList } from './TodoList';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(thunk, sagaMiddleware));
sagaMiddleware.run(rootSaga);

export const App = () => (
  <Provider store={ store }>
    <Error />
    <TodoList />
  </Provider>
);
