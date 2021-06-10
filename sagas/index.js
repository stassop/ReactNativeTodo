import { actionChannel, call, flush, fork, put, race, take, takeEvery } from 'redux-saga/effects';

import * as Api from '../api';
import * as Actions from '../actions';

export function* createTodo(action) {
  const { text } = action;
  try {
    const todo = yield call(Api.createTodo, text);
    yield put(Actions.createTodoSuccess(todo));
  }
  catch (error) {
    yield put(Actions.createTodoError(error));
  }
}

export function* deleteTodo(action) {
  const { id } = action;
  try {
    const todo = yield call(Api.deleteTodo, id);
    yield put(Actions.deleteTodoSuccess(todo.id));
  }
  catch (error) {
    yield put(Actions.deleteTodoError(id, error));
  }
}

export function* toggleTodo(action) {
  const { id, done } = action;
  try {
    const todo = yield call(Api.toggleTodo, id, done);
    yield put(Actions.toggleTodoSuccess(todo.id, todo.done));
  }
  catch (error) {
    yield put(Actions.toggleTodoError(id, error));
  }
}

export function* toggleTodoQueue() {
  // Create a channel
  const channel = yield actionChannel(Actions.TOGGLE_TODO);
  while (true) {
    // Start receiving actions from the channel
    const action = yield take(channel);
    // Wait for either toggle success/failure or a cancel action
    const { todo, cancel } = yield race({
      todo: call(toggleTodo, action),
      cancel: take(Actions.TOGGLE_TODO_CANCEL)
    });
    // If canceled flush remaining actions in the channel
    if (cancel) {
      const actions = yield flush(channel);
    }
  }
}

export function* rootSaga() {
  yield takeEvery(Actions.CREATE_TODO, createTodo);
  yield takeEvery(Actions.DELETE_TODO, deleteTodo);
  yield fork(toggleTodoQueue);
}
