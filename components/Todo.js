import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Colors, Fonts, FontSizes } from './Styles';
import { Checkbox } from './Checkbox';
import { IconButton } from './IconButton';

import * as Actions from '../actions';

export const Todo = ({ id, text, done, progress }) => {
  const dispatch = useDispatch();
  const deleteSelf = () => dispatch(Actions.deleteTodo(id));
  const toggle = (checked) => dispatch(Actions.toggleTodo(id, checked));

  return (
    <View style={ styles.container }>
      <Checkbox
        checked={ done }
        disabled={ progress }
        onChange={ toggle }
      />
      <Text
        numberOfLines={ 1 }
        ellipsizeMode="tail"
        style={[ styles.text, done && styles.done ]}
      >
        { text }
      </Text>
      <IconButton
        icon="delete"
        disabled={ progress }
        onPress={ deleteSelf }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 20,
  },
  text: {
    color: Colors.todoActive,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.body,
    marginLeft: 10,
    flex: 1,
  },
  done: {
    textDecorationLine: 'line-through',
    color: Colors.todoDone,
  },
  progress: {
    marginRight: 10,
  },
});
