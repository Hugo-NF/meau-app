// Style imports.
import { Theme } from '../../constants';

// Default Props.
export const defaultProps = {
  iconColor: undefined,
};

// Styles.
export const styles = {
  placeholderTextColor: Theme.elements.textFaded,

  textInputDefaultStyles: {
    backgroundColor: 'transparent',
    color: Theme.elements.fieldText,
    maxHeight: 58,
    paddingHorizontal: 4,
    width: 312,
  },

  textInputIcon: {
    marginBottom: -16,
    marginRight: -24,
  },

  textInputUnderlineColor: Theme.elements.textInputUnderlineColor,
};
