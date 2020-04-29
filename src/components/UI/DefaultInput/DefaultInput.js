import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

// const defaultInput = props => <TextInput style={styles.input} {...props} />;

// We wrote style first and then {...props} so any other props (including new style) will replace this component style
// If we do not want to replace this component style then we should write {...props} first and then style.
// But REMEMBER this will replace the whole style object. It will not merge styles.
// So to merge properties, we will use the following syntax.
// We use array, this will merge props.style into this component style. So order is important.

const defaultInput = (props) => (
  <TextInput
    {...props}
    style={[styles.input, props.style, !props.valid && props.touched ? styles.invalid : null]}
    placeholderTextColor={'orange'}
  />
);

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'orange',
    padding: 5,
    marginTop: 8,
    marginBottom: 8,
    color: 'orange',
  },
  invalid: {
    backgroundColor: '#f9c0c0',
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default defaultInput;
