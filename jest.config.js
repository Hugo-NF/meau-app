module.exports = {
    "preset": "jest-expo",
    "setupFiles": ["./jest/react-navigation-setup.js"],
    "setupFilesAfterEnv": ["@testing-library/jest-native/extend-expect"],
    "transformIgnorePatterns": [
        "node_modules/(?!(jest-)?react-native|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
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
