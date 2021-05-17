// Package imports.
import React, { useCallback, useState } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { v4 as uuidv4 } from 'uuid';

import RadioForm from 'react-native-simple-radio-button';
import CheckBox from '@react-native-community/checkbox';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Style imports.
import {
  Button, Dialog, HelperText, Paragraph, Portal,
} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  FlatList, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { styles, styledComponents } from './styles';

// Layout import
import HeaderLayout from '../../../layouts/HeaderLayout';

// Service imports.
import animalAPI from '../../../services/animal/api';
import userAPI from '../../../services/user/api';

// Component imports.
import AsyncButton from '../../../components/AsyncButton';
import CustomTextInput from '../../../components/CustomTextInput';
import FileOperations from '../../../utils/FileOperations';

// Type imports.
import * as AnimalTypes from '../../../types/animal';

// Interface declarations.
interface IUploadedPicture {
  id: string,
  remoteName: string,
  localUri: string,
}

interface IDialogState {
  open: boolean,
  title: string,
  message: string,
}

// Component export.
export default function AnimalRegistration() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();
  const [animalPictures, setAnimalPictures] = useState<IUploadedPicture[]>([]);
  const [uploadLock, setUploadLock] = useState(false);
  const [dialog, setDialog] = useState<IDialogState>({
    open: false,
    title: '',
    message: '',
  });

  // Page effects.
  useFocusEffect(
    useCallback(() => {
      setStatusBarBackgroundColor(styles.statusBarColor, true);
    }, []),
  );

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

  const registerAnimal = async (data: AnimalTypes.IRegisterAnimal) : Promise<void> => {
    const userDocument = userAPI.currentUserDocument();

    animalAPI.createAnimal({
      owner: userDocument,
      pictures: animalPictures.map((p) => p.remoteName),
      ...data,
    }).then(() => {
      navigation.dispatch(StackActions.replace('AnimalRegistrationSuccess'));
    })
      .catch(() => {
        setDialog({
          open: true,
          title: 'Falha ao cadastrar animal',
          message: 'Ocorreu um erro ao tentar cadastrar animal no servidor',
        });
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
        const extension = FileOperations.fileExtension(localUri);
        if (!extension) {
          setDialog({
            open: true,
            title: 'Falha ao fazer upload',
            message: 'Falha ao obter extensão do arquivo',
          });
          return;
        }

        const pictureID = uuidv4();
        const remoteUri = `${pictureID}.${extension}`;

        setUploadLock(true);
        animalAPI.uploadAnimalPicture(remoteUri, localUri)
          .then((remoteName) => {
            setAnimalPictures(
              [...animalPictures, { id: pictureID, remoteName, localUri }],
            );
            setUploadLock(false);
          })
          .catch(() => {
            setDialog({
              open: true,
              title: 'Falha ao fazer upload',
              message: 'Falha ao enviar imagem ao servidor',
            });
          });
      } else if (response.errorCode) {
        setDialog({
          open: true,
          title: 'Falha ao fazer upload',
          message: `Erro ao carregar imagem do dispositivo: ${response.errorCode}`,
        });
      }
    });
  };

  return (
    <HeaderLayout
      headerShown
      title="Cadastro do Animal"
      headerStyles={styles.headerLayout}
      leftAction={{
        hidden: false,
        actionType: 'back',
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
        <Formik<AnimalTypes.IRegisterAnimal>
          initialValues={{
            name: '',
            species: null,
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
            species: Yup.mixed<AnimalTypes.Species | null>().notOneOf([null], 'Selecione a espécie'),
            sex: Yup.mixed<AnimalTypes.Sex | null>().notOneOf([null], 'Selecione a espécie'),
            size: Yup.mixed<AnimalTypes.Size | null>().notOneOf([null], 'Selecione o porte'),
            age: Yup.mixed<AnimalTypes.Age | null>().notOneOf([null], 'Selecione a idade'),
            adoptionRequirements: Yup.object().shape({
              postAdoptionMonitoringPeriod: Yup.mixed<number | null>().when('postAdoptionMonitoring', {
                is: true,
                then: Yup.mixed<number | null>().required('Selecione o período de acompanhamento'),
              }),
            }),
            diseases: Yup.string().when('healthCondition.sick', {
              is: true,
              then: Yup.string().required('Escreva as doenças do animal'),
              otherwise: Yup.string().length(0, 'Marque que o animal está doente para preencher'),
            }),
          })}
          onSubmit={(data) => registerAnimal(data)}
        >
          {(formikHelpers) => (
            <Form>
              <FormHeaderText>Adoção</FormHeaderText>
              <FormLabelText>NOME DO ANIMAL</FormLabelText>
              <CustomTextInput
                fieldName="name"
                formikHelpers={formikHelpers}
                label="Nome do animal"
                placeholder="Nome do animal"
                {...styles.textInput}
              />
              <FormLabelText>FOTOS DO ANIMAL</FormLabelText>
              {(animalPictures.length > 0)
                && (
                  <FlatList
                    horizontal
                    style={styles.picturesGrid}
                    data={animalPictures}
                    renderItem={(picture) => <PictureThumbnail source={{ uri: picture.item.localUri }} />}
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
                  { label: 'Cachorro', value: AnimalTypes.Species.Dog },
                  { label: 'Gato', value: AnimalTypes.Species.Cat },
                ]}
                initial={formikHelpers.values.species as number || -1}
                onPress={(value) => formikHelpers.setFieldValue('species', value)}
                {...styles.radioForm}
              />
              <HelperText
                type="error"
                visible={Boolean(formikHelpers.touched.species && formikHelpers.errors.species)}
              >
                {formikHelpers.touched.species && formikHelpers.errors.species}
              </HelperText>
              <FormLabelText>SEXO</FormLabelText>
              <RadioForm
                radio_props={[
                  { label: 'Macho', value: AnimalTypes.Sex.Male },
                  { label: 'Fêmea', value: AnimalTypes.Sex.Female },
                ]}
                initial={formikHelpers.values.sex as number || -1}
                onPress={(value) => formikHelpers.setFieldValue('sex', value)}
                {...styles.radioForm}
              />
              <HelperText
                type="error"
                visible={Boolean(formikHelpers.touched.sex && formikHelpers.errors.sex)}
              >
                {formikHelpers.touched.sex && formikHelpers.errors.sex}
              </HelperText>
              <FormLabelText>PORTE</FormLabelText>
              <RadioForm
                radio_props={[
                  { label: 'Pequeno', value: AnimalTypes.Size.Small },
                  { label: 'Médio', value: AnimalTypes.Size.Medium },
                  { label: 'Grande', value: AnimalTypes.Size.Big },
                ]}
                initial={formikHelpers.values.size as number || -1}
                onPress={(value) => formikHelpers.setFieldValue('size', value)}
                {...styles.radioForm}
              />
              <HelperText
                type="error"
                visible={Boolean(formikHelpers.touched.size && formikHelpers.errors.size)}
              >
                {formikHelpers.touched.size && formikHelpers.errors.size}
              </HelperText>
              <FormLabelText>IDADE</FormLabelText>
              <RadioForm
                radio_props={[
                  { label: 'Filhote', value: AnimalTypes.Age.Newborn },
                  { label: 'Adulto', value: AnimalTypes.Age.Adult },
                  { label: 'Idoso', value: AnimalTypes.Age.Elder },
                ]}
                initial={formikHelpers.values.age as number || -1}
                onPress={(value) => formikHelpers.setFieldValue('age', value)}
                {...styles.radioForm}
              />
              <HelperText
                type="error"
                visible={Boolean(formikHelpers.touched.age && formikHelpers.errors.age)}
              >
                {formikHelpers.touched.age && formikHelpers.errors.age}
              </HelperText>
              <FormLabelText>TEMPERAMENTO</FormLabelText>
              <CheckBoxRowTop>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={formikHelpers.values.temperament.playful}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('temperament', { ...formikHelpers.values.temperament, playful: newValue })}
                    tintColors={styles.checkboxTintColors}
                  />
                  <CheckBoxText>Brincalhão</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={formikHelpers.values.temperament.shy}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('temperament', { ...formikHelpers.values.temperament, shy: newValue })}
                    tintColors={styles.checkboxTintColors}
                  />
                  <CheckBoxText>Tímido</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={formikHelpers.values.temperament.calm}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('temperament', { ...formikHelpers.values.temperament, calm: newValue })}
                    tintColors={styles.checkboxTintColors}
                  />
                  <CheckBoxText>Calmo</CheckBoxText>
                </LabeledCheckBox>
              </CheckBoxRowTop>
              <CheckBoxRowBottom>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={formikHelpers.values.temperament.vigilant}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('temperament', { ...formikHelpers.values.temperament, vigilant: newValue })}
                    tintColors={styles.checkboxTintColors}
                  />
                  <CheckBoxText>Guarda</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={formikHelpers.values.temperament.loving}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('temperament', { ...formikHelpers.values.temperament, loving: newValue })}
                    tintColors={styles.checkboxTintColors}
                  />
                  <CheckBoxText>Amoroso</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={formikHelpers.values.temperament.lazy}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('temperament', { ...formikHelpers.values.temperament, lazy: newValue })}
                    tintColors={styles.checkboxTintColors}
                  />
                  <CheckBoxText>Preguiçoso</CheckBoxText>
                </LabeledCheckBox>
              </CheckBoxRowBottom>
              <FormLabelText>SAÚDE</FormLabelText>
              <CheckBoxRowTop>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={formikHelpers.values.healthCondition.vaccinated}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('healthCondition', { ...formikHelpers.values.healthCondition, vaccinated: newValue })}
                    tintColors={styles.checkboxTintColors}
                  />
                  <CheckBoxText>Vacinado</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={formikHelpers.values.healthCondition.dewormed}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('healthCondition', { ...formikHelpers.values.healthCondition, dewormed: newValue })}
                    tintColors={styles.checkboxTintColors}
                  />
                  <CheckBoxText>Vermifugado</CheckBoxText>
                </LabeledCheckBox>
              </CheckBoxRowTop>
              <CheckBoxRowBottom>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={formikHelpers.values.healthCondition.castrated}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('healthCondition', { ...formikHelpers.values.healthCondition, castrated: newValue })}
                    tintColors={styles.checkboxTintColors}
                  />
                  <CheckBoxText>Castrado</CheckBoxText>
                </LabeledCheckBox>
                <LabeledCheckBox>
                  <CheckBox
                    disabled={false}
                    value={formikHelpers.values.healthCondition.sick}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('healthCondition', { ...formikHelpers.values.healthCondition, sick: newValue })}
                    tintColors={styles.checkboxTintColors}
                  />
                  <CheckBoxText>Doente</CheckBoxText>
                </LabeledCheckBox>
              </CheckBoxRowBottom>
              <CustomTextInput
                fieldName="diseases"
                formikHelpers={formikHelpers}
                label="Doenças do animal"
                placeholder="Doenças do animal"
                {...styles.textInput}
              />
              <FormLabelText>EXIGÊNCIAS PARA ADOÇÃO</FormLabelText>
              <SingleCheckBoxRow>
                <CheckBox
                  disabled={false}
                  value={formikHelpers.values.adoptionRequirements.signedTerm}
                  onValueChange={(newValue) => formikHelpers.setFieldValue('adoptionRequirements', { ...formikHelpers.values.adoptionRequirements, signedTerm: newValue })}
                  tintColors={styles.checkboxTintColors}
                />
                <CheckBoxText>Termo de adoção</CheckBoxText>
              </SingleCheckBoxRow>
              <SingleCheckBoxRow>
                <CheckBox
                  disabled={false}
                  value={formikHelpers.values.adoptionRequirements.housePhotos}
                  onValueChange={(newValue) => formikHelpers.setFieldValue('adoptionRequirements', { ...formikHelpers.values.adoptionRequirements, housePhotos: newValue })}
                  tintColors={styles.checkboxTintColors}
                />
                <CheckBoxText>Fotos da casa</CheckBoxText>
              </SingleCheckBoxRow>
              <SingleCheckBoxRow>
                <CheckBox
                  disabled={false}
                  value={formikHelpers.values.adoptionRequirements.previousAnimalVisit}
                  onValueChange={(newValue) => formikHelpers.setFieldValue('adoptionRequirements', { ...formikHelpers.values.adoptionRequirements, previousAnimalVisit: newValue })}
                  tintColors={styles.checkboxTintColors}
                />
                <CheckBoxText>Visita prévia ao animal</CheckBoxText>
              </SingleCheckBoxRow>
              <SingleCheckBoxRow>
                <CheckBox
                  disabled={false}
                  value={formikHelpers.values.adoptionRequirements.postAdoptionMonitoring}
                  onValueChange={(newValue) => formikHelpers.setFieldValue('adoptionRequirements', { ...formikHelpers.values.adoptionRequirements, postAdoptionMonitoring: newValue, postAdoptionMonitoringPeriod: null })}
                  tintColors={styles.checkboxTintColors}
                />
                <CheckBoxText>Acompanhamento pós adoção</CheckBoxText>
              </SingleCheckBoxRow>
              <IndentedSubsection>
                <SingleCheckBoxRow>
                  <CheckBox
                    disabled={!formikHelpers.values.adoptionRequirements.postAdoptionMonitoring}
                    value={formikHelpers.values.adoptionRequirements.postAdoptionMonitoringPeriod === 1}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('adoptionRequirements', { ...formikHelpers.values.adoptionRequirements, postAdoptionMonitoringPeriod: newValue ? 1 : null })}
                    tintColors={{
                      ...styles.checkboxTintColors,
                      ...(!formikHelpers.values.adoptionRequirements.postAdoptionMonitoring
                        && { false: styles.checkboxTintColors.disabled }),
                    }}
                  />
                  {
                    formikHelpers.values.adoptionRequirements.postAdoptionMonitoring
                      ? <CheckBoxText>1 mês</CheckBoxText>
                      : <InvalidCheckBoxText>1 mês</InvalidCheckBoxText>
                  }
                </SingleCheckBoxRow>
                <SingleCheckBoxRow>
                  <CheckBox
                    disabled={!formikHelpers.values.adoptionRequirements.postAdoptionMonitoring}
                    value={formikHelpers.values.adoptionRequirements.postAdoptionMonitoringPeriod === 3}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('adoptionRequirements', { ...formikHelpers.values.adoptionRequirements, postAdoptionMonitoringPeriod: newValue ? 3 : null })}
                    tintColors={{
                      ...styles.checkboxTintColors,
                      ...(!formikHelpers.values.adoptionRequirements.postAdoptionMonitoring
                        && { false: styles.checkboxTintColors.disabled }),
                    }}
                  />
                  {
                    formikHelpers.values.adoptionRequirements.postAdoptionMonitoring
                      ? <CheckBoxText>3 meses</CheckBoxText>
                      : <InvalidCheckBoxText>3 meses</InvalidCheckBoxText>
                  }
                </SingleCheckBoxRow>
                <SingleCheckBoxRow>
                  <CheckBox
                    disabled={!formikHelpers.values.adoptionRequirements.postAdoptionMonitoring}
                    value={formikHelpers.values.adoptionRequirements.postAdoptionMonitoringPeriod === 6}
                    onValueChange={(newValue) => formikHelpers.setFieldValue('adoptionRequirements', { ...formikHelpers.values.adoptionRequirements, postAdoptionMonitoringPeriod: newValue ? 6 : null })}
                    tintColors={{
                      ...styles.checkboxTintColors,
                      ...(!formikHelpers.values.adoptionRequirements.postAdoptionMonitoring
                        && { false: styles.checkboxTintColors.disabled }),
                    }}
                  />
                  {
                    formikHelpers.values.adoptionRequirements.postAdoptionMonitoring
                      ? <CheckBoxText>6 meses</CheckBoxText>
                      : <InvalidCheckBoxText>6 meses</InvalidCheckBoxText>
                  }
                </SingleCheckBoxRow>
                <HelperText
                  type="error"
                  visible={Boolean(formikHelpers.touched.adoptionRequirements?.postAdoptionMonitoringPeriod && formikHelpers.errors.adoptionRequirements?.postAdoptionMonitoringPeriod)}
                >
                  {formikHelpers.touched.adoptionRequirements?.postAdoptionMonitoringPeriod && formikHelpers.errors.adoptionRequirements?.postAdoptionMonitoringPeriod}
                </HelperText>
              </IndentedSubsection>
              <FormLabelText>SOBRE O ANIMAL</FormLabelText>
              <CustomTextInput
                fieldName="about"
                formikHelpers={formikHelpers}
                dense
                label="História do animal"
                placeholder="Compartilhe a história do animal"
                {...styles.textInput}
              />
              <ButtonContainer>
                <AsyncButton
                  styles={styles.submitButton}
                  asyncAction
                  callback={formikHelpers.handleSubmit as (values: unknown) => void}
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
