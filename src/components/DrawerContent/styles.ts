import { TouchableOpacityProps, TextProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

import { Theme } from '../../constants';

export const styledComponents = {
  DrawerContainer: styled.View<ViewProps>`
    flex: 1;
    background-color: ${Theme.elements.drawerBackground};
    justify-content: space-between;
  `,

  // height: Photo radius + marginTop + marginBottom
  AvatarContainer: styled.View<ViewProps>`
    height: 152px;
    background-color: ${Theme.default.primary};
    elevation: 3;
    flex-direction: row;
  `,

  AvatarLeftContainer: styled.View<ViewProps>`
    flex: 1;
  `,

  AvatarRightContainer: styled.View<ViewProps>`
    align-items: center;
    flex-direction: row;
    padding-right: 30px;
  `,

  NotificationCounter: styled.Text<TextProps>`
    background-color: ${Theme.elements.notificationCounter};
    text-align: center;
    border-radius: 15px;
  `,

  LogoutButton: styled.TouchableOpacity<TouchableOpacityProps>`
    flex: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
    max-height: 48px;
    background-color: ${Theme.default.primary};
  `,

  LogoutText: styled.Text<TextProps>`
    font-family: 'Roboto_400Medium';
    font-size: 14px;
    text-transform: uppercase;
    color: ${Theme.elements.textDark};
  `,
};

export const styles = {
  Avatar: {
    marginTop: 40,
    marginLeft: 16,
    marginBottom: 48,
  },
  SpacedListSection: { width: '100%' },
  ListSection: { width: '100%', marginVertical: 0 },
  SectionTitle: {
    fontFamily: 'Roboto_400Medium',
    fontSize: 14,
    color: Theme.elements.textDark,
  },
  ListItemText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Theme.elements.textDark,
  },
  ListItemTextDisabled: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Theme.elements.buttonTextDisabled,
  },
  ListAccordion: {
    paddingVertical: 0,
  },
  ListMainAccordion: {
    elevation: 3,
  },

  iconColor: Theme.elements.icon,
  settingsDrawerDefaultBackground: Theme.elements.settingsDrawerDefaultBackground,
  settingsDrawerPrimaryBackground: Theme.elements.settingsDrawerPrimaryBackground,
  settingsDrawerPrimaryLightBackground: Theme.elements.settingsDrawerPrimaryLightBackground,
  settingsDrawerSecondaryLightBackground: Theme.elements.settingsDrawerSecondaryLightBackground,
  userInitialsBackgrond: Theme.default.background,
};
