import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';
import * as reactRedux from 'react-redux';

import { Colors } from '../../components/Styles';
import { TodoFilters, TodoFilter } from '../../components/TodoFilters';
import * as Actions from '../../actions';

// useDispatch() will be called by every TodoFilters test
const useDispatchMock = jest.fn();
jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(useDispatchMock);

describe('TodoFilters', () => {
  it('Renders filters', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(null); // state.filter

    const renderer = TestRenderer.create(
      <TodoFilters />
    );
    const root = renderer.root;
    const filters = root.findAllByType(TodoFilter);

    expect(filters).toHaveLength(3);
    expect(filters[0].props.filter).toBe('All');
    expect(filters[1].props.filter).toBe('Active');
    expect(filters[2].props.filter).toBe('Done');
  });

  it('Handles selected state', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue('Done'); // state.filter

    const renderer = TestRenderer.create(
      <TodoFilters />
    );
    const root = renderer.root;
    const filters = root.findAllByType(TodoFilter);

    expect(filters[2].props.selected).toBe(true);
  });

  it('Handles user actions', () => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(null); // state.filter

    const renderer = TestRenderer.create(
      <TodoFilters />
    );
    const root = renderer.root;
    const filters = root.findAllByType(TodoFilter);
    const touchable = filters[2].findByType(TouchableOpacity);
    const expectedAction = Actions.filterTodos('Done');

    touchable.props.onPress();

    expect(useDispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});

describe('TodoFilter', () => {
  it('Handles clean state', () => {
    const renderer = TestRenderer.create(
      <TodoFilter filter={ 'All' } />
    );
    const root = renderer.root;
    const text = root.findByType(Text);

    expect(text.props.children).toBe('All');
  });

  it('Handles selected state', () => {
    const renderer = TestRenderer.create(
      <TodoFilter filter={ 'All' } selected={ true } />
    );
    const root = renderer.root;
    const touchable = root.findByType(TouchableOpacity);
    const selectedStyle = {
      backgroundColor: Colors.buttonActive,
    };

    expect(touchable.props.style).toContainEqual(selectedStyle);
  });

  it('Handles user actions', () => {
    const selectMock = jest.fn();
    const renderer = TestRenderer.create(
      <TodoFilter filter={ 'All' } select={ selectMock } />
    );
    const root = renderer.root;
    const touchable = root.findByType(TouchableOpacity);

    touchable.props.onPress();

    expect(selectMock).toHaveBeenCalledWith('All');
  });
});
