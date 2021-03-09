import React, { useState } from 'react';
import {
  View, Text, TextInput, TextInputProps,
} from 'react-native';

import { defaultStyles } from './styles';

interface ITextInputCheckStyles {
  container?: Record<string, unknown>,
  input?: Record<string, unknown>,
  check?: Record<string, unknown>
}

interface ITextInputCheckProps extends TextInputProps {
  validation: (_: string) => boolean,
  styles?: ITextInputCheckStyles
}

export default function TextInputCheck(props: ITextInputCheckProps): JSX.Element {
  const { styles, validation } = props;
  const [shouldShow, setShouldShow] = useState(false);
  const onChangeText = (text: string): void => { setShouldShow(validation(text)); };

  return (
    <View style={{ ...(styles?.container ?? {}), ...defaultStyles.container }}>
      <TextInput
        style={{ ...(styles?.input ?? {}), ...defaultStyles.textInput }}
        placeholder="Placeholder"
        placeholderTextColor="#bdbdbd"
        {...props}
        onChangeText={onChangeText}
      />
      <Text style={{ ...(styles?.check ?? {}), ...defaultStyles.check }}>
        {shouldShow && (
        <Text>&#10003;</Text>
        )}
      </Text>
    </View>
  );
}

TextInputCheck.defaultProps = {
  styles: {
    container: {},
    input: {},
    check: {},
  },
};
