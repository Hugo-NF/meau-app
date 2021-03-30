// Package imports.
import React, { useLayoutEffect, useState } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { Formik } from 'formik';
import { TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {
  Button, Dialog, HelperText, Paragraph, Portal,
} from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

// Firebase modules.
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// User modules.
import AsyncButton from '../../components/AsyncButton';
import CustomTextInput from '../../components/CustomTextInput';

import { Theme, Values } from '../../constants';
import HeaderLayout from '../../layouts/HeaderLayout';
import FileOperations from '../../utils/FileOperations';

// Theme imports.
import { styles, styledComponents } from './styles';

// Type declarations.
type picturePath = string | null;

// Interface declarations.
interface IDialogState {
  open: boolean,
  title: string,
  message: string,
}

interface ISignUpForm {
  fullName: string,
  birthDate: Date | null,
  email: string,
  state: string,
  city: string,
  address: string,
  phoneNumber: string,
  username: string,
  password: string,
  passwordConfirmation: string,
}

// Component.
export default function Registration() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();
  const {
    BirthDateButton,
    BirthDateContainer,
    BirthDatePlaceholderText,
    BirthDateRow,
    BirthDateText,
    ButtonText,
    Container,
    FormContainer,
    IconUndertext,
    InfoText,
    PhotoContainer,
    PhotoPreview,
    PhotoSelect,
    PhotoSelectContainer,
    SectionText,
  } = styledComponents;

  const [dialog, setDialog] = useState<IDialogState>({
    open: false,
    title: '',
    message: '',
  });
  const [profilePicturePath, setProfilePicturePath] = useState<picturePath>(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);

  const initialFormValues : ISignUpForm = {
    fullName: '',
    birthDate: null,
    email: '',
    state: '',
    city: '',
    address: '',
    phoneNumber: '',
    username: '',
    password: '',
    passwordConfirmation: '',
  };

  // Layout effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimary, true);
  }, [navigation]);

  // Functions declaration.
  function dateToBrazilianString(date : Date) : string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function selectProfilePicture() : void {
    ImagePicker.launchImageLibrary({
      includeBase64: false,
      maxWidth: 2000,
      maxHeight: 2000,
      mediaType: 'photo',
    }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setProfilePicturePath(response.uri || null);
      } else if (response.errorCode) {
        setDialog({
          open: true,
          title: 'Escolha de imagem',
          message: `Ocorreu um erro ao escolher a imagem!\n\nDetalhes: ${response.errorMessage}`,
        });
      }
    });
  }

  function setDateHoursToUTCMidday(date: Date): void {
    date.setUTCHours(12, 0, 0);
  }

  async function signUp({
    fullName,
    birthDate,
    email,
    state,
    city,
    address,
    phoneNumber,
    username,
    password,
  } : ISignUpForm) : Promise<void> {
    auth().createUserWithEmailAndPassword(email, password)
      .then(async (credential) => {
        const userUID = credential.user.uid;
        let profilePicture = '';

        if (profilePicturePath != null) {
          const profilePictureFileExtension = FileOperations.fileExtension(profilePicturePath);

          profilePictureFileExtension != null
            ? profilePicture = `${uuidv4()}.${profilePictureFileExtension}`
            : profilePicture = uuidv4();

          await storage()
            .ref(Values.IMAGE_DIRECTORY)
            .child(profilePicture)
            .putFile(profilePicturePath);
        }

        if (birthDate != null) setDateHoursToUTCMidday(birthDate);

        firestore().collection('users').doc(userUID).set({
          address,
          birth_date: birthDate,
          city,
          email,
          full_name: fullName,
          phone_number: phoneNumber,
          state,
          username,
          profile_picture: profilePicture,
        });

        navigation.reset({
          index: 0,
          routes: [{ name: 'Authorized' }],
        });
      })
      .catch((e) => {
        setDialog({
          open: true,
          title: 'Cadastro',
          message: `Ocorreu um erro ao realizar seu cadastro!\n\nDetalhes: ${e}`,
        });
      });
  }

  // Component return.
  return (
    <HeaderLayout
      headerShown
      title="Cadastro Pessoal"
      headerStyles={{
        backgroundColor: Theme.elements.headerPrimary,
        maxHeight: '56px',
        height: '56px',
      }}
      leftAction={{
        hidden: false,
        actionType: 'drawer',
      }}
      rightAction={{
        hidden: true,
      }}
    >
      <Container>
        <Portal>
          <Dialog
            visible={dialog.open}
            onDismiss={() => setDialog({ ...dialog, open: false })}
          >
            <Dialog.Title>{dialog.title}</Dialog.Title>
            <Dialog.Content>
              <Paragraph>{dialog.message}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialog({ ...dialog, open: false })}>Fechar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Formik
          initialValues={initialFormValues}
          validationSchema={Yup.object().shape({
            fullName: Yup.string().required('Nome completo é obrigatório'),
            birthDate: Yup.date().nullable(),
            email: Yup.string().required('E-mail é obrigatório').email('Deve ser um e-mail válido'),
            state: Yup.string().max(2, 'Deve conter apenas 2 caracteres'),
            city: Yup.string(),
            address: Yup.string(),
            phoneNumber: Yup.string(),
            username: Yup.string().required('Usuário é obrigatório'),
            password: Yup.string().required('Senha é obrigatória')
              .min(Values.PASSWORD_MIN_LENGTH, `Deve ter pelo menos ${Values.PASSWORD_MIN_LENGTH} caracteres`),
            passwordConfirmation: Yup.string()
              .required('Confirmação de senha é obrigatória')
              .equals([Yup.ref('password')], 'Deve ser igual à senha'),
          })}
          onSubmit={(data) => signUp(data)}
        >
          {(formikHelpers) => (
            <FormContainer>
              <InfoText>
                As informações preenchidas serão divulgadas apenas para a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do processo.
              </InfoText>
              <SectionText>Informações Pessoais</SectionText>
              <CustomTextInput
                fieldName="fullName"
                formikHelpers={formikHelpers}
                placeholder="Nome completo"
                mode="flat"
                {...styles.textInput}
              />
              <BirthDateContainer>
                <BirthDateRow>
                  <TouchableOpacity onPress={() => setShowDateTimePicker(true)}>
                    <BirthDateButton>
                      <MaterialCommunityIcons
                        name="calendar"
                        size={24}
                        {...styles.icon}
                      />
                    </BirthDateButton>
                  </TouchableOpacity>
                  {formikHelpers.values.birthDate != null
                    ? (
                      <BirthDateText>
                        Data de nascimento: {
                      dateToBrazilianString(formikHelpers.values.birthDate)
                    }
                      </BirthDateText>
                    )
                    : (
                      <BirthDatePlaceholderText>
                        Data de nascimento
                      </BirthDatePlaceholderText>
                    )}
                </BirthDateRow>
              </BirthDateContainer>
              {showDateTimePicker
                && (
                <DateTimePicker
                  onChange={(_, selectedDate) => {
                    setShowDateTimePicker(false);
                    formikHelpers.setFieldValue('birthDate', selectedDate || formikHelpers.values.birthDate);
                  }}
                  value={formikHelpers.values.birthDate || new Date()}
                  display="spinner"
                  minimumDate={new Date(1900, 0)}
                  maximumDate={new Date()}
                  mode="date"
                />
                )}
              <HelperText
                type="error"
                visible={Boolean(formikHelpers.touched.birthDate && formikHelpers.errors.birthDate)}
              >
                {formikHelpers.touched.birthDate && formikHelpers.errors.birthDate}
              </HelperText>
              <CustomTextInput
                fieldName="email"
                formikHelpers={formikHelpers}
                placeholder="E-mail"
                mode="flat"
                {...styles.textInput}
              />
              <CustomTextInput
                fieldName="state"
                formikHelpers={formikHelpers}
                placeholder="Estado"
                mode="flat"
                {...styles.textInput}
              />
              <CustomTextInput
                fieldName="city"
                formikHelpers={formikHelpers}
                placeholder="Cidade"
                mode="flat"
                {...styles.textInput}
              />
              <CustomTextInput
                fieldName="address"
                formikHelpers={formikHelpers}
                placeholder="Endereço"
                mode="flat"
                {...styles.textInput}
              />
              <CustomTextInput
                fieldName="phoneNumber"
                formikHelpers={formikHelpers}
                placeholder="Telefone"
                mode="flat"
                {...styles.textInput}
              />
              <SectionText>Informações de perfil</SectionText>
              <CustomTextInput
                fieldName="username"
                formikHelpers={formikHelpers}
                placeholder="Nome de usuário"
                mode="flat"
                {...styles.textInput}
              />
              <CustomTextInput
                fieldName="password"
                formikHelpers={formikHelpers}
                placeholder="Senha"
                mode="flat"
                secureTextEntry
                {...styles.textInput}
              />
              <CustomTextInput
                fieldName="passwordConfirmation"
                formikHelpers={formikHelpers}
                placeholder="Confirmação de senha"
                mode="flat"
                secureTextEntry
                {...styles.textInput}
              />
              <SectionText>Foto de perfil</SectionText>
              {profilePicturePath == null
                ? (
                  <PhotoSelectContainer>
                    <PhotoSelect onPress={() => selectProfilePicture()}>
                      <MaterialIcons
                        name="control-point"
                        size={24}
                        {...styles.icon}
                      />
                      <IconUndertext>adicionar foto</IconUndertext>
                    </PhotoSelect>
                  </PhotoSelectContainer>
                )
                : (
                  <PhotoContainer>
                    <TouchableOpacity onPress={() => selectProfilePicture()}>
                      <PhotoPreview source={{ uri: profilePicturePath }} />
                    </TouchableOpacity>
                  </PhotoContainer>
                )}
              <View>
                <AsyncButton
                  styles={styles.asyncButton}
                  asyncAction
                  disabled={formikHelpers.isSubmitting}
                  callback={formikHelpers.handleSubmit as (values: unknown) => void}
                >
                  <ButtonText>Fazer cadastro</ButtonText>
                </AsyncButton>
              </View>
            </FormContainer>
          )}
        </Formik>
      </Container>
    </HeaderLayout>
  );
}
