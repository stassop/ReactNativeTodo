import React, { useEffect, useState } from 'react';
import { TouchableOpacity, TextInput, Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import * as Actions from '../actions';
import { Colors, Fonts, FontSizes } from './Styles';

export const CreateTodo = () => {
  const inputRef = React.useRef(null); // Use React.useRef() to make it testable
  const dispatch = useDispatch();
  const error = useSelector(state => state.error);
  const creating = useSelector(state => state.creating);
  const [ text, setText ] = useState(null);

  const create = () => dispatch(Actions.createTodo(text));

  useEffect(() => {
    if (!error && !creating) {
      setText(null);
      inputRef.current.clear();
      inputRef.current.focus();
    }
  }, [ error, creating ]);

  return (
    <View style={ styles.container }>
      <TextInput
        value={ text }
        ref={ inputRef }
        style={ styles.textInput }
        placeholder={ 'Add todo' }
        onChangeText={ setText }
        onSubmitEditing={ create }
      />
      <TouchableOpacity
        onPress={ create }
        disabled={ creating }
        style={[ styles.button, creating && styles.disabled ]}
      >
        <Text style={ styles.buttonText }>
          { 'Add' }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    height: 40,
    margin: 20,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.body,
    height: '100%',
    paddingLeft: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: Colors.buttonActive,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    height: 40,
    justifyContent: 'center',
    margin: -1,
    paddingHorizontal: 20,
  },
  disabled: {
    backgroundColor: Colors.buttonDisabled,
  },
  buttonText: {
    color: Colors.buttonText,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.body,
  },
});
