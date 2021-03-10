import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { defaultStyles } from './styles';

interface ITextInputCheckProps extends TextInputProps {
  validation: (_: string) => boolean,
  containerStyle?: Record<string, unknown>,
  textInputStyle?: Record<string, unknown>,
  checkStyle?: Record<string, unknown>,
}

export default function TextInputCheck({
  containerStyle, textInputStyle, checkStyle, validation, ...props
}: ITextInputCheckProps): JSX.Element {
  const [shouldShow, setShouldShow] = useState(false);
  const onChangeText = (text: string): void => { setShouldShow(validation(text)); };

  const containerStyles = StyleSheet.compose<Record<string, unknown>>(defaultStyles.container, containerStyle);
  const textInputStyles = StyleSheet.compose<Record<string, unknown>>(defaultStyles.textInput, textInputStyle);
  const checkStyles = StyleSheet.compose<Record<string, unknown>>(defaultStyles.check, checkStyle);

  return (
    <View style={containerStyles}>
      <TextInput
        style={textInputStyles}
        placeholder="Placeholder"
        placeholderTextColor="#bdbdbd"
        {...props}
        onChangeText={onChangeText}
      />
      <Text style={checkStyles}>
        {shouldShow && (
        <Text>&#10003;</Text>
        )}
      </Text>
    </View>
  );
}

TextInputCheck.defaultProps = {
  containerStyle: {},
  textInputStyle: {},
  checkStyle: {},
};
