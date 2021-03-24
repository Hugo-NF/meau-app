// Package imports.
import React, { useLayoutEffect, useState } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { v4 as uuidv4 } from 'uuid';

import RadioForm from 'react-native-simple-radio-button';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Firebase modules.
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Style imports.
import { HelperText } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import {
  FlatList, ActivityIndicator, Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { styles, styledComponents } from './styles';

// Layout import
import HeaderLayout from '../../../layouts/HeaderLayout';

// Component imports.
import AsyncButton from '../../../components/AsyncButton';
import TextInputCheck from '../../../components/TextInputCheck';

import { Theme } from '../../../constants';

// Enum declarations.
enum Age {
  Newborn,
  Adult,
  Elder,
}

enum Sex {
  Male,
  Female,
}

enum Size {
  Small,
  Medium,
  Big,
}

enum Species {
  Cat,
  Dog,
}

// Type declarations.
type AdoptionRequirements = {
  housePhotos: boolean,
  postAdoptionMonitoring: boolean,
  postAdoptionMonitoringPeriod: number | null,
  previousAnimalVisit: boolean,
  signedTerm: boolean,
}

type HealthCondition = {
  castrated: boolean,
  dewormed: boolean,
  sick: boolean,
  vaccinated: boolean,
}

type Temperament = {
  calm: boolean,
  lazy: boolean,
  loving: boolean,
  playful: boolean,
  shy: boolean,
  vigilant: boolean,
}
interface ISignUp {
  name: string,
  specie: Species | null,
  sex: Sex | null,
  size: Size | null,
  age: Age | null,
  temperament: Temperament,
  healthCondition: HealthCondition,
  adoptionRequirements: AdoptionRequirements,
  diseases: string,
  about: string
}

interface IUploadedPicture {
  id: string,
  item: {localUri: string, remoteName: string}
}

// Component export.
export default function AnimalRegistration() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();
  const [animalPictures, setAnimalPictures] = useState<IUploadedPicture[]>([]);
  const [uploadLock, setUploadLock] = useState(false);

  // Layout effects.
  useLayoutEffect(() => {
    setStatusBarBackgroundColor(Theme.elements.statusBarSecondaryDark, false);
  }, [navigation]);

  // Functions.
  const notEmpty = (text: string) : boolean => text !== '';

  // Styled components.
  const {
    ButtonContainer,
    ButtonText,
    CheckBoxRowBottom,
    CheckBoxRowTop,
    CheckBoxText,
    Container,
    Form,
    FormHeaderText,
    FormLabelText,
    IndentedSubsection,
    InvalidCheckBoxText,
    LabeledCheckBox,
    SingleCheckBoxRow,
    PictureThumbnail,
    PicturesInput,
    PicturesInputInternal,
    PicturesInputText,
  } = styledComponents;

  const fileExtension = (fileName: string): (string | null) => {
    const splitted = fileName.split('.');
    if (splitted.length < 2) return null;
    return splitted[splitted.length - 1];
  };

  const signUp = async (data: ISignUp) : Promise<void> => {
    if (!auth().currentUser) {
      Alert.alert(
        'É preciso estar logado',
        'Usuário precisa estar logado para realizar o cadastro',
        [
          { text: 'Ok' },
        ],
      );
      return;
    }

    const userUID = auth().currentUser?.uid;

    firestore().collection('animals').add({
      owner: firestore().collection('users').doc(userUID),
      pictures: animalPictures.map((p) => p.item.remoteName),
      ...data,
    }).then(() => {
      navigation.navigate('AnimalRegistrationSuccess');
    });
  };

  const uploadPhoto = (): void => {
    ImagePicker.launchImageLibrary({
      includeBase64: false,
      maxWidth: 2000,
      maxHeight: 2000,
      mediaType: 'photo',
    }, (response) => {
      if (!response.didCancel && !response.errorCode && response.uri) {
        const { uri: localUri } = response;
        const extension = fileExtension(localUri);
        if (!extension) {
          Alert.alert(
            'Falha ao fazer upload',
            'Falha ao obter extensão do arquivo',
            [
              { text: 'Ok' },
            ],
          );
          return;
        }

        const remoteName = `${uuidv4()}.${extension}`;
        const remoteUri = `animals/${remoteName}`;

        setUploadLock(true);
        storage().ref(remoteUri).putFile(localUri).then(() => {
          animalPictures.push({ id: uuidv4(), item: { localUri, remoteName } });
          setAnimalPictures(animalPictures.slice());
          setUploadLock(false);
        })
          .catch(() => {
            Alert.alert(
              'Falha ao fazer upload',
              'Falha ao enviar imagem ao servidor',
              [
                { text: 'Ok' },
              ],
            );
          });
      } else if (response.errorCode) {
        Alert.alert(
          'Falha ao fazer upload',
          `Erro ao carregar imagem do dispositivo: ${response.errorCode}`,
          [
            { text: 'Ok' },
          ],
        );
      }
    });
  };

  function enumValues<T>(e: typeof T): T[] {
    return Object.keys(e).filter((k) => typeof e[k] === 'number').map((k) => e[k]);
  }

  return (
    <HeaderLayout
      headerShown
      requireAuth
      title="Cadastro do Animal"
      headerStyles={{
        backgroundColor: Theme.elements.headerSecondaryDark,
        maxHeight: '56px',
        height: '56px',
      }}
      leftAction={{
        hidden: false,
        actionType: 'back',
      }}
      rightAction={{
        hidden: true,
      }}
    >
      <Container>
        <Formik<ISignUp>
          initialValues={{
            name: '',
            specie: null,
            sex: null,
            size: null,
            age: null,
            temperament: {
              calm: false,
              lazy: false,
              loving: false,
              playful: false,
              shy: false,
              vigilant: false,
            },
            healthCondition: {
              castrated: false,
              dewormed: false,
              sick: false,
              vaccinated: false,
            },
            adoptionRequirements: {
              housePhotos: false,
              postAdoptionMonitoring: false,
              postAdoptionMonitoringPeriod: null,
              previousAnimalVisit: false,
              signedTerm: false,
            },
            diseases: '',
            about: '',
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('O nome do animal é obrigatório'),
            specie: Yup.mixed<Species>().oneOf(enumValues(Species), 'Selecione a espécie'),
            sex: Yup.mixed<Sex>().oneOf(enumValues(Sex), 'Selecione a espécie'),
            size: Yup.mixed<Size>().oneOf(enumValues(Size), 'Selecione o porte'),
            age: Yup.mixed<Age>().oneOf(enumValues(Age), 'Selecione a idade'),
          })}
          onSubmit={(data) => signUp(data)}
        >
          {({
            setFieldValue,
            handleChange,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <Form>
              <FormHeaderText>Adoção</FormHeaderText>
              <FormLabelText>NOME DO ANIMAL</FormLabelText>
              <TextInputCheck
                checkStyle={styles.textInputCheck}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.textInput}
                validation={notEmpty}
                placeholder="Nome do animal"
                onChangeText={handleChange('name')}
                value={values.name}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.name && errors.name)}
              >
                {touched.name && errors.name}
              </HelperText>
              <FormLabelText>FOTOS DO ANIMAL</FormLabelText>
              {(animalPictures.length > 0)
                && (
                  <FlatList
                    horizontal
                    style={styles.picturesGrid}
                    data={animalPictures}
                    renderItem={(picture) => <PictureThumbnail source={{ uri: picture.item.item.localUri }} />}
                  />
                )}
              <PicturesInput onPress={() => uploadPhoto()}>
                <PicturesInputInternal>
                  <MaterialIcons
                    name="control-point"
                    size={24}
                    {...styles.addPhotoIcon}
                  />
                  <PicturesInputText>adicionar fotos</PicturesInputText>
                  {uploadLock && (<ActivityIndicator size="small" color="#0000ff" />)}
                </PicturesInputInternal>
              </PicturesInput>
              <FormLabelText>ESPÉCIE</FormLabelText>
              <RadioForm
                radio_props={[
                  { label: 'Cachorro', value: Species.Dog },
                  { label: 'Gato', value: Species.Cat },
                ]}
                initial={values.specie || -1}
                onPress={(value) => setFieldValue('specie', value)}
                {...styles.radioForm}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.specie && errors.specie)}
              >
                {touched.specie && errors.specie}
              </HelperText>
              <FormLabelText>SEXO</FormLabelText>
              <RadioForm
                radio_props={[
                  { label: 'Macho', value: Sex.Male },
                  { label: 'Fêmea', value: Sex.Female },
                ]}
                initial={values.sex || -1}
                onPress={(value) => setFieldValue('sex', value)}
                {...styles.radioForm}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.sex && errors.sex)}
              >
                {touched.sex && errors.sex}
              </HelperText>
              <FormLabelText>PORTE</FormLabelText>
              <RadioForm
                radio_props={[
                  { label: 'Pequeno', value: Size.Small },
                  { label: 'Médio', value: Size.Medium },
                  { label: 'Grande', value: Size.Big },
                ]}
                initial={values.size || -1}
                onPress={(value) => setFieldValue('size', value)}
                {...styles.radioForm}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.size && errors.size)}
              >
                {touched.size && errors.size}
              </HelperText>
              <FormLabelText>IDADE</FormLabelText>
              <RadioForm
                radio_props={[
                  { label: 'Filhote', value: Age.Newborn },
                  { label: 'Adulto', value: Age.Adult },
                  { label: 'Idoso', value: Age.Elder },
                ]}
                initial={values.age || -1}
                onPress={(value) => setFieldValue('age', value)}
                {...styles.radioForm}
              />
              <HelperText
                type="error"
                visible={Boolean(touched.age && errors.age)}
              >
                {touched.age && errors.age}
              </HelperText>
              <FormLabelText>TEMPERAMENTO</FormLabelText>
              <CheckBoxRowTop>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={values.temperament.playful}
                    onValueChange={(newValue) => setFieldValue('temperament', { ...values.temperament, playful: newValue })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  <CheckBoxText>Brincalhão</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={values.temperament.shy}
                    onValueChange={(newValue) => setFieldValue('temperament', { ...values.temperament, shy: newValue })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  <CheckBoxText>Tímido</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={values.temperament.calm}
                    onValueChange={(newValue) => setFieldValue('temperament', { ...values.temperament, calm: newValue })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  <CheckBoxText>Calmo</CheckBoxText>
                </LabeledCheckBox>
              </CheckBoxRowTop>
              <CheckBoxRowBottom>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={values.temperament.vigilant}
                    onValueChange={(newValue) => setFieldValue('temperament', { ...values.temperament, vigilant: newValue })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  <CheckBoxText>Guarda</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={values.temperament.loving}
                    onValueChange={(newValue) => setFieldValue('temperament', { ...values.temperament, loving: newValue })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  <CheckBoxText>Amoroso</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={values.temperament.lazy}
                    onValueChange={(newValue) => setFieldValue('temperament', { ...values.temperament, lazy: newValue })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  <CheckBoxText>Preguiçoso</CheckBoxText>
                </LabeledCheckBox>
              </CheckBoxRowBottom>
              <FormLabelText>SAÚDE</FormLabelText>
              <CheckBoxRowTop>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={values.healthCondition.vaccinated}
                    onValueChange={(newValue) => setFieldValue('healthCondition', { ...values.healthCondition, vaccinated: newValue })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  <CheckBoxText>Vacinado</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={values.healthCondition.dewormed}
                    onValueChange={(newValue) => setFieldValue('healthCondition', { ...values.healthCondition, dewormed: newValue })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  <CheckBoxText>Vermifugado</CheckBoxText>
                </LabeledCheckBox>
              </CheckBoxRowTop>
              <CheckBoxRowBottom>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={values.healthCondition.castrated}
                    onValueChange={(newValue) => setFieldValue('healthCondition', { ...values.healthCondition, castrated: newValue })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  <CheckBoxText>Castrado</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={values.healthCondition.sick}
                    onValueChange={(newValue) => setFieldValue('healthCondition', { ...values.healthCondition, sick: newValue })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  <CheckBoxText>Doente</CheckBoxText>
                </LabeledCheckBox>
              </CheckBoxRowBottom>
              <TextInputCheck
                checkStyle={styles.textInputCheck}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.textInput}
                validation={notEmpty}
                placeholder="Doenças do animal"
                onChangeText={handleChange('diseases')}
                value={values.diseases}
              />
              <FormLabelText>EXIGÊNCIAS PARA ADOÇÃO</FormLabelText>
              <SingleCheckBoxRow>
                <CheckBox
                  disabled={false}
                  value={values.adoptionRequirements.signedTerm}
                  onValueChange={(newValue) => setFieldValue('adoptionRequirements', { ...values.adoptionRequirements, signedTerm: newValue })}
                  style={styles.checkbox}
                  tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                />
                <CheckBoxText>Termo de adoção</CheckBoxText>
              </SingleCheckBoxRow>
              <SingleCheckBoxRow>
                <CheckBox
                  disabled={false}
                  value={values.adoptionRequirements.housePhotos}
                  onValueChange={(newValue) => setFieldValue('adoptionRequirements', { ...values.adoptionRequirements, housePhotos: newValue })}
                  style={styles.checkbox}
                  tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                />
                <CheckBoxText>Fotos da casa</CheckBoxText>
              </SingleCheckBoxRow>
              <SingleCheckBoxRow>
                <CheckBox
                  disabled={false}
                  value={values.adoptionRequirements.previousAnimalVisit}
                  onValueChange={(newValue) => setFieldValue('adoptionRequirements', { ...values.adoptionRequirements, previousAnimalVisit: newValue })}
                  style={styles.checkbox}
                  tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                />
                <CheckBoxText>Visita prévia ao animal</CheckBoxText>
              </SingleCheckBoxRow>
              <SingleCheckBoxRow>
                <CheckBox
                  disabled={false}
                  value={values.adoptionRequirements.postAdoptionMonitoring}
                  onValueChange={(newValue) => setFieldValue('adoptionRequirements', { ...values.adoptionRequirements, postAdoptionMonitoring: newValue, postAdoptionMonitoringPeriod: null })}
                  style={styles.checkbox}
                  tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                />
                <CheckBoxText>Acompanhamento pós adoção</CheckBoxText>
              </SingleCheckBoxRow>
              <IndentedSubsection>
                <SingleCheckBoxRow>
                  <CheckBox
                    disabled={!values.adoptionRequirements.postAdoptionMonitoring}
                    value={values.adoptionRequirements.postAdoptionMonitoringPeriod === 1}
                    onValueChange={(newValue) => setFieldValue('adoptionRequirements', { ...values.adoptionRequirements, postAdoptionMonitoringPeriod: newValue ? 1 : null })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  {
                      values.adoptionRequirements.postAdoptionMonitoring
                        ? <CheckBoxText>1 mês</CheckBoxText>
                        : <InvalidCheckBoxText>1 mês</InvalidCheckBoxText>
                    }
                </SingleCheckBoxRow>
                <SingleCheckBoxRow>
                  <CheckBox
                    disabled={!values.adoptionRequirements.postAdoptionMonitoring}
                    value={values.adoptionRequirements.postAdoptionMonitoringPeriod === 3}
                    onValueChange={(newValue) => setFieldValue('adoptionRequirements', { ...values.adoptionRequirements, postAdoptionMonitoringPeriod: newValue ? 3 : null })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  {
                      values.adoptionRequirements.postAdoptionMonitoring
                        ? <CheckBoxText>3 meses</CheckBoxText>
                        : <InvalidCheckBoxText>3 meses</InvalidCheckBoxText>
                    }
                </SingleCheckBoxRow>
                <SingleCheckBoxRow>
                  <CheckBox
                    disabled={!values.adoptionRequirements.postAdoptionMonitoring}
                    value={values.adoptionRequirements.postAdoptionMonitoringPeriod === 6}
                    onValueChange={(newValue) => setFieldValue('adoptionRequirements', { ...values.adoptionRequirements, postAdoptionMonitoringPeriod: newValue ? 6 : null })}
                    style={styles.checkbox}
                    tintColors={{ true: Theme.elements.label, false: Theme.elements.text }}
                  />
                  {
                      values.adoptionRequirements.postAdoptionMonitoring
                        ? <CheckBoxText>6 meses</CheckBoxText>
                        : <InvalidCheckBoxText>6 meses</InvalidCheckBoxText>
                    }
                </SingleCheckBoxRow>
              </IndentedSubsection>
              <FormLabelText>SOBRE O ANIMAL</FormLabelText>
              <TextInputCheck
                checkStyle={styles.textInputCheck}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.textInput}
                validation={notEmpty}
                placeholder="Compartilhe a história do animal"
                onChangeText={handleChange('about')}
                value={values.about}
              />
              <ButtonContainer>
                <AsyncButton
                  disabled={uploadLock}
                  styles={styles.submitButton}
                  asyncAction
                  callback={handleSubmit as (values: unknown) => void}
                >
                  <ButtonText>COLOCAR PARA ADOÇÃO</ButtonText>
                </AsyncButton>
              </ButtonContainer>
            </Form>
          )}
        </Formik>
      </Container>
    </HeaderLayout>
  );
}
