import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions
} from 'react-native';
import SessionCard from './SessionCard';
import { Session } from '../types';

interface Props {
    title: string;
    sessions: Session[];
    onSessionPress: (session: Session) => void;
    isPlusMember: boolean;
    scrollY: any; // For animation if needed
}

const { width } = Dimensions.get('window');

const CategoryRow: React.FC<Props> = ({ title, sessions, onSessionPress, isPlusMember, scrollY }) => {
    if (sessions.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.seeAll}>Ver más</Text>
            </View>
            <FlatList
                horizontal
                data={sessions}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                snapToAlignment="start"
                decelerationRate="fast"
                snapToInterval={width * 0.75 + 16}
                renderItem={({ item, index }) => (
                    <View style={styles.cardWrapper}>
                        <SessionCard
                            session={item}
                            onPress={onSessionPress}
                            isPlusMember={isPlusMember}
                            scrollY={scrollY}
                            index={index}
                        />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 28,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    seeAll: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2DD4BF',
        opacity: 0.8,
    },
    listContent: {
        paddingLeft: 20,
        paddingRight: 10,
    },
    cardWrapper: {
        width: width * 0.75,
        marginRight: 16,
    },
});

export default CategoryRow;
