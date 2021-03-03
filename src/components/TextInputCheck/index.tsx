import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TextInputProps,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#e6e7e8',
    borderBottomWidth: 1.8,
    width: 328,
    marginBottom: 36,
    flexDirection: 'row',
  },
  textInput: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    padding: 0,
    width: 328 - 20,
    flexGrow: 1,
  },
  check: {
    width: 20,
    fontFamily: 'Roboto_400Regular',
    color: '#434343',
    paddingLeft: 5,
  },
});

interface TextInputCheckProps extends TextInputProps {
  validation: (_: string) => boolean;
}

export default function TextInputCheck(props: TextInputCheckProps): JSX.Element {
  const { validation } = props;
  const [shouldShow, setShouldShow] = useState(false);
  const onChangeText = (text: string): void => { setShouldShow(validation(text)); };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Placeholder"
        placeholderTextColor="#bdbdbd"
        {...props}
        onChangeText={onChangeText}
      />
      <Text style={styles.check}>
        {shouldShow && (
        <Text>&#10003;</Text>
        )}
      </Text>
    </View>
  );
}
