# Meau App

Aplicativo para possibilitar a adoção de animais. Trabalho da disciplina Desenvolvimento de aplicativos 2020/2 da Universidade de Brasília.

## Integrantes

Nome                           | Matrícula
-----------------------------  | ----------
André Filipe Caldas Laranjeira | 16/0023777
Hugo Nascimento Fonseca        | 16/0008166
Luiz Antônio Borges Martins    | 16/0013615

## Requisitos
* Android SDK versão 24 (Android 7.0 Nougat)
* nodejs: Instale com seu gerenciador de pacotes
* react-native-cli: `npm install -g react-native-cli`
* expo-cli: `npm install -g expo-cli`

## Rodar sem firulas
Se estiver rodando pela primeira vez: 
`npn install`

Depois execute
`expo start`

## Configurar ambiente para gerar apk
Tenha as variáveis de ambiente `ANDROID_HOME`, `ANDROID_SDK_ROOT`, `JAVA_HOME` corretamente definidas, por exemplo:
`ANDROID_HOME = ~/Android`
`ANDROID_SDK_ROOT = ~/Android/Sdk`
`JAVA_HOME = /usr/lib/jvm/java-1.8.0-openjdk/`
## Instruções para gerar apk

Execute
`npn start`

Em outro terminal na raiz do projeto
`react-native link`

Vá para a pasta android
`cd android`

Execute
`./gradlew assembleRelease`