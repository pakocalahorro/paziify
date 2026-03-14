import React from 'react';

interface MockProps {
    children?: React.ReactNode;
    [key: string]: any;
}

const mockComponent = (name: string) => {
    const Component = (props: MockProps) => React.createElement(name, props, props.children);
    Component.displayName = name;
    return Component;
};

// Componentes Base
export const View = mockComponent('View');
export const Text = mockComponent('Text');
export const ScrollView = mockComponent('ScrollView');
export const TouchableOpacity = mockComponent('TouchableOpacity');
export const ActivityIndicator = mockComponent('ActivityIndicator');
export const StatusBar = mockComponent('StatusBar');
export const Image = mockComponent('Image');

// Mocks de Módulos
export const NativeModules = {};
export const Platform = {
    OS: 'ios' as const,
    select: <T>(obj: { ios?: T; android?: T; default?: T }): T | undefined => obj.ios || obj.default,
};
export const StyleSheet = {
    create: <T extends Record<string, any>>(s: T): T => s,
    flatten: <T>(s: T): T => s,
    hairlineWidth: 1,
};
export const Dimensions = {
    get: (_dim: 'window' | 'screen') => ({ width: 390, height: 844, scale: 3, fontScale: 1 }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
};

// Safe Area
export const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });
export const useSafeAreaFrame = () => ({ x: 0, y: 0, width: 390, height: 844 });
export const SafeAreaProvider = ({ children }: MockProps) => children;
export const SafeAreaView = ({ children }: MockProps) => children;

// SVG
export const Svg = mockComponent('Svg');
export const Circle = mockComponent('Circle');
export const Path = mockComponent('Path');
export const Rect = mockComponent('Rect');
export const G = mockComponent('G');

// Iconos
export const Ionicons = mockComponent('Ionicons');

// Expo Blur
export const BlurView = mockComponent('BlurView');

// Linear Gradient
export const LinearGradient = mockComponent('LinearGradient');

// Navigation (Fallback)
export const useNavigation = () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => () => { }),
});
export const useRoute = () => ({ params: {} });
export const useFocusEffect = jest.fn();
export const NavigationContainer = ({ children }: MockProps) => children;

// Default export para compatibilidad con mappers
export default {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Image,
    NativeModules,
    Platform,
    StyleSheet,
    Dimensions,
    useSafeAreaInsets,
    useSafeAreaFrame,
    SafeAreaProvider,
    SafeAreaView,
    Svg,
    Circle,
    Path,
    Rect,
    G,
    Ionicons,
    BlurView,
    LinearGradient,
    useNavigation,
    useRoute,
    useFocusEffect,
    NavigationContainer,
};
