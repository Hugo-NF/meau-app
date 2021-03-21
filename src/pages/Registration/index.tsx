// Package imports.
import React, { useLayoutEffect, useState } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { Formik } from 'formik';
import { TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {
  Button, Dialog, HelperText, Paragraph, Portal, TextInput,
} from 'react-native-paper';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Firebase modules.
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// User modules.
import AsyncButton from '../../components/AsyncButton';
import { Theme, Values } from '../../constants';
import HeaderLayout from '../../layouts/HeaderLayout';

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

interface signUpForm {
  fullName: string,
  age: number,
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

  // Layout effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarPrimary, true);
  }, [navigation]);

  // Functions declaration.
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

  async function signUp({
    fullName,
    age,
    email,
    state,
    city,
    address,
    phoneNumber,
    username,
    password,
  } : signUpForm) : Promise<void> {
    auth().createUserWithEmailAndPassword(email, password)
      .then(async (credential) => {
        const userUID = credential.user.uid;
        let profilePictureRef = null;

        if (profilePicturePath != null) {
          profilePictureRef = `users/${userUID}/profile_picture.jpg`;

          await storage().ref(profilePictureRef).putFile(profilePicturePath);
        }

        firestore().collection('users').doc(userUID).set({
          address,
          age,
          city,
          email,
          full_name: fullName,
          phone_number: phoneNumber,
          state,
          username,
          profile_picture_ref: profilePictureRef,
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
          initialValues={{
            fullName: '',
            age: 0,
            email: '',
            state: '',
            city: '',
            address: '',
            phoneNumber: '',
            username: '',
            password: '',
            passwordConfirmation: '',
          }}
          validationSchema={Yup.object().shape({
            fullName: Yup.string().required('Nome completo é obrigatório'),
            age: Yup.number(),
            email: Yup.string().required('E-mail é obrigatório').email('Deve ser um e-mail válido'),
            state: Yup.string().max(2, 'Deve conter apenas 2 caracteres'),
            city: Yup.string(),
            address: Yup.string(),
            phoneNumber: Yup.string(),
            username: Yup.string().required('Usuário é obrigatório'),
            password: Yup.string().required('Senha é obrigatória')
              .min(Values.passwordMinLength, `Deve ter pelo menos ${Values.passwordMinLength} caracteres`),
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
              <TextInput
                placeholder="Idade"
                onChangeText={handleChange('age')}
                onBlur={handleBlur('age')}
                value={values.age}
                mode="flat"
                keyboardType="numeric"
                error={Boolean(touched.age && errors.age)}
                {...styles.textInput}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.age && errors.age)}
              >
                {touched.age && errors.age}
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
                value={values.state}
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
                value={values.city}
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
                value={values.address}
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
                value={values.phoneNumber}
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
                        {...styles.addPhotoIcon}
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
