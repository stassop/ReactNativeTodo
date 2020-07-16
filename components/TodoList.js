import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import { Todo } from './Todo';
import { AddTodo } from './AddTodo';
import { TodoFilters, Filters } from './TodoFilters';
import { Error } from './Error';

import {
  addTodo,
  changeTodoText,
  completeTodo,
  completeTodoCancel,
  deleteTodo,
  fetchTodosAsync,
  filterTodos,
} from '../actions';

const applyFilter = (todos, filter) => {
  switch (filter) {
    case Filters.COMPLETE:
      return todos.filter(todo => todo.complete);
    case Filters.ACTIVE:
      return todos.filter(todo => !todo.complete);
    case Filters.ALL:
    default:
      return todos;
  }
};

const mapStateToProps = state => ({
  todos: applyFilter(state.todos, state.filter),
  adding: state.adding,
  error: state.error,
  fetching: state.fetching,
  filter: state.filter,
});

const mapDispatchToProps = dispatch => ({
  addTodo: text => dispatch(addTodo(text)),
  completeTodo: (id, complete) => dispatch(completeTodo(id, complete)),
  completeTodoCancel: () => dispatch(completeTodoCancel()),
  deleteTodo: id => dispatch(deleteTodo(id)),
  fetchTodos: () => dispatch(fetchTodosAsync()),
  filterTodos: filter => dispatch(filterTodos(filter)),
});

const styles = StyleSheet.create({
  todoList: {
    alignItems: 'stretch',
    flexDirection: 'column',
  }
});

export const TodoList = props => {
  useEffect(() => {
    // This call will be performed once on mount
    props.fetchTodos();
    // Returned cleanup function will be called on unmount
    return () => props.completeTodoCancel();
    // Use [] to have lifecycle callbacks called only once
  }, []);

  const renderItem = ({item}) => {
    return (
      <Todo
        id={item.id}
        text={item.text}
        progress={item.progress}
        complete={item.complete}
        onDelete={props.deleteTodo}
        onComplete={props.completeTodo}
      />
    );
  }

  const keyExtractor = item => item.id;

  const getItemLayout = (item, index) => {
    const itemHeight = 60;
    return {length: itemHeight, offset: itemHeight * index, index};
  };

  return (
    <View style={styles.todoList}>
      <Error text={props.error} />
      <AddTodo
        onAdd={props.addTodo}
        progress={props.adding}
      />
      <TodoFilters
        selected={props.filter}
        onChange={props.filterTodos}
      />
      {
        props.fetching &&
        <ActivityIndicator size="large" color="gray" />
      }
      <FlatList
        data={props.todos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

export const TodoListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
