import React from 'react';
import {
  HelperText, TextInput,
} from 'react-native-paper';

import { FormikProps } from 'formik';

interface ICustomTextInput<T> {
  formikHelpers: FormikProps<T>,
  fieldName: string,
  [propName: string]: unknown;
}

const CustomTextInput = <T, >({
  formikHelpers, fieldName, ...rest
} : ICustomTextInput<T>) : JSX.Element => (
  <>
    <TextInput
      onChangeText={formikHelpers.handleChange(fieldName)}
      onBlur={formikHelpers.handleBlur(fieldName)}
      value={formikHelpers.values[fieldName]}
      error={Boolean(formikHelpers.touched[fieldName] && formikHelpers.errors[fieldName])}
      {...rest}
    />
    <HelperText
      type="error"
      visible={Boolean(formikHelpers.touched[fieldName] && formikHelpers.errors[fieldName])}
    >
      {formikHelpers.touched[fieldName] && formikHelpers.errors[fieldName]}
    </HelperText>
  </>
  );

export default CustomTextInput;
