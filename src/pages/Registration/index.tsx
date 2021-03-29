// Package imports.
import React, { useLayoutEffect, useState } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { Formik } from 'formik';
import { TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {
  Button, Dialog, HelperText, Paragraph, Portal, TextInput,
} from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackActions, useNavigation } from '@react-navigation/native';

// Firebase modules.
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// User modules.
import AsyncButton from '../../components/AsyncButton';
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

        navigation.dispatch(StackActions.replace('Authorized'));
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
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            isSubmitting,
            setFieldValue,
          }) => (
            <FormContainer>
              <InfoText>
                As informações preenchidas serão divulgadas apenas para a pessoa com a qual você realizar o processo de adoção e/ou apadrinhamento, após a formalização do processo.
              </InfoText>
              <SectionText>Informações Pessoais</SectionText>
              <TextInput
                placeholder="Nome completo"
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                value={values.fullName}
                mode="flat"
                error={Boolean(touched.fullName && errors.fullName)}
                {...styles.textInput}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.fullName && errors.fullName)}
              >
                {touched.fullName && errors.fullName}
              </HelperText>
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
                  {values.birthDate != null
                    ? (
                      <BirthDateText>
                        Data de nascimento: {
                      dateToBrazilianString(values.birthDate)
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
                    setFieldValue('birthDate', selectedDate || values.birthDate);
                  }}
                  value={values.birthDate || new Date()}
                  display="spinner"
                  minimumDate={new Date(1900, 0)}
                  maximumDate={new Date()}
                  mode="date"
                />
                )}
              <HelperText
                type="error"
                visible={Boolean(touched.birthDate && errors.birthDate)}
              >
                {touched.birthDate && errors.birthDate}
              </HelperText>
              <TextInput
                placeholder="E-mail"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                mode="flat"
                error={Boolean(touched.email && errors.email)}
                {...styles.textInput}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.email && errors.email)}
              >
                {touched.email && errors.email}
              </HelperText>
              <TextInput
                placeholder="Estado"
                onChangeText={handleChange('state')}
                onBlur={handleBlur('state')}
                value={values.state != null ? values.state : undefined}
                mode="flat"
                error={Boolean(touched.state && errors.state)}
                {...styles.textInput}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.state && errors.state)}
              >
                {touched.state && errors.state}
              </HelperText>
              <TextInput
                placeholder="Cidade"
                onChangeText={handleChange('city')}
                onBlur={handleBlur('city')}
                value={values.city != null ? values.city : undefined}
                mode="flat"
                error={Boolean(touched.city && errors.city)}
                {...styles.textInput}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.city && errors.city)}
              >
                {touched.city && errors.city}
              </HelperText>
              <TextInput
                placeholder="Endereço"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address != null ? values.address : undefined}
                mode="flat"
                error={Boolean(touched.address && errors.address)}
                {...styles.textInput}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.address && errors.address)}
              >
                {touched.address && errors.address}
              </HelperText>
              <TextInput
                placeholder="Telefone"
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                value={values.phoneNumber != null ? values.phoneNumber : undefined}
                mode="flat"
                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                {...styles.textInput}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.phoneNumber && errors.phoneNumber)}
              >
                {touched.phoneNumber && errors.phoneNumber}
              </HelperText>
              <SectionText>Informações de perfil</SectionText>
              <TextInput
                placeholder="Nome de usuário"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                mode="flat"
                error={Boolean(touched.username && errors.username)}
                {...styles.textInput}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.username && errors.username)}
              >
                {touched.username && errors.username}
              </HelperText>
              <TextInput
                placeholder="Senha"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                mode="flat"
                secureTextEntry
                error={Boolean(touched.password && errors.password)}
                {...styles.textInput}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.password && errors.password)}
              >
                {touched.password && errors.password}
              </HelperText>
              <TextInput
                placeholder="Confirmação de senha"
                onChangeText={handleChange('passwordConfirmation')}
                onBlur={handleBlur('passwordConfirmation')}
                value={values.passwordConfirmation}
                mode="flat"
                secureTextEntry
                error={Boolean(touched.passwordConfirmation && errors.passwordConfirmation)}
                {...styles.textInput}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.passwordConfirmation && errors.passwordConfirmation)}
              >
                {touched.passwordConfirmation && errors.passwordConfirmation}
              </HelperText>
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
                  disabled={isSubmitting}
                  callback={handleSubmit as (values: unknown) => void}
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
