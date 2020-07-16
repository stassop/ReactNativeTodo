# TL;DR guide to React Native testing

## Why write tests?

Writing tests can save you a lot of trouble down the road, and help you gain a peace of mind. Another, less obvious reason to write tests is that good tests reflect good architecture. When your application has a coherent structure, and a proper separation of concerns, writing tests for it should be a breeze.

The ease of testing is one of the main advantages of React/Redux applications. Everything in React/Redux architecture is a plain JavaScript object at some point in its life cycle. So testing it is often as simple as parsing the object and checking its properties. So when you're not writing tests, you're missing out on one of the best features of your stack.

## Unit, integration or e2e?

You have probably heard "Write tests. Not too many. Mostly integration." There are many different paradigms when it comes to testing, with varying degree of emphasis on unit, integration and e2e. But generally, when it comes to impact/effort and working with a continuously changing codebase, unit tests are your best friend.

Unit tests allow you to test your code in small parts, are fast, can be written by all developers, and encourage developers to take responsibility for their work. But most importantly, unit tests cover the basic parts of your code, creating a secure base for higher-level tests, allowing them to be more simple and fast as well.

## What are good tests?

So what are the qualities of good tests? Speed, isolation, and repeatability are some of the ones often mentioned. It's also important to mention that good tests imitate real-life scenarios without creating redundancy. Simply checking if a component gets rendered often doesn't cut it. But testing every small detail of it can cause tests to fail after every minor change.

## Example todo app

So let's consider the above in the context of a simple todo app.

You can find the app here: https://github.com/stassop/reactnativetesting

To run the app and tests:

```
npm install
npm test
node node/app.js
react-native run-ios
```

**THE EXAMPLES BELOW CONTAIN ONLY A SMALL PORTION OF THE TESTS. SEE THE CODE FOR A COMPLETE OVERVIEW.**

So without further ado, let's get to it!

## Testing components

Testing React components is a breeze with Jest and React Test Renderer. Because Virtual DOM tree is a an object, we can test our components by parsing the object and checking its properties. React Test Renderer converts components to plain JavaScript objects, without any native platform dependencies.

Let's consider the following example:

```javascript
// components/Todo.js
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Checkbox } from './Checkbox';
import { IconButton } from './IconButton';

export const Todo = props => (
  <View style={styles.todo}>
    <Checkbox
      checked={props.complete}
      disabled={props.progress}
      onChange={complete => props.onComplete(props.id, complete)}
    />
    <Text style={[styles.text, props.complete && styles.complete]}>
      {props.text}
    </Text>
    {
      props.progress &&
      <ActivityIndicator style={styles.progress} color="gray" />
    }
    <IconButton
      icon="delete"
      disabled={props.progress}
      onPress={() => props.onDelete(props.id)}
    />
  </View>
);

const styles = StyleSheet.create({
  todo: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    marginLeft: 10,
    flex: 1,
  },
  complete: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  progress: {
    marginRight: 10,
  },
});
```

So how do we test this?

First, we import all the dependencies:

```javascript
import 'react-native';
import React from 'react';
// Test renderer must be imported after react-native
import TestRenderer from 'react-test-renderer';
import { Text, ActivityIndicator } from 'react-native';

import { Todo } from '../../components/Todo';
import { Checkbox } from '../../components/Checkbox';
import { IconButton } from '../../components/IconButton';
```

And create mocks for our component props:

```javascript
const todo = {id: '1', text: 'Todo', complete: true};
```

And put our tests in a `describe()` block to define their scope:

```javascript
describe('Todo', () => {
   // Put your tests here
});
```

It's important that our Todo component appears a certain way when it's completed, so we test that:

```javascript
it('Renders correctly when completed', () => {
  const testRenderer = TestRenderer.create(
    <Todo {...todo} />
  );

  const component = testRenderer.root;
  const checkbox = component.findByType(Checkbox);
  const text = component.findByProps({children: todo.text});
  const style = {textDecorationLine: 'line-through', color: 'gray'};

  expect(text.type).toBe(Text);
  expect(text.props.style).toContainEqual(style);
  expect(checkbox.props.checked).toBe(todo.complete);
});
```

Notice that `style` is just a plain object, we don't need to put it in `StyleSheet.create()`. Because `TestRenderer` returns an object, all of the component's props are objects too. Also, we just check if `Checkbox` has the correct props, without testing any of its implementation details here, because it's tested in a separate unit test.

We expect the component to call the `onComplete` method when the checkbox is pressed:

```javascript
it('Handles complete actions correctly', () => {
  const onComplete = jest.fn();

  const testRenderer = TestRenderer.create(
    <Todo
      {...todo}
      onComplete={onComplete}
    />
  );

  const component = testRenderer.root;
  const checkbox = component.findByType(Checkbox);

  checkbox.props.onChange(false);

  expect(onComplete).toHaveBeenCalledWith(todo.id, false);
});
```

Todo also has a delete button, so we need to test if it calls the correct callback:

```javascript
it('Handles delete actions correctly', () => {
  const onDelete = jest.fn();

  const testRenderer = TestRenderer.create(
    <Todo
      {...todo}
      onDelete={onDelete}
    />
  );

  const component = testRenderer.root;
  const deleteButton = component.findByType(IconButton);

  deleteButton.props.onPress();

  expect(onDelete).toHaveBeenCalledWith(todo.id);
});
```

And, finally, we expect Todo to appear a certain way when in progress, so we test that as well:

```javascript
it('Renders correctly when in progress', () => {
  const testRenderer = TestRenderer.create(
    <Todo
      {...todo}
      progress={true}
    />
  );

  const component = testRenderer.root;
  const checkbox = component.findByType(Checkbox);
  const deleteButton = component.findByType(IconButton);
  const activityIndicator = component.findByType(ActivityIndicator);

  expect(checkbox.props.disabled).toBe(true);
  expect(deleteButton.props.disabled).toBe(true);
});
```

Notice that we don't have any additional checks for `ActivityIndicator`. That's because `findByType()` expects to find exactly one instance, otherwise it will throw an error. In this case the selector is the test.

Some good tips for testing components:
  * Keep it simple, don't overthink it, test only the things that matter
  * Don't test styles unless it constitutes an essential part of the component logic
  * Good code is testable code. If it isn't easy to test, consider changing your code

Useful links:
  * https://reactjs.org/docs/test-renderer.html
  * https://codeburst.io/revisiting-react-testing-in-2019-ee72bb5346f4
  * https://itnext.io/testing-react-16-3-components-with-react-test-renderer-without-enzyme-d9c65d689e88

## Testing actions

Action creator tests are generally very basic, but they allow us to rely on action creators in other tests without having to worry about their implementation.

```javascript
// actions/index.js
export const addTodo = text => ({
  type: ADD_TODO,
  text
});
```

To test an action, simply call the action creator function, and compare the result to the plain object you expect to get back:

```javascript
import { addTodo } from '../../actions';

describe('addTodo()', () => {
  it('Creates ADD_TODO action', () => {
    const text = 'Todo';
    const action = {type: ADD_TODO, text};

    expect(addTodo(text)).toStrictEqual(action);
  });
});
```

That's all there is to it! Now we can safely use `addTodo()` in other tests!

## Testing async actions (Redux Thunk)

Testing async actions requires slightly more work, but is just as simple once you get the basic idea.

```javascript
// actions/index.js
export const fetchTodosAsync = () => {
  return dispatch => {
    dispatch(fetchTodos());
    return Api.fetchTodos()
      .then(todos => dispatch(fetchTodosSuccess(todos)))
      .catch(error => dispatch(fetchTodosError(error)));
  }
};
```

We stub and mock the API and store methods, and check if they've been called with expected arguments:

```javascript
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import {
  fetchTodos,
  fetchTodosAsync,
  fetchTodosSuccess,
} from '../../actions';

import { Api } from '../../api/Api';
// Mocks
const mockStore = configureMockStore([thunk]);
const todo = {id: '1', text: 'Todo', complete: false};

// fetchTodosAsync() is an async thunk action, so we test it differently
describe('fetchTodosAsync()', () => {
  it('Handles successful todo fetch correctly', () => {
    const store = mockStore();
    const todos = [todo];

    // Because the action calls an async Api method, we need to mock it
    const fetchTodosMock = jest.spyOn(Api, 'fetchTodos')
      .mockImplementation(() => Promise.resolve(todos));

    const actions = [
      fetchTodos(),
      fetchTodosSuccess(todos)
    ];

    // If return is omitted, the test will pass by default
    return store
      // The action is processed by the store thunk middleware
      // so it has to be dispatched to take effect
      .dispatch(fetchTodosAsync())
      // The action async, so it has to complete before running tests
      .then(() => {
        // Expect the Api method to have been called
        expect(fetchTodosMock).toHaveBeenCalledWith();
        // And correct actions to have been dispatched
        expect(store.getActions()).toStrictEqual(actions);
        // Restore the original method
        fetchTodosMock.mockRestore();
      });
  });
});
```

Notice that we don't care how the state mutates after the calls, that's a different test. Because this is a unit test, we only care about the calls being correct, and mock everything outside of its immediate concern. We do, however, resolve the Promise returned by the API, to allow the async action to make a full roundtrip call and resolve.

We also call `toHaveBeenCalledWith()` without any arguments, because `Api.fetchTodos()` doesn't expect any.

Some good tips for testing async actions:
  * Because it's a unit test, run it in isolation and use mocks
  * Use `redux-mock-store` to test if action calls get received by the store
  * Good code is testable code. If it isn't easy to test, consider changing your code

Useful links:
  * https://jestjs.io/docs/en/tutorial-async
  * https://www.npmjs.com/package/redux-mock-store
  * https://redux.js.org/advanced/async-actions

## Testing reducers

Testing Redux reducers is as simple as calling a reducer function with an initial state and an action, and comparing the mutated state to the expected one.

```javascript
// reducers/index.js
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO_SUCCESS:
      return {
        ...state,
        adding: false,
        todos: [
          ...state.todos,
          {...action.todo, progress: false}
        ]
      };
  }
};
```

Reducers are just functions that accept plain objects, so no magic here. Just pass an initial state and an action to it, and check the result.

```javascript
import { reducer, initialState } from '../../reducers';
import { addTodoSuccess } from '../../actions';

const todo = {id: '1', text: 'Todo', complete: false};

describe('Main reducer', () => {
  it('Changes todos state on ADD_TODO_SUCCESS', () => {
    const action = addTodoSuccess(todo);
    const state = reducer(initialState, action);
    const expectedState = {
      ...initialState,
      todos: [{...todo, progress: false}],
      adding: false
    };

    expect(state).toStrictEqual(expectedState);
  });
});
```

Keep in mind that `toStrictEqual()` expects same object structure, not the same object.

Also, notice that we're using actions creators that we tested earlier, so no need to test the action here.

## Testing Redux Saga

Although understanding Redux Saga can sometimes be challenging, testing it surprisingly easy. In fact, testability is one of its best features. Because sagas are essentially generator functions, and every saga effect (`put()`, `take()` etc.) returns a plain object, testing sagas is as simple as calling `next()`, and comparing the yielded result to the expected object.

Let's consider this saga that creates a channel that waits for `COMPLETE_TODO` actions, stores then in a buffer, and then handles them one by one sequentially. However, if `COMPLETE_TODO_CANCEL` arrives, the saga stops processing the buffered actions, and disposes of them.

```javascript
// sagas/index.js
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
```

If this looks confusing, just consider that every `next()` call generates an instruction for Redux Saga in the form of a plain object. Those instructions are only executed when passed to the store that is running Redux Saga middleware. So don't expect any calls outside of the saga. Just call `next()` and compare the resulting instruction object to the expected one.

```javascript
import { channel } from 'redux-saga';
import { actionChannel, call, race, take } from 'redux-saga/effects';

import { COMPLETE_TODO, COMPLETE_TODO_CANCEL, completeTodo as completeTodoAction, completeTodoCancel } from '../../actions';
import { completeTodo, queueCompleteTodo } from '../../sagas';

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
```

Sometimes an effect can return a value, which can be used by the saga as a condition. Simply pass the expected return value to the following `next()` call as an argument.

Here are some tips to make sagas more testable:
  * Make every step of a saga an effect to make it testable
  * Split big sagas into multiple generator functions that can be tested separately
  * Good code is testable code. If it isn't easy to test, consider changing your code

Useful links:
  * https://redux-saga.js.org/docs/advanced/Testing.html
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
  * https://codeburst.io/understanding-generators-in-es6-javascript-with-examples-6728834016d5

## Integration tests

Integration tests are supposed to give us a bird's-eye view of the application, and to show whether it works correctly at the most basic level, without getting too deep into details. By this point we've already tested all of our components, actions, reducers etc. separately. Now we want to zoom out and see how they all work together as one.

First, let's import our dependencies and mock a few things the app expects to be there.

```javascript
import 'react-native';
import React from 'react';
import { TextInput, Button, LayoutAnimation } from 'react-native';
// Note: test testRenderer must be required after react-native.
import TestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import { reducer } from '../../reducers';
import { rootSaga } from '../../sagas';

import { Api } from '../../api/Api';
import { App } from '../../components/App';
import { Todo } from '../../components/Todo';
import { AddTodo } from '../../components/AddTodo';
import { TodoFilters, Filters } from '../../components/TodoFilters';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(thunk, sagaMiddleware));
sagaMiddleware.run(rootSaga);

// Mocks
const todos = [
  {id: '1', text: 'First todo', complete: false},
  {id: '2', text: 'Second todo', complete: false},
];

// We need this to prevent jest errors related to animation
jest.spyOn(LayoutAnimation, 'configureNext')
  .mockImplementation(() => jest.fn());

```

We create a single `App` instance in this test because we want to preserve the state throughout the test. Also, we pass it a real store with reducers and middleware instead of a mock. However, we still mock our API calls because they are outside of our React/Redux scope.

```javascript
describe('App', () => {
  let testRenderer;

  // This mock must be created before the App instance
  // because it gets called when the TodoList component mounts
  const fetchTodosMock = jest.spyOn(Api, 'fetchTodos')
    .mockImplementation(() => Promise.resolve([todos[0]]));

  // If this looks weird, check the links for explanation
  // https://jestjs.io/docs/en/setup-teardown#one-time-setup
  // https://reactjs.org/blog/2019/08/08/react-v16.9.0.html#async-act-for-testing
  beforeAll(() => {
    return TestRenderer.act(async () => {
      testRenderer = TestRenderer.create(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });
  });

  afterAll(() => {
    fetchTodosMock.mockRestore();
  });

  // Put your tests here
});
```

Notice that the `TestRenderer.create()` is called inside `TestRenderer.act()`, which is returned by `beforeAll()`. This is done to make `create()` async, and wait for it before running the tests. This ensures that hooks, mutations etc. will take effect before the tests.

The first test is quite small: we simply wanna check if todos are loaded when the component mounts.

```javascript
it('Loads todos', () => {
  const app = testRenderer.root;
  const todoComponents = app.findAllByType(Todo);

  expect(fetchTodosMock).toHaveBeenCalledWith();
  expect(todoComponents.length).toBe(1);
});
```

Next, we test if new todos get added as they should. Again, a very simple test, since we've already tested all of its constituents. We simply call the `onAdd()` method as if it's been called by the component itself. Notice that we put the call in `TestRenderer.act()` and make it async to make sure it makes a full roundtrip and updates the DOM.

```javascript
it('Adds todos', async () => {
  const addTodoMock = jest.spyOn(Api, 'addTodo')
    .mockImplementation(() => Promise.resolve(todos[1]));

  const app = testRenderer.root;
  const addTodo = app.findByType(AddTodo);

  await TestRenderer.act(async () => {
    addTodo.props.onAdd(todos[1].text);
  });

  const todoComponents = app.findAllByType(Todo);

  expect(addTodoMock).toHaveBeenCalledWith(todos[1].text);
  expect(todoComponents.length).toBe(2);

  addTodoMock.mockRestore();
});
```

Testing if todo's get deleted correctly is, again, simple. Because we've already tested `Todo`, reducers, sagas etc., we just test if the API method gets called with the correct params when we call `onDelete()`. Since we have two todos, we expect to find only one when the DOM is updated.

```javascript
it('Deletes todos', async () => {
  const todo = todos[0];
  const deleteTodoMock = jest.spyOn(Api, 'deleteTodo')
    .mockImplementation(() => Promise.resolve(todos[0]));

  const app = testRenderer.root;
  let todoComponents = app.findAllByType(Todo);

  await TestRenderer.act(async () => {
    todoComponents[0].props.onDelete(todos[0].id);
  });

  todoComponents = app.findAllByType(Todo);

  expect(deleteTodoMock).toHaveBeenCalledWith(todos[0].id);
  expect(todoComponents.length).toBe(1);

  deleteTodoMock.mockRestore();
});
```

You'll find the rest of tests in the Git repo.

Some good tips for writing better integration tests:
  * Don't test minor details, test the whole picture
  * Make sure the DOM is updated before running checks
  * Good code is testable code. If it isn't easy to test, consider changing your code

Useful links:
  * https://jestjs.io/docs/en/setup-teardown#one-time-setup
  * https://reactjs.org/blog/2019/08/08/react-v16.9.0.html#async-act-for-testing
  * https://itnext.io/react-redux-integration-tests-with-jest-enzyme-df9aa6effd13
