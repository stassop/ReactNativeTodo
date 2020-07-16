import { channel } from 'redux-saga';
import { actionChannel, call, flush, fork, put, race, take, takeEvery } from 'redux-saga/effects';

import {
  ADD_TODO,
  COMPLETE_TODO_CANCEL,
  COMPLETE_TODO_SUCCESS,
  COMPLETE_TODO,
  DELETE_TODO,
} from '../../actions';

import {
  addTodo as addTodoAction,
  deleteTodo as deleteTodoAction,
  completeTodo as completeTodoAction,
  addTodoError,
  addTodoSuccess,
  completeTodoCancel,
  completeTodoError,
  completeTodoSuccess,
  deleteTodoError,
  deleteTodoSuccess,
} from '../../actions';

import {
  addTodo,
  completeTodo,
  deleteTodo,
  rootSaga,
  queueCompleteTodo,
} from '../../sagas';

import { Api } from '../../api/Api';

// Mocks
const todo = {id: '1', text: 'Todo', complete: true};

describe('rootSaga()', () => {
  it('Yields other sagas', () => {
    const saga = rootSaga();

    const yield1 = takeEvery(ADD_TODO, addTodo);
    const yield2 = takeEvery(DELETE_TODO, deleteTodo);
    const yield3 = fork(queueCompleteTodo);

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.next().value).toStrictEqual(yield2);
    expect(saga.next().value).toStrictEqual(yield3);
    expect(saga.next().done).toBe(true);
  });
});

describe('addTodo()', () => {
  it('Takes an action, calls the API, and dispatches a succes action', () => {
    const saga = addTodo(addTodoAction(todo.text));

    const yield1 = call(Api.addTodo, todo.text);
    const yield2 = put(addTodoSuccess(todo));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.next(todo).value).toStrictEqual(yield2);
    expect(saga.next().done).toBe(true);
  });

  it('Takes an action, calls the API, and dispatches an error action', () => {
    const saga = addTodo(addTodoAction(todo.text));

    const error = new Error();

    const yield1 = call(Api.addTodo, todo.text);
    const yield2 = put(addTodoError(error));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.throw(error).value).toEqual(yield2);
    expect(saga.next().done).toBe(true);
  });
});

describe('deleteTodo()', () => {
  it('Takes an action, calls the API, and dispatches a succes action', () => {
    const saga = deleteTodo(deleteTodoAction(todo.id));

    const yield1 = call(Api.deleteTodo, todo.id);
    const yield2 = put(deleteTodoSuccess(todo.id));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.next(todo).value).toStrictEqual(yield2);
    expect(saga.next().done).toBe(true);
  });

  it('Takes an action, calls the API, and dispatches an error action', () => {
    const saga = deleteTodo(deleteTodoAction(todo.id));

    const error = new Error();

    const yield1 = call(Api.deleteTodo, todo.id);
    const yield2 = put(deleteTodoError(todo.id, error));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.throw(error).value).toEqual(yield2);
    expect(saga.next().done).toBe(true);
  });
});

describe('completeTodo()', () => {
  it('Takes an action, calls the API, and dispatches a succes action', () => {
    const saga = completeTodo(completeTodoAction(todo.id, todo.complete));

    const yield1 = call(Api.completeTodo, todo.id, todo.complete);
    const yield2 = put(completeTodoSuccess(todo.id, todo.complete));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.next(todo).value).toStrictEqual(yield2);
    expect(saga.next().done).toBe(true);
  });

  it('Takes an action, calls the API, and dispatches an error action', () => {
    const saga = completeTodo(completeTodoAction(todo.id, todo.complete));

    const error = new Error();

    const yield1 = call(Api.completeTodo, todo.id, todo.complete);
    const yield2 = put(completeTodoError(todo.id, error));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.throw(error).value).toEqual(yield2);
    expect(saga.next().done).toBe(true);
  });
});

describe('queueCompleteTodo()', () => {
  it('Buffers multiple actions and processes them in a queue', () => {
    const saga = queueCompleteTodo();
    const mockChannel = channel();

    const completeAction = completeTodoAction();
    const cancelAction = completeTodoCancel();

    const yield1 = actionChannel(COMPLETE_TODO);
    const yield2 = take(mockChannel);
    const yield3 = race({
      todo: call(completeTodo, completeAction),
      cancel: take(COMPLETE_TODO_CANCEL)
    });
    const yield4 = flush(mockChannel);

    expect(saga.next().value).toStrictEqual(yield1);
    // We expect the previous call to return an actionChannel,
    // so we pass a channel to the next call
    expect(saga.next(mockChannel).value).toStrictEqual(yield2);
    // At this point the channel is expecting a complete action,
    // so we pass an action to the next call
    expect(saga.next(completeAction).value).toStrictEqual(yield3);
    // At this point the saga is expecting either a resolved Api call
    // or a cancel action, so we pass the latter to expect cancel handling
    expect(saga.next({cancel: cancelAction}).value).toStrictEqual(yield4);
    // When canceled, the generator flushes queued actions,
    // and returns to waiting for new complete actions
    expect(saga.next().value).toStrictEqual(yield2);
  });
});
