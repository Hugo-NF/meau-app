import { StyleSheet } from 'react-native';

export const defaultStyles = StyleSheet.create({
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
