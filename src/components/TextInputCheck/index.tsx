import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { defaultStyles } from './styles';

interface ITextInputCheckProps extends TextInputProps {
  validation: (_: string) => boolean,
  containerStyle?: Record<string, unknown>,
  textInputStyle?: Record<string, unknown>,
  checkEnabled?: boolean,
  checkSize?: number,
  checkStyle?: Record<string, unknown>,
}

export default function TextInputCheck({
  containerStyle,
  textInputStyle,
  checkEnabled,
  checkSize,
  checkStyle,
  validation,
  ...props
}: ITextInputCheckProps): JSX.Element {
  const [shouldShowCheck, setShouldShowCheck] = useState(false);
  const onChangeText = (text: string): void => { setShouldShowCheck(validation(text)); };

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
      {checkEnabled && shouldShowCheck && (
        <MaterialCommunityIcons name="check" size={checkSize} style={checkStyles} />
      )}
    </View>
  );
}

TextInputCheck.defaultProps = {
  containerStyle: {},
  textInputStyle: {},
  checkEnabled: true,
  checkSize: 24,
  checkStyle: {},
};
