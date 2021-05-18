import React from 'react';
import Lodash from 'lodash';
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInputFocusEventData,
  TextStyle,
} from 'react-native';
import { HelperText, TextInput, useTheme } from 'react-native-paper';

import { ICustomTextInput } from '../../types/components/CustomTextInput';

import { defaultProps, styles } from './styles';

const CustomTextInput = <T, >({
  formikHelpers, fieldName, iconColor, ...rest
} : ICustomTextInput<T>) : JSX.Element => (
  <>
    <TextInput
      onChangeText={formikHelpers.handleChange(fieldName)}
      onBlur={formikHelpers.handleBlur(fieldName) as (e: NativeSyntheticEvent<TextInputFocusEventData>) => void}
      value={formikHelpers.values[fieldName] as unknown as (string | undefined)}
      right={
        (formikHelpers.touched[fieldName] && !formikHelpers.errors[fieldName]) && (
        <TextInput.Icon
          color={
            iconColor
            || (rest.theme as ReactNativePaper.Theme)?.colors.primary
            || useTheme().colors.primary
          }
          name="check"
          style={styles.textInputIcon}
        />
        )
      }
      placeholderTextColor={styles.placeholderTextColor}
      underlineColor={styles.textInputUnderlineColor}
      {...Lodash.omit(rest, ['style', 'helperTextStyle'])}
      style={[
        styles.textInputDefaultStyles,
        rest.style as StyleProp<TextStyle>,
      ]}
    />
    <HelperText
      type="error"
      style={rest.helperTextStyle as StyleProp<TextStyle>}
      visible={Boolean(formikHelpers.touched[fieldName] && formikHelpers.errors[fieldName])}
    >
      {formikHelpers.touched[fieldName] && formikHelpers.errors[fieldName]}
    </HelperText>
  </>
  );

CustomTextInput.defaultProps = defaultProps;

export default CustomTextInput;
