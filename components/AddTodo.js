import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

export const AddTodo = props => {
  const [text, setText] = useState(null);

  return (
    <View style={styles.addTodo}>
      <View style={styles.text}>
        <TextInput
          value={text}
          style={styles.textInput}
          placeholder={'New todo'}
          onChangeText={text => setText(text)}
        />
        {
          props.progress &&
          <ActivityIndicator style={styles.progress} color="gray" />
        }
      </View>
      <Button
        title={'Add'}
        disabled={props.progress}
        onPress={() => props.onAdd(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addTodo: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  text: {
    borderColor: 'gray',
    borderRadius: 2,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 40,
    marginRight: 10,
  },
  textInput: {
    borderWidth: 0,
    flex: 1,
    fontSize: 20,
    paddingVertical: 0,
    paddingLeft: 10,
  },
  progress: {
    marginRight: 10,
  },
});
