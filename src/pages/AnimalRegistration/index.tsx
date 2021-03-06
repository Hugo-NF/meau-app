// Package imports.
import React, { useLayoutEffect, useState } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { ScrollView } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';

// Style imports.
import { navigationOptions, styles, styledComponents } from './styles';

// Component imports.
import AsyncButton from '../../components/AsyncButton';
import TextInputCheck from '../../components/TextInputCheck';

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

// Component export.
export default function AnimalRegistration() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();
  const [adoptionRequirements, setAdoptionRequirements] = useState({
    housePhotos: false,
    postAdoptionMonitoring: false,
    postAdoptionMonitoringPeriod: null,
    previousAnimalVisit: false,
    signedTerm: false,
  });
  const [age, setAge] = useState(-1);
  const [healthCondition, setHealthCondition] = useState({
    castrated: false,
    dewormed: false,
    sick: false,
    vaccinated: false,
  });
  const [sex, setSex] = useState(-1);
  const [size, setSize] = useState(-1);
  const [species, setSpecies] = useState(-1);
  const [temperament, setTemperament] = useState({
    calm: false,
    lazy: false,
    loving: false,
    playful: false,
    shy: false,
    vigilant: false,
  });

  // Layout effects.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Ionicons
          name="md-arrow-back-sharp"
          onPress={() => navigation.goBack()}
          size={24}
          style={styles.headerLeftIcon}
        />
      ),
      ...navigationOptions,
    });
    setStatusBarBackgroundColor(styles.statusBarColor, false);
  }, [navigation]);

  // Functions.
  const notEmpty = (text: string) : boolean => text !== '';
  const placeholderFunction = () : null => null;

  const updatePostAdoptionMonitoring = (
    oldAdoptionRequirements : AdoptionRequirements,
    newValue : boolean,
  ) : AdoptionRequirements => {
    const newAdoptionRequirements = { ...oldAdoptionRequirements };
    newAdoptionRequirements.postAdoptionMonitoring = newValue;

    if (newValue === false) newAdoptionRequirements.postAdoptionMonitoringPeriod = null;

    return newAdoptionRequirements;
  };

  const updateStateDictValue = (
    oldStateDict : Record<string, unknown>,
    key : string,
    newValue: unknown,
  ) : Record<string, unknown> => {
    const newStateDict = { ...oldStateDict };
    newStateDict[key] = newValue;
    return newStateDict;
  };

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
    TextInputContainer,
  } = styledComponents;

  return (
    <Container>
      <ScrollView>
        <Form>
          <FormHeaderText>Adoção</FormHeaderText>
          <FormLabelText>NOME DO ANIMAL</FormLabelText>
          <TextInputContainer>
            <TextInputCheck
              validation={notEmpty}
              placeholder="Nome do animal"
            />
          </TextInputContainer>
          <FormLabelText>ESPÉCIE</FormLabelText>
          <RadioForm
            radio_props={[
              { label: 'Cachorro', value: Species.Dog },
              { label: 'Gato', value: Species.Cat },
            ]}
            initial={species}
            onPress={(value) => { setSpecies({ value }); }}
            {...styles.radioForm}
          />
          <FormLabelText>SEXO</FormLabelText>
          <RadioForm
            radio_props={[
              { label: 'Macho', value: Sex.Male },
              { label: 'Fêmea', value: Sex.Female },
            ]}
            initial={sex}
            onPress={(value) => { setSex({ value }); }}
            {...styles.radioForm}
          />
          <FormLabelText>PORTE</FormLabelText>
          <RadioForm
            radio_props={[
              { label: 'Pequeno', value: Size.Small },
              { label: 'Médio', value: Size.Medium },
              { label: 'Grande', value: Size.Big },
            ]}
            initial={size}
            onPress={(value) => { setSize({ value }); }}
            {...styles.radioForm}
          />
          <FormLabelText>IDADE</FormLabelText>
          <RadioForm
            radio_props={[
              { label: 'Filhote', value: Age.Newborn },
              { label: 'Adulto', value: Age.Adult },
              { label: 'Idoso', value: Age.Elder },
            ]}
            initial={age}
            onPress={(value) => { setAge({ value }); }}
            {...styles.radioForm}
          />
          <FormLabelText>TEMPERAMENTO</FormLabelText>
          <CheckBoxRowTop>
            <LabeledCheckBox>
              <CheckBox
                disabled={false}
                value={temperament.playful}
                onValueChange={(newValue) => setTemperament(
                  updateStateDictValue(temperament, 'playful', newValue),
                )}
                style={styles.checkbox}
              />
              <CheckBoxText>Brincalhão</CheckBoxText>
            </LabeledCheckBox>
            <LabeledCheckBox>
              <CheckBox
                disabled={false}
                value={temperament.shy}
                onValueChange={(newValue) => setTemperament(
                  updateStateDictValue(temperament, 'shy', newValue),
                )}
                style={styles.checkbox}
              />
              <CheckBoxText>Tímido</CheckBoxText>
            </LabeledCheckBox>
            <LabeledCheckBox>
              <CheckBox
                disabled={false}
                value={temperament.calm}
                onValueChange={(newValue) => setTemperament(
                  updateStateDictValue(temperament, 'calm', newValue),
                )}
                style={styles.checkbox}
              />
              <CheckBoxText>Calmo</CheckBoxText>
            </LabeledCheckBox>
          </CheckBoxRowTop>
          <CheckBoxRowBottom>
            <LabeledCheckBox>
              <CheckBox
                disabled={false}
                value={temperament.vigilant}
                onValueChange={(newValue) => setTemperament(
                  updateStateDictValue(temperament, 'vigilant', newValue),
                )}
                style={styles.checkbox}
              />
              <CheckBoxText>Guarda</CheckBoxText>
            </LabeledCheckBox>
            <LabeledCheckBox>
              <CheckBox
                disabled={false}
                value={temperament.loving}
                onValueChange={(newValue) => setTemperament(
                  updateStateDictValue(temperament, 'loving', newValue),
                )}
                style={styles.checkbox}
              />
              <CheckBoxText>Amoroso</CheckBoxText>
            </LabeledCheckBox>
            <LabeledCheckBox>
              <CheckBox
                disabled={false}
                value={temperament.lazy}
                onValueChange={(newValue) => setTemperament(
                  updateStateDictValue(temperament, 'lazy', newValue),
                )}
                style={styles.checkbox}
              />
              <CheckBoxText>Preguiçoso</CheckBoxText>
            </LabeledCheckBox>
          </CheckBoxRowBottom>
          <FormLabelText>SAÚDE</FormLabelText>
          <CheckBoxRowTop>
            <LabeledCheckBox>
              <CheckBox
                disabled={false}
                value={healthCondition.vaccinated}
                onValueChange={(newValue) => setHealthCondition(
                  updateStateDictValue(healthCondition, 'vaccinated', newValue),
                )}
                style={styles.checkbox}
              />
              <CheckBoxText>Vacinado</CheckBoxText>
            </LabeledCheckBox>
            <LabeledCheckBox>
              <CheckBox
                disabled={false}
                value={healthCondition.dewormed}
                onValueChange={(newValue) => setHealthCondition(
                  updateStateDictValue(healthCondition, 'dewormed', newValue),
                )}
                style={styles.checkbox}
              />
              <CheckBoxText>Vermifugado</CheckBoxText>
            </LabeledCheckBox>
          </CheckBoxRowTop>
          <CheckBoxRowBottom>
            <LabeledCheckBox>
              <CheckBox
                disabled={false}
                value={healthCondition.castrated}
                onValueChange={(newValue) => setHealthCondition(
                  updateStateDictValue(healthCondition, 'castrated', newValue),
                )}
                style={styles.checkbox}
              />
              <CheckBoxText>Castrado</CheckBoxText>
            </LabeledCheckBox>
            <LabeledCheckBox>
              <CheckBox
                disabled={false}
                value={healthCondition.sick}
                onValueChange={(newValue) => setHealthCondition(
                  updateStateDictValue(healthCondition, 'sick', newValue),
                )}
                style={styles.checkbox}
              />
              <CheckBoxText>Doente</CheckBoxText>
            </LabeledCheckBox>
          </CheckBoxRowBottom>
          <TextInputContainer>
            <TextInputCheck
              validation={notEmpty}
              placeholder="Doenças do animal"
            />
          </TextInputContainer>
          <FormLabelText>EXIGÊNCIAS PARA ADOÇÃO</FormLabelText>
          <SingleCheckBoxRow>
            <CheckBox
              disabled={false}
              value={adoptionRequirements.signedTerm}
              onValueChange={(newValue) => setAdoptionRequirements(
                updateStateDictValue(
                  adoptionRequirements,
                  'signedTerm',
                  newValue,
                ),
              )}
              style={styles.checkbox}
            />
            <CheckBoxText>Termo de adoção</CheckBoxText>
          </SingleCheckBoxRow>
          <SingleCheckBoxRow>
            <CheckBox
              disabled={false}
              value={adoptionRequirements.housePhotos}
              onValueChange={(newValue) => setAdoptionRequirements(
                updateStateDictValue(
                  adoptionRequirements,
                  'housePhotos',
                  newValue,
                ),
              )}
              style={styles.checkbox}
            />
            <CheckBoxText>Fotos da casa</CheckBoxText>
          </SingleCheckBoxRow>
          <SingleCheckBoxRow>
            <CheckBox
              disabled={false}
              value={adoptionRequirements.previousAnimalVisit}
              onValueChange={(newValue) => setAdoptionRequirements(
                updateStateDictValue(
                  adoptionRequirements,
                  'previousAnimalVisit',
                  newValue,
                ),
              )}
              style={styles.checkbox}
            />
            <CheckBoxText>Visita prévia ao animal</CheckBoxText>
          </SingleCheckBoxRow>
          <SingleCheckBoxRow>
            <CheckBox
              disabled={false}
              value={adoptionRequirements.postAdoptionMonitoring}
              onValueChange={(newValue) => setAdoptionRequirements(
                updatePostAdoptionMonitoring(
                  adoptionRequirements,
                  newValue,
                ),
              )}
              style={styles.checkbox}
            />
            <CheckBoxText>Acompanhamento pós adoção</CheckBoxText>
          </SingleCheckBoxRow>
          <IndentedSubsection>
            <SingleCheckBoxRow>
              <CheckBox
                disabled={!adoptionRequirements.postAdoptionMonitoring}
                value={adoptionRequirements.postAdoptionMonitoringPeriod === 1}
                onValueChange={(newValue) => setAdoptionRequirements(
                  updateStateDictValue(
                    adoptionRequirements,
                    'postAdoptionMonitoringPeriod',
                    newValue ? 1 : null,
                  ),
                )}
                style={styles.checkbox}
              />
              {
                adoptionRequirements.postAdoptionMonitoring
                  ? <CheckBoxText>1 mês</CheckBoxText>
                  : <InvalidCheckBoxText>1 mês</InvalidCheckBoxText>
              }
            </SingleCheckBoxRow>
            <SingleCheckBoxRow>
              <CheckBox
                disabled={!adoptionRequirements.postAdoptionMonitoring}
                value={adoptionRequirements.postAdoptionMonitoringPeriod === 3}
                onValueChange={(newValue) => setAdoptionRequirements(
                  updateStateDictValue(
                    adoptionRequirements,
                    'postAdoptionMonitoringPeriod',
                    newValue ? 3 : null,
                  ),
                )}
                style={styles.checkbox}
              />
              {
                adoptionRequirements.postAdoptionMonitoring
                  ? <CheckBoxText>3 meses</CheckBoxText>
                  : <InvalidCheckBoxText>3 meses</InvalidCheckBoxText>
              }
            </SingleCheckBoxRow>
            <SingleCheckBoxRow>
              <CheckBox
                disabled={!adoptionRequirements.postAdoptionMonitoring}
                value={adoptionRequirements.postAdoptionMonitoringPeriod === 6}
                onValueChange={(newValue) => setAdoptionRequirements(
                  updateStateDictValue(
                    adoptionRequirements,
                    'postAdoptionMonitoringPeriod',
                    newValue ? 6 : null,
                  ),
                )}
                style={styles.checkbox}
              />
              {
                adoptionRequirements.postAdoptionMonitoring
                  ? <CheckBoxText>6 meses</CheckBoxText>
                  : <InvalidCheckBoxText>6 meses</InvalidCheckBoxText>
              }
            </SingleCheckBoxRow>
          </IndentedSubsection>
          <FormLabelText>SOBRE O ANIMAL</FormLabelText>
          <TextInputContainer>
            <TextInputCheck
              validation={notEmpty}
              placeholder="Compartilhe a história do animal"
            />
          </TextInputContainer>
        </Form>
        <ButtonContainer>
          <AsyncButton
            styles={styles.submitButton}
            asyncAction={false}
            callback={placeholderFunction}
          >
            <ButtonText>COLOCAR PARA ADOÇÃO</ButtonText>
          </AsyncButton>
        </ButtonContainer>
      </ScrollView>
    </Container>
  );
}
