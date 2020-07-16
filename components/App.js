import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk';

import { reducer } from '../reducers';
import { rootSaga } from '../sagas';

import { TodoListContainer } from './TodoList';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(thunk, sagaMiddleware));
sagaMiddleware.run(rootSaga);

export const App = () => (
  <View style={styles.app}>
    <SafeAreaView>
      <Text style={styles.title}>
        {'Todo List'}
      </Text>
      <TodoListContainer />
    </SafeAreaView>
  </View>
);

export const AppContainer = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const styles = StyleSheet.create({
  app: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
  }
});
