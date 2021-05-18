import { FormikProps } from 'formik';

export interface ICustomTextInput<T> {
  formikHelpers: FormikProps<T>,
  fieldName: keyof T,
  iconColor: string,
  [propName: string]: unknown;
}
