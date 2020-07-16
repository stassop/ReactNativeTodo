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
