import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Todo } from './Todo';
import { CreateTodo } from './CreateTodo';
import { TodoFilters } from './TodoFilters';
import { Colors } from './Styles';

import * as Actions from '../actions';

export const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);
  const filter = useSelector(state => state.filter);
  const fetching = useSelector(state => state.fetching);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'Done':
        return todo.done;
      case 'Active':
        return !todo.done;
      default:
        return todo;
    }
  });

  useEffect(() => {
    dispatch(Actions.fetchTodosAsync());
    return () => dispatch(Actions.toggleTodoCancel());
  }, []);

  const renderItem = ({ item }) => (
    <Todo { ...item } />
  );

  const keyExtractor = (item) => item.id;

  const getItemLayout = (item, index) => {
    const itemHeight = 60;
    return { length: itemHeight, offset: itemHeight * index, index };
  };

  return (
    <SafeAreaView style={ styles.container }>
      <CreateTodo />
      <TodoFilters />
      { fetching
        ? <ActivityIndicator size="large" color="gray" />
        : <FlatList
            data={ filteredTodos }
            renderItem={ renderItem }
            keyExtractor={ keyExtractor }
            getItemLayout={ getItemLayout }
          />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});
