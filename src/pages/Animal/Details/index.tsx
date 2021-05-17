// Package imports.
import React, { useCallback, useState } from 'react';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import Lodash from 'lodash';
import {
  ActivityIndicator, Alert, Dimensions, ImageSourcePropType, ViewProps,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

// Service imports.
import adoptionAPI from '../../../services/adoption/api';
import animalAPI from '../../../services/animal/api';
import userAPI from '../../../services/user/api';

// Component imports.
import AsyncButton from '../../../components/AsyncButton';

// Layout import.
import HeaderLayout from '../../../layouts/HeaderLayout';

// Asset imports.
import { Images } from '../../../constants';

// Style imports.
import { styles, styledComponents } from './styles';

// Type imports.
import * as AnimalTypes from '../../../types/animal';
import * as CarouselTypes from '../../../types/carousel';
import * as RouteTypes from '../../../types/routes';

// Utils imports.
import { concatenateNames } from '../../../utils/concatenateNames';
import { formatLocation } from '../../../utils/formatTexts';

// Component export.
export default function AnimalDetails() : JSX.Element {
  // Variable declaration.
  const navigation = useNavigation();
  const animalUID = useRoute<RouteProp<RouteTypes.RouteParams, 'AnimalDetails'>>().params?.animalUID;
  const [animalAboutInformation, setAnimalAboutInformation] = useState('');
  const [
    animalAdoptionRequirementsDescription,
    setAnimalAdoptionRequirementsDescription,
  ] = useState('');
  const [animalAge, setAnimalAge] = useState('');
  const [animalCastrated, setAnimalCastrated] = useState('');
  const [animalDewormed, setAnimalDewormed] = useState('');
  const [animalDiseases, setAnimalDiseases] = useState('');
  const [animalLocation, setAnimalLocation] = useState('');
  const [animalName, setAnimalName] = useState('');
  const [animalPhotoSources, setAnimalPhotoSources] = useState<Array<ImageSourcePropType>>([]);
  const [animalSex, setAnimalSex] = useState('');
  const [animalSize, setAnimalSize] = useState('');
  const [animalSpecies, setAnimalSpecies] = useState('');
  const [
    animalTemperamentDescription, setAnimalTemperamentDescription,
  ] = useState('');
  const [animalVaccinated, setAnimalVaccinated] = useState('');
  const [floatingButton, setFloatingButton] = useState<JSX.Element>();
  const [headerLayoutStyles, setHeaderLayoutStyles] = useState(
    styles.headerLayoutHeaderSecondaryStyles,
  );
  const [imageCarouselActiveIndex, setImageCarouselActiveIndex] = useState(0);
  const [imageCarouselLength, setImageCarouselLength] = useState(0);
  const [labelStyles, setLabelStyles] = useState({});
  const [
    loadingAnimalPictures, setLoadingAnimalPictures,
  ] = useState<boolean>(true);
  const [loadingOwnerData, setLoadingOwnerData] = useState<boolean>(true);
  const [pageButtons, setPageButtons] = useState<JSX.Element>();

  const { width: viewportWidth } = Dimensions.get('window');

  // Styled components.
  const {
    AnimalImage,
    ButtonText,
    ButtonTextStrong,
    CarouselWrapper,
    CentralizedContainer,
    Container,
    FloatingButton,
    FloatingButtonWrapper,
    Label,
    LoadingContainer,
    LoadingText,
    OptionButtonsWrapper,
    RegularText,
    SectionEnd,
    SectionItem,
    SectionRow,
    TitleText,
  } = styledComponents;

  // Callback declaration.
  const determinePageBehavior = useCallback(() : void => {
    // Function declaration.
    function booleanToString(value : boolean) : string {
      if (value === true) return 'Sim';
      return 'Não';
    }

    function describeAnimalAdoptionRequirements(
      adoptionRequirements : AnimalTypes.AdoptionRequirements,
    ) : string {
      const adoptionRequirementsNames = Object.keys(adoptionRequirements)
        .filter(
          (key : string) => adoptionRequirements[key as keyof AnimalTypes.AdoptionRequirements] === true,
        )
        .map(
          (key: string) => {
            if (key === 'postAdoptionMonitoring') {
              return `${AnimalTypes.AdoptionRequirementsNames[
                key as keyof AnimalTypes.AdoptionRequirements
              ]} por ${
                adoptionRequirements.postAdoptionMonitoringPeriod
              } meses`;
            }

            return AnimalTypes.AdoptionRequirementsNames[
                key as keyof AnimalTypes.AdoptionRequirements
            ];
          },
        );

      const adoptionRequirementsDescription = concatenateNames(
        adoptionRequirementsNames,
      );

      if (adoptionRequirementsDescription !== '') return Lodash.capitalize(adoptionRequirementsDescription);
      return 'Nenhuma';
    }

    function describeAnimalTemperament(
      temperament : AnimalTypes.Temperament,
    ) : string {
      const temperamentNames = Object.keys(temperament)
        .filter(
          (key : string) => temperament[key as keyof AnimalTypes.Temperament] === true,
        )
        .map(
          (key: string) => AnimalTypes.TemperamentNames[key as keyof AnimalTypes.Temperament],
        );

      const temperamentDescription = concatenateNames(temperamentNames);

      if (temperamentDescription !== '') return Lodash.capitalize(temperamentDescription);
      return 'Não informado';
    }

    function errorAlert() : void {
      return Alert.alert(
        'Erro!',
        'Ocorreu um erro no carregamento das informações.\n'
        + 'Retornando para a página anterior.',
        [
          {
            text: 'Ok',
            onPress: () => navigation.goBack(),
          },
        ],
        {
          cancelable: false,
        },
      );
    }

    // Callback implementation.
    animalAPI.getAnimal(animalUID)
      .then(async (animal) => {
        const animalData = animal.data();
        const animalNameReceived = animalData?.name;
        const resultInterestedIn = await adoptionAPI.checkIfInterestedIn(animal.ref, userAPI.currentUserDocument());

        // Set basic animal data.
        setAnimalName(animalNameReceived);
        setAnimalAboutInformation(
          animalData?.about !== '' ? animalData?.about : 'Não informado',
        );
        setAnimalAdoptionRequirementsDescription(
          describeAnimalAdoptionRequirements(animalData?.adoptionRequirements),
        );
        setAnimalAge(AnimalTypes.AgeNames[animalData?.age as AnimalTypes.Age]);
        setAnimalCastrated(
          booleanToString(animalData?.healthCondition.castrated),
        );
        setAnimalDewormed(
          booleanToString(animalData?.healthCondition.dewormed),
        );
        setAnimalSex(AnimalTypes.SexNames[animalData?.sex as AnimalTypes.Sex]);
        setAnimalSize(
          AnimalTypes.SizeNames[animalData?.size as AnimalTypes.Size],
        );
        setAnimalSpecies(
          AnimalTypes.SpeciesNames[animalData?.species as AnimalTypes.Species],
        );
        setAnimalTemperamentDescription(
          describeAnimalTemperament(animalData?.temperament),
        );
        setAnimalVaccinated(
          booleanToString(animalData?.healthCondition.vaccinated),
        );
        setAnimalDiseases(
          animalData?.diseases !== ''
            ? animalData?.diseases
            : 'Nenhuma',
        );

        // Set page theme and animal location via owner document.
        if (animalData?.owner !== undefined) {
          userAPI.getReference(animalData?.owner)
            .then(
              (owner) => {
                const ownerID = owner.id;
                const ownerData = owner.data();

                // Set animal address data.
                setAnimalLocation(formatLocation(ownerData));

                // Configure page based on ownership of animal.
                if (ownerID === userAPI.currentUser()?.uid) {
                  setStatusBarBackgroundColor(styles.animalOwnerStatusBarColor, true);
                  setHeaderLayoutStyles(styles.headerLayoutHeaderPrimaryStyles);
                  setLabelStyles(styles.primaryLabel);

                  setPageButtons(
                    <OptionButtonsWrapper>
                      <AsyncButton
                        styles={styles.ownerOptionButton}
                        asyncAction={false}
                        callback={async () => {
                          navigation.navigate('Interested', { animalUID });
                        }}
                      >
                        <ButtonText>Ver interessados</ButtonText>
                      </AsyncButton>
                      <AsyncButton
                        styles={styles.ownerOptionButton}
                        asyncAction={false}
                        callback={() => Alert.alert(
                          'Confirmação',
                          `Deseja realmente remover ${animalNameReceived}?`,
                          [
                            {
                              text: 'Cancelar',
                              onPress: () => null,
                              style: 'cancel',
                            },
                            {
                              text: 'Confirmar',
                              onPress: () => {
                                animalAPI.deleteAnimal(animalUID).then(
                                  () => navigation.navigate('Home'),
                                );
                              },
                            },
                          ],
                          {
                            cancelable: true,
                          },
                        )}
                      >
                        <ButtonText>Remover pet</ButtonText>
                      </AsyncButton>
                    </OptionButtonsWrapper>,
                  );

                  setFloatingButton(
                    <FloatingButton>
                      <MaterialIcons
                        name="edit"
                        size={24}
                        color={styles.floatingButtonIconColor}
                      />
                    </FloatingButton>,
                  );
                } else {
                  setStatusBarBackgroundColor(styles.regularUserStatusBarColor, true);
                  setHeaderLayoutStyles(styles.headerLayoutHeaderSecondaryStyles);
                  setLabelStyles(styles.secondaryLabel);

                  setPageButtons(
                    <OptionButtonsWrapper>
                      <AsyncButton
                        styles={styles.adoptionButton}
                        asyncAction={false}
                        callback={() => {
                          Alert.alert(
                            'Aviso',
                            'Deseja continuar?',
                            [
                              {
                                text: 'Sim',
                                onPress: () => {
                                  adoptionAPI.toggleInterestToAnimal(animal.ref, userAPI.currentUserDocument());
                                  Alert.alert('Concluído', 'Operação realizada com sucesso!');
                                  navigation.navigate('AnimalFeed');
                                },
                                style: 'cancel',
                              },
                              { text: 'Não' },
                            ],
                          );
                        }}
                      >
                        <ButtonTextStrong>{ resultInterestedIn ? 'Desistir da adoção' : 'Pretendo adotar' }</ButtonTextStrong>
                      </AsyncButton>
                      <AsyncButton
                        styles={styles.adoptionButton}
                        asyncAction={false}
                        callback={() => navigation.navigate('Chat', {
                          /* eslint-disable camelcase */
                          title: owner.data()?.full_name,
                          targetUserUID: ownerID,
                        })}
                      >
                        <ButtonTextStrong>Chat</ButtonTextStrong>
                      </AsyncButton>
                    </OptionButtonsWrapper>,
                  );

                  setFloatingButton(
                    <FloatingButton>
                      <MaterialIcons
                        name="favorite-border"
                        size={24}
                        color={styles.floatingButtonIconColor}
                      />
                    </FloatingButton>,
                  );
                }

                setLoadingOwnerData(false);
              },
            )
            .catch(() => errorAlert());
        } else errorAlert();

        // Set animal pictures.
        if (animalData?.pictures.length !== 0) {
          const pictureDownloadURLSourcePromises : Array<Promise<ImageSourcePropType>> = animalData?.pictures.map(
              (pictureUID : string) => new Promise((resolve, reject) => animalAPI
                .getPictureDownloadURL(pictureUID)
                .then((pictureURL : string) => resolve(
                  { uri: pictureURL },
                ))
                .catch((err) => reject(err)))
            );

          Promise.all(pictureDownloadURLSourcePromises)
            .then(
              (picturesSourceArray) => {
                setAnimalPhotoSources(picturesSourceArray);
                setImageCarouselLength(picturesSourceArray.length);
                setLoadingAnimalPictures(false);
              },
            )
            .catch(
              () => {
                setAnimalPhotoSources(
                  [Images.AnimalPicturePlaceholder as ImageSourcePropType],
                );
                setImageCarouselLength(1);
                setLoadingAnimalPictures(false);
              },
            );
        } else {
          setAnimalPhotoSources(
            [Images.AnimalPicturePlaceholder as ImageSourcePropType],
          );
          setImageCarouselLength(1);
          setLoadingAnimalPictures(false);
        }
      })
      .catch(() => errorAlert());
  }, [animalUID, navigation]);

  // Function declaration.
  function displayAnimalImage(
    { item } : CarouselTypes.CarouselRenderItem,
  ) : JSX.Element {
    return (<AnimalImage source={item} />);
  }

  // Page effects.
  useFocusEffect(determinePageBehavior);

  // JSX returned.
  return (
    loadingOwnerData || loadingAnimalPictures
      ? (
        <LoadingContainer>
          <LoadingText>Carregando...</LoadingText>
          <ActivityIndicator
            size="large"
            color={styles.activityIndicatorColor}
          />
        </LoadingContainer>
      )
      : (
        <HeaderLayout
          headerShown
          title={animalName}
          headerStyles={headerLayoutStyles}
          leftAction={{
            hidden: false,
            actionType: 'back',
          }}
          rightAction={{
            hidden: false,
            actionType: 'share',
          }}
        >
          <Container>
            <CarouselWrapper>
              <Carousel
                data={animalPhotoSources}
                itemWidth={viewportWidth}
                renderItem={displayAnimalImage}
                onSnapToItem={(index) => setImageCarouselActiveIndex(index)}
                sliderWidth={viewportWidth}
              />
              <Pagination
                dotsLength={imageCarouselLength}
                activeDotIndex={imageCarouselActiveIndex}
                containerStyle={
                  styles.paginationStyles.container as ViewProps
                }
                dotStyle={styles.paginationStyles.dot}
                inactiveDotStyle={styles.paginationStyles.inactiveDot}
                inactiveDotOpacity={
                  styles.paginationStyles.inactiveDotOpacity
                }
                inactiveDotScale={styles.paginationStyles.inactiveDotScale}
              />
            </CarouselWrapper>
            <FloatingButtonWrapper>
              {floatingButton}
            </FloatingButtonWrapper>
            <CentralizedContainer>
              <TitleText>{animalName}</TitleText>
              <Label style={labelStyles}>Espécie</Label>
              <RegularText>{animalSpecies}</RegularText>
              <SectionRow>
                <SectionItem>
                  <Label style={labelStyles}>Sexo</Label>
                  <RegularText>{animalSex}</RegularText>
                </SectionItem>
                <SectionItem>
                  <Label style={labelStyles}>Porte</Label>
                  <RegularText>{animalSize}</RegularText>
                </SectionItem>
                <SectionItem>
                  <Label style={labelStyles}>Idade</Label>
                  <RegularText>{animalAge}</RegularText>
                </SectionItem>
              </SectionRow>
              <Label style={labelStyles}>Localização</Label>
              <RegularText>{animalLocation}</RegularText>
            </CentralizedContainer>
            <SectionEnd />
            <CentralizedContainer>
              <SectionRow>
                <SectionItem>
                  <Label style={labelStyles}>Castrado</Label>
                  <RegularText>{animalCastrated}</RegularText>
                </SectionItem>
                <SectionItem>
                  <Label style={labelStyles}>Vermifugado</Label>
                  <RegularText>{animalDewormed}</RegularText>
                </SectionItem>
              </SectionRow>
              <SectionRow>
                <SectionItem>
                  <Label style={labelStyles}>Vacinado</Label>
                  <RegularText>{animalVaccinated}</RegularText>
                </SectionItem>
                <SectionItem>
                  <Label style={labelStyles}>Doenças</Label>
                  <RegularText>{animalDiseases}</RegularText>
                </SectionItem>
              </SectionRow>
            </CentralizedContainer>
            <SectionEnd />
            <CentralizedContainer>
              <Label style={labelStyles}>Temperamento</Label>
              <RegularText>{animalTemperamentDescription}</RegularText>
            </CentralizedContainer>
            <SectionEnd />
            <CentralizedContainer>
              <Label style={labelStyles}>Exigências do doador</Label>
              <RegularText>{animalAdoptionRequirementsDescription}</RegularText>
            </CentralizedContainer>
            <SectionEnd />
            <CentralizedContainer>
              <Label style={labelStyles}>Mais sobre {animalName}</Label>
              <RegularText>{animalAboutInformation}</RegularText>
            </CentralizedContainer>
            {pageButtons}
          </Container>
        </HeaderLayout>
      )
  );
}
