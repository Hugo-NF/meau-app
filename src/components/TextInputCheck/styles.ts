import { StyleSheet } from 'react-native';

import { Theme } from '../../constants';

const checkWidth = 24;
const containerWidth = 328;

export const defaultStyles = StyleSheet.create({
  container: {
    borderBottomColor: '#e6e7e8',
    borderBottomWidth: 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
    width: containerWidth,
  },
  textInput: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    padding: 0,
    paddingLeft: 2,
    width: containerWidth - checkWidth,
    flexGrow: 1,
  },
  check: {
    color: Theme.elements.checkPrimary,
    marginBottom: -4,
    width: checkWidth,
  },
});
