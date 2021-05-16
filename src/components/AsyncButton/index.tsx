import React, { useState } from 'react';

import { ActivityIndicator, GestureResponderEvent } from 'react-native';
import { Button } from './styles';
import { Theme } from '../../constants';
import { IButtonProps } from '../../types/components/AsyncButton';

const AsyncButton : React.FC<IButtonProps> = (props : IButtonProps) => {
  const [disabled, setDisabled] = useState(false);
  const {
    activityIndicator, asyncAction, children, callback, styles,
  } = props;

  let onPressCallback;
  if (asyncAction) {
    onPressCallback = async (event: GestureResponderEvent) => {
      setDisabled(true);
      await callback(event);
      setDisabled(false);
    };
  } else {
    onPressCallback = callback;
  }

  return (
    <Button
      onPress={onPressCallback}
      disabled={disabled}
      {...styles}
    >
      {(asyncAction && disabled) && <ActivityIndicator {...activityIndicator} />}
      {!(asyncAction && disabled) && children}
    </Button>
  );
};

AsyncButton.defaultProps = {
  activityIndicator: {
    size: 'small',
    color: Theme.default.light,
  },
  styles: {
    flexDirection: 'row',
    backgroundColor: Theme.default.primary,
    color: Theme.default.light,
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    marginRight: '0px',
    borderRadius: '0px',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default AsyncButton;
