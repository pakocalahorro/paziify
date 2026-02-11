import React from 'react';
import { View, StyleSheet } from 'react-native';

interface BentoGridProps {
    children: React.ReactNode;
}

const BentoGrid: React.FC<BentoGridProps> = ({ children }) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12, // Gap supported in newer RN versions, otherwise use margins in cards
    },
});

export default BentoGrid;
