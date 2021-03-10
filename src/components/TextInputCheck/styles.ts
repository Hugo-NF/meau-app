import { StyleSheet } from 'react-native';

const checkWidth = 20;
const containerWidth = 328;

export const defaultStyles = StyleSheet.create({
  container: {
    borderBottomColor: '#e6e7e8',
    borderBottomWidth: 1.8,
    width: containerWidth,
    marginBottom: 36,
    flexDirection: 'row',
  },
  textInput: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    padding: 0,
    width: containerWidth - checkWidth,
    flexGrow: 1,
  },
  check: {
    width: checkWidth,
    fontFamily: 'Roboto_400Regular',
    color: '#434343',
    paddingLeft: 5,
  },
});
