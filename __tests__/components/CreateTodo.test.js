import React from 'react';
import TestRenderer from 'react-test-renderer';
import { TextInput, TouchableOpacity } from 'react-native';
import * as reactRedux from 'react-redux'

import * as Actions from '../../actions';
import { CreateTodo } from '../../components/CreateTodo';

// useDispatch() will be called by every test
const useDispatchMock = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(useDispatchMock);

describe('CreateTodo', () => {
  it('Handles clean state', () => {
    const useRefMock = {
      current: {
        clear: jest.fn(),
        focus: jest.fn()
      }
    };
    jest.spyOn(React, 'useRef').mockReturnValue(useRefMock); // TextInput ref
    // useSelector() mocks must be defined in the same order as the calls
    jest.spyOn(reactRedux, 'useSelector')
      .mockReturnValueOnce(null) // state.error
      .mockReturnValueOnce(false); // state.creating

    let renderer;
    // Wrap create() in act() for hooks to take effect
    TestRenderer.act(() => {
      renderer = TestRenderer.create(
        <CreateTodo />
      );
    });
    const root = renderer.root;
    const textInput = root.findByType(TextInput);

    expect(textInput.props.value).toBe(null);
    expect(useRefMock.current.clear).toHaveBeenCalled();
    expect(useRefMock.current.focus).toHaveBeenCalled();
  });

  it('Handles busy state', () => {
    // useSelector() mocks must be defined in the same order as the calls
    jest.spyOn(reactRedux, 'useSelector')
      .mockReturnValueOnce(null) // state.error
      .mockReturnValueOnce(true); // state.creating

    let renderer;
    // Wrap create() in act() for hooks to take effect
    TestRenderer.act(() => {
      renderer = TestRenderer.create(
        <CreateTodo />
      );
    });
    const root = renderer.root;
    const touchable = root.findByType(TouchableOpacity);

    expect(touchable.props.disabled).toBe(true);
  });

  it('Handles success', () => {
    const text = 'Todo';
    const expectedAction = Actions.createTodo(text);
    // useSelector() will be called by every act()
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(null);

    let renderer;
    // Wrap create() in act() for hooks to take effect
    TestRenderer.act(() => {
      renderer = TestRenderer.create(
        <CreateTodo />
      );
    });
    const root = renderer.root;
    const textInput = root.findByType(TextInput);

    // Wrap each call in act() for it to take effect before the next one
    TestRenderer.act(() => {
      textInput.props.onChangeText(text);
    });

    TestRenderer.act(() => {
      textInput.props.onSubmitEditing();
    });

    expect(useDispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
