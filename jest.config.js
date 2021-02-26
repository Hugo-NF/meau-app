
module.exports = {
    "preset": "react-native",
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
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$"
}