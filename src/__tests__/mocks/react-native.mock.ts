const React = require('react');

const mockComponent = (name) => {
    const Component = (props) => React.createElement(name, props, props.children);
    Component.displayName = name;
    return Component;
};

// Componentes Base
const View = mockComponent('View');
const Text = mockComponent('Text');
const ScrollView = mockComponent('ScrollView');
const TouchableOpacity = mockComponent('TouchableOpacity');
const ActivityIndicator = mockComponent('ActivityIndicator');
const StatusBar = mockComponent('StatusBar');
const Image = mockComponent('Image');

// Mocks de Módulos
const mockModules = {
    // React Native
    NativeModules: {},
    Platform: {
        OS: 'ios',
        select: (obj) => obj.ios || obj.default,
    },
    StyleSheet: {
        create: (s) => s,
        flatten: (s) => s,
        hairlineWidth: 1,
    },
    Dimensions: {
        get: () => ({ width: 390, height: 844, scale: 3, fontScale: 1 }),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    },

    // Safe Area
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,

    // SVG
    Svg: mockComponent('Svg'),
    Circle: mockComponent('Circle'),
    Path: mockComponent('Path'),
    Rect: mockComponent('Rect'),
    G: mockComponent('G'),

    // Iconos
    Ionicons: mockComponent('Ionicons'),

    // Expo Blur
    BlurView: mockComponent('BlurView'),

    // Linear Gradient
    LinearGradient: mockComponent('LinearGradient'),

    // Navigation (Fallback)
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        setOptions: jest.fn(),
        addListener: jest.fn(() => () => { }),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    NavigationContainer: ({ children }) => children,
};

module.exports = {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Image,
    ...mockModules,
    // Re-exports comunes para mappers
    default: {
        ...mockModules,
    }
};
