import 'react-native';
import React from 'react';
// Test testRenderer must be imported after react-native
import TestRenderer from 'react-test-renderer';
import { Text } from 'react-native';

import { Filters, TodoFilters, FilterButton } from '../../components/TodoFilters';

describe('FilterButton', () => {
  it('Renders correctly when selected', () => {
    const title = 'All';

    const testRenderer = TestRenderer.create(
      <FilterButton
        title={title}
        selected={true}
      />
    );

    const component = testRenderer.root;
    const text = component.findByType(Text);
    const style = {textDecorationLine: 'underline'};

    expect(text.props.children).toBe(title);
    expect(text.props.style).toContainEqual(style);
  });
});

describe('TodoFilters', () => {
  it('Renders correctly and applies selection', () => {
    const testRenderer = TestRenderer.create(
      <TodoFilters
        selected={Filters.ALL}
      />
    );

    const component = testRenderer.root;
    const buttons = component.findAllByType(FilterButton);

    expect(buttons.length).toBe(3);

    expect(buttons[0].props.title).toBe('All');
    expect(buttons[0].props.selected).toBe(true);

    expect(buttons[1].props.title).toBe('Active');
    expect(buttons[1].props.selected).toBe(false);

    expect(buttons[2].props.title).toBe('Complete');
    expect(buttons[2].props.selected).toBe(false);
  });

  it('Handles press actions correctly', () => {
    const onChange = jest.fn();

    const testRenderer = TestRenderer.create(
      <TodoFilters
        onChange={onChange}
      />
    );

    const component = testRenderer.root;
    const buttons = component.findAllByType(FilterButton);

    buttons[0].props.onPress();

    expect(onChange).toHaveBeenCalledWith(Filters.ALL);

    // Clear previous calls
    onChange.mockClear();
    buttons[1].props.onPress();

    expect(onChange).toHaveBeenCalledWith(Filters.ACTIVE);

    // Clear previous calls
    onChange.mockClear();
    buttons[2].props.onPress();

    expect(onChange).toHaveBeenCalledWith(Filters.COMPLETE);
  });
});
