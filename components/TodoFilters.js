import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const Filters = {
  ALL: 'ALL',
  COMPLETE: 'COMPLETE',
  ACTIVE: 'ACTIVE'
};

export const FilterButton = props => (
  <TouchableOpacity onPress={props.onPress}>
    <Text style={[styles.filterButton, props.selected && styles.selected]}>
      {props.title}
    </Text>
  </TouchableOpacity>
);

export const TodoFilters = props => (
  <View style={styles.todoFilters}>
    <FilterButton
      title={'All'}
      selected={props.selected === Filters.ALL}
      onPress={() => props.onChange(Filters.ALL)}
    />
    <FilterButton
      title={'Active'}
      selected={props.selected === Filters.ACTIVE}
      onPress={() => props.onChange(Filters.ACTIVE)}
    />
    <FilterButton
      title={'Complete'}
      selected={props.selected === Filters.COMPLETE}
      onPress={() => props.onChange(Filters.COMPLETE)}
    />
  </View>
);

const styles = StyleSheet.create({
  todoFilters: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterButton: {
    fontSize: 20,
    color: '#2196f3',
  },
  selected: {
    textDecorationLine: 'underline',
  },
});
