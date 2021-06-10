import { channel } from 'redux-saga';
import { actionChannel, call, flush, fork, put, race, take, takeEvery } from 'redux-saga/effects';

import * as Actions from '../../actions';
import * as Api from '../../api';
import { rootSaga, createTodo, deleteTodo, toggleTodo, toggleTodoQueue } from '../../sagas';

describe('rootSaga()', () => {
  it('Yields effects', () => {
    const saga = rootSaga();

    const yield1 = takeEvery(Actions.CREATE_TODO, createTodo);
    const yield2 = takeEvery(Actions.DELETE_TODO, deleteTodo);
    const yield3 = fork(toggleTodoQueue);

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.next().value).toStrictEqual(yield2);
    expect(saga.next().value).toStrictEqual(yield3);
    expect(saga.next().done).toBe(true);
  });
});

describe('createTodo()', () => {
  it('Handles success', () => {
    const saga = createTodo(Actions.createTodo('Todo'));
    const todo = { id: 123, text: 'Todo', done: true };

    const yield1 = call(Api.createTodo, 'Todo');
    const yield2 = put(Actions.createTodoSuccess(todo));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.next(todo).value).toStrictEqual(yield2);
    expect(saga.next().done).toBe(true);
  });

  it('Handles error', () => {
    const saga = createTodo(Actions.createTodo('Todo'));
    const error = new Error();

    const yield1 = call(Api.createTodo, 'Todo');
    const yield2 = put(Actions.createTodoError(error));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.throw(error).value).toEqual(yield2);
    expect(saga.next().done).toBe(true);
  });
});

describe('deleteTodo()', () => {
  it('Handles success', () => {
    const saga = deleteTodo(Actions.deleteTodo(123));
    const todo = { id: 123, text: 'Todo', done: true };

    const yield1 = call(Api.deleteTodo, 123);
    const yield2 = put(Actions.deleteTodoSuccess(123));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.next(todo).value).toStrictEqual(yield2);
    expect(saga.next().done).toBe(true);
  });

  it('Handles error', () => {
    const saga = deleteTodo(Actions.deleteTodo(123));
    const error = new Error();

    const yield1 = call(Api.deleteTodo, 123);
    const yield2 = put(Actions.deleteTodoError(123, error));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.throw(error).value).toEqual(yield2);
    expect(saga.next().done).toBe(true);
  });
});

describe('toggleTodo()', () => {
  it('Handles success', () => {
    const saga = toggleTodo(Actions.toggleTodo(123, true));
    const todo = { id: 123, text: 'Todo', done: true };

    const yield1 = call(Api.toggleTodo, 123, true);
    const yield2 = put(Actions.toggleTodoSuccess(123, true));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.next(todo).value).toStrictEqual(yield2);
    expect(saga.next().done).toBe(true);
  });

  it('Handles error', () => {
    const saga = toggleTodo(Actions.toggleTodo(123, true));
    const error = new Error();

    const yield1 = call(Api.toggleTodo, 123, true);
    const yield2 = put(Actions.toggleTodoError(123, error));

    expect(saga.next().value).toStrictEqual(yield1);
    expect(saga.throw(error).value).toEqual(yield2);
    expect(saga.next().done).toBe(true);
  });
});

describe('toggleTodoQueue()', () => {
  it('Handles action channel', () => {
    const saga = toggleTodoQueue();
    const mockChannel = channel();

    const toggleTodoAction = Actions.toggleTodo();
    const toggleTodoCancelAction = Actions.toggleTodoCancel();

    const yield1 = actionChannel(Actions.TOGGLE_TODO);
    const yield2 = take(mockChannel);
    const yield3 = race({
      todo: call(toggleTodo, toggleTodoAction),
      cancel: take(Actions.TOGGLE_TODO_CANCEL)
    });
    const yield4 = flush(mockChannel);

    // Create a channel
    expect(saga.next().value).toStrictEqual(yield1);
    // Start receiving actions from the channel
    expect(saga.next(mockChannel).value).toStrictEqual(yield2);
    // Receive a toggleTodo action and pass it to the toggleTodo saga
    expect(saga.next(toggleTodoAction).value).toStrictEqual(yield3);
    // Receive a toggleTodoCancel action and flush the channel
    expect(saga.next({ cancel: toggleTodoCancelAction }).value).toStrictEqual(yield4);
    // Return to waiting for new actions from the channel
    expect(saga.next().value).toStrictEqual(yield2);
  });
});
