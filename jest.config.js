module.exports = {
    "preset": "react-native",
    "setupFiles": [
      "./node_modules/react-native-gesture-handler/jestSetup.js"
    ],
    "transformIgnorePatterns": [
        "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"
    ],
    "transform": {
        "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
        "\\.(ts|tsx)$": "ts-jest"
    },
    "globals": {
        "ts-jest": {
        "tsconfig": "tsconfig.jest.json"
        }
    },
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "moduleNameMapper": {
      ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "babel-jest"
    },
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$"
}
