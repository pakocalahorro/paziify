module.exports = {
    testEnvironment: 'node', // Para snapshots básicos de árbol React
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '^react-native$': '<rootDir>/src/__tests__/mocks/react-native.mock.ts',
        '^@react-navigation/(.*)$': '<rootDir>/src/__tests__/mocks/navigation.mock.ts',
        '^expo$': '<rootDir>/src/__tests__/mocks/react-native.mock.ts',
        '^expo-(.*)$': '<rootDir>/src/__tests__/mocks/react-native.mock.ts',
        '^@expo/(.*)$': '<rootDir>/src/__tests__/mocks/react-native.mock.ts',
        '^react-native-safe-area-context$': '<rootDir>/src/__tests__/mocks/react-native.mock.ts',
        'react-native-reanimated': '<rootDir>/src/__tests__/mocks/react-native.mock.ts',
        '^@react-native-async-storage/async-storage$': '<rootDir>/src/__tests__/mocks/asyncStorage.mock.ts',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|unimodules|@supabase)',
    ],
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testMatch: ['**/__tests__/**/*.test.tsx'],
};
