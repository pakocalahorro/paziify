const React = require('react');

module.exports = {
    NavigationContainer: ({ children }: any) => children,
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
        addListener: jest.fn(() => () => { }),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
};
