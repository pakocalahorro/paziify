import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FilterOption {
    id: string;
    label: string;
    icon: string;
    color: string;
}

interface FilterActionSheetProps {
    visible: boolean;
    onClose: () => void;
    options: FilterOption[];
    selectedId: string;
    onSelect: (id: string) => void;
    title?: string;
}

export const FilterActionSheet: React.FC<FilterActionSheetProps> = ({
    visible,
    onClose,
    options,
    selectedId,
    onSelect,
    title = "FILTRAR POR CATEGORÍA"
}) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <BlurView intensity={90} tint="dark" style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
                            {/* Handle */}
                            <View style={styles.handle} />

                            <View style={styles.header}>
                                <Text style={styles.titleText}>{title}</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                    <Ionicons name="close" size={24} color="rgba(255,255,255,0.5)" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                            >
                                {options.map((option) => {
                                    const isSelected = selectedId === option.id;
                                    return (
                                        <TouchableOpacity
                                            key={option.id}
                                            onPress={() => {
                                                onSelect(option.id);
                                                onClose();
                                            }}
                                            style={[
                                                styles.optionItem,
                                                isSelected && { backgroundColor: 'rgba(255,255,255,0.1)' }
                                            ]}
                                        >
                                            <View style={[styles.iconBox, { backgroundColor: `${option.color}20` }]}>
                                                <Ionicons name={option.icon as any} size={20} color={option.color} />
                                            </View>
                                            <Text style={[
                                                styles.optionLabel,
                                                isSelected && { color: option.color, fontWeight: '700' }
                                            ]}>
                                                {option.label}
                                            </Text>
                                            {isSelected && (
                                                <Ionicons name="checkmark-circle" size={20} color={option.color} />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </BlurView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheet: {
        backgroundColor: 'rgba(10, 14, 26, 0.8)',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 12,
        maxHeight: SCREEN_HEIGHT * 0.7,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    titleText: {
        fontFamily: 'Outfit_900Black',
        fontSize: 14,
        color: '#FFF',
        letterSpacing: 2,
    },
    closeBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 16,
        marginBottom: 8,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionLabel: {
        flex: 1,
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
    }
});
