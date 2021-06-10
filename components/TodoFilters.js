import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Colors, Fonts, FontSizes } from './Styles';
import * as Actions from '../actions';

export const TodoFilter = ({ filter, selected, select }) => (
  <TouchableOpacity
    onPress={ () => select(filter) }
    style={[ styles.filter, selected && styles.selected ]}
  >
    <Text style={ styles.filterText }>
      { filter }
    </Text>
  </TouchableOpacity>
);

export const TodoFilters = () => {
  const dispatch = useDispatch();
  const selectedFilter = useSelector(state => state.filter);
  const select = (filter) => dispatch(Actions.filterTodos(filter));
  const filters = [ 'All', 'Active', 'Done' ];

  return (
    <View style={ styles.container }>
      { filters.map((filter, index) => (
          <TodoFilter
            key={ index }
            filter={ filter }
            select={ select }
            selected={ filter === selectedFilter }
          />
        ))
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  filter: {
    alignItems: 'center',
    backgroundColor: Colors.buttonInactive,
    borderRadius: 20,
    flexGrow: 1,
    flexShrink: 0,
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  filterText: {
    color: Colors.buttonText,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.body,
  },
  selected: {
    backgroundColor: Colors.buttonActive,
  },
});
