# Meau App

Aplicativo para possibilitar a adoção de animais. Trabalho da disciplina Desenvolvimento de aplicativos 2020/2 da Universidade de Brasília.

## Integrantes
Nome                           | Matrícula
-----------------------------  | ----------
André Filipe Caldas Laranjeira | 16/0023777
Hugo Nascimento Fonseca        | 16/0008166
Luiz Antônio Borges Martins    | 16/0013615

## Requisitos
* Android SDK API level 21 (Android 5.0 Lollipop) ou superior
* Node.js: Instale com seu gerenciador de pacotes
* react-native-cli: `npm install -g react-native-cli`
* expo-cli: `npm install -g expo-cli`

## Scripts
* Instalação de dependências: `npm install`

* Instalação do APK em modo Debug (via ADB): `npm run android`
* Instalação do APK em modo Debug (via ADB): `npm run android-release`

* Bundler do React-Native: `npm start`
* Bundler do Expo: `npm run web`

## Variáveis de ambiente para compilação do APK
Tenha as variáveis de ambiente `ANDROID_HOME`, `ANDROID_SDK_ROOT`, `JAVA_HOME` corretamente definidas, por exemplo:
- `ANDROID_HOME = ~/Android`
- `ANDROID_SDK_ROOT = ~/Android/Sdk`
- `JAVA_HOME = /usr/lib/jvm/java-1.8.0-openjdk/`

 - É possível substituir as variáveis de ambiente `ANDROID_HOME` e `ANDROID_SDK_ROOT` declarando-as no arquivo `local.properties`.

## Compilação do APK usando o Gradle
Vá para a pasta android
`cd android`

Execute
`./gradlew assembleRelease`

 - Todos os apks são gerados dentro de android/app/build/outputs/apk/app-*.apk
