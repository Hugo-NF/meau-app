import { ViewProps, TextProps } from 'react-native';

import styled from 'styled-components/native';
import { Theme } from '../../../constants';

// Styled components.
export const styledComponents = {
  Container: styled.View<ViewProps>`
    flex: 1;
    align-items: center;
    flex-grow: 1;
    background-color: ${Theme.elements.chatBackground};
  `,
  SendWrapper: styled.View<ViewProps>`
    background-color: ${Theme.elements.chatSendBall};
    border-radius: 100px;
    flex-direction: column;
    align-items: center;
    width: 50px;
    height: 50px;
  `,
  MessageBubble: styled.View<ViewProps>`
    background-color: ${Theme.elements.chatTextInput};
    max-width: 300px;
    padding: 15px;
    margin-top: 8px;
    border-radius: 6px;
  `,
  SelfMessageBubble: styled.View<ViewProps>`
    background-color: ${Theme.elements.chatBubleUser};
    max-width: 300px;
    padding: 15px;
    margin-top: 8px;
    border-radius: 6px;
    align-self: flex-end;
  `,
  MessageText: styled.Text<TextProps>`
    color: ${Theme.elements.chatText};
    font-family: Roboto_400Regular;
    line-height: 24px;
    font-size: 18px;
  `,
};

// Style props.
export const styles = {
  inputContainer: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    marginBottom: 16,
    borderTopWidth: 0,
  },

  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginRight: 16,
    padding: 15,
    fontFamily: 'Roboto_400Regular',
    fontSize: 18,
    color: Theme.elements.chatText,
    lineHeight: 24,
  },

  sendButtonContainer: {
    marginBottom: 4,
  },

  sendButtonWrapper: {
    backgroundColor: Theme.elements.chatSendBall,
    borderRadius: 100,
    flexDirection: 'column',
    alignItems: 'center',
    width: 50,
    height: 50,
  },

  sendButtonIcon: {
    color: Theme.elements.chatSendIcon,
    marginTop: 'auto',
    marginBottom: 'auto',
  },

  messagesContainer: {
    width: 350,
    paddingBottom: 32,
  },
};
