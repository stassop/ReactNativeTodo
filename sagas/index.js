import { actionChannel, call, flush, fork, put, race, take, takeEvery } from 'redux-saga/effects';

import {
  ADD_TODO,
  COMPLETE_TODO_CANCEL,
  COMPLETE_TODO,
  DELETE_TODO,
} from '../actions';

import {
  addTodoError,
  addTodoSuccess,
  completeTodoError,
  completeTodoSuccess,
  deleteTodoError,
  deleteTodoSuccess,
} from '../actions';

import { Api } from '../api/Api';

export function* addTodo(action) {
  const { text } = action;

  try {
    const todo = yield call(Api.addTodo, text);
    yield put(addTodoSuccess(todo));
  }
  catch (error) {
    yield put(addTodoError(error));
  }
}

export function* deleteTodo(action) {
  const { id } = action;

  try {
    const todo = yield call(Api.deleteTodo, id);
    yield put(deleteTodoSuccess(todo.id));
  }
  catch (error) {
    yield put(deleteTodoError(id, error));
  }
}

export function* completeTodo(action) {
  const { id, complete } = action;

  try {
    const todo = yield call(Api.completeTodo, id, complete);
    yield put(completeTodoSuccess(todo.id, todo.complete));
  }
  catch (error) {
    yield put(completeTodoError(id, error));
  }
}

export function* queueCompleteTodo() {
  // actionChannel() buffers multiple actions in a queue
  const channel = yield actionChannel(COMPLETE_TODO);

  while (true) {
    // Get queued actions one at a time, in the same order
    const action = yield take(channel);

    // Wait for either todo to be completed, or the queue to be canceled, whichever arrives ﬁrst
    const { todo, cancel } = yield race({
      todo: call(completeTodo, action),
      cancel: take(COMPLETE_TODO_CANCEL)
    });

    // If canceled, flush the queued actions
    if (cancel) {
      const actions = yield flush(channel);
    }
  }
}

export function* rootSaga() {
  yield takeEvery(ADD_TODO, addTodo);
  yield takeEvery(DELETE_TODO, deleteTodo);
  yield fork(queueCompleteTodo);
}
