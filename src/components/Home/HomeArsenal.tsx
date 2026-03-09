import React from 'react';
import { View } from 'react-native';
import SoundwaveSeparator from '../Shared/SoundwaveSeparator';
import { OasisCard } from '../Oasis/OasisCard';
import { Screen } from '../../types';
import { theme } from '../../constants/theme';

interface HomeArsenalProps {
    recommendations: any;
    navigation: any;
    visualMode: 'healing' | 'growth';
}

export const HomeArsenal: React.FC<HomeArsenalProps> = ({ recommendations, navigation, visualMode }) => {
    return (
        <View style={{ paddingBottom: 40, width: '100%' }}>
            <SoundwaveSeparator
                title="Consejos del día"
                accentColor={visualMode === 'healing' ? '#8B5CF6' : '#2DD4BF'}
            />

            <View style={{ paddingHorizontal: 20 }}>
                <View style={{ marginBottom: 24 }}>
                    <OasisCard
                        superTitle="Academia"
                        title={recommendations?.academy?.title || "Manejo del Estrés"}
                        subtitle={recommendations?.academy?.description || "Aprende herramientas cognitivas."}
                        imageUri={(recommendations?.academy as any)?.image || "https://images.unsplash.com/photo-1434031211b08-39916fcad442?w=800"}
                        onPress={() => recommendations?.academy && navigation.navigate(Screen.ACADEMY_COURSE_DETAIL, {
                            courseId: recommendations?.academy?.id || '',
                            courseData: recommendations?.academy
                        })}
                        badgeText="CURSO"
                        variant="default"
                        accentColor="#A855F7"
                        actionText="Ver"
                        actionIcon="school"
                    />
                </View>

                <View style={{ marginBottom: 24 }}>
                    <OasisCard
                        superTitle="Audiolibro"
                        title={recommendations?.audiobook?.title || "El poder del Ahora"}
                        subtitle={recommendations?.audiobook?.author || "Eckhart Tolle"}
                        imageUri={(recommendations?.audiobook as any)?.image_url || 'https://paziify.app/placeholder-audiobook.jpg'}
                        onPress={() => recommendations?.audiobook && navigation.navigate(Screen.AUDIOBOOK_PLAYER, {
                            audiobookId: recommendations?.audiobook?.id || '',
                            audiobook: recommendations?.audiobook
                        })}
                        badgeText="AUDIOLIBRO"
                        duration={(recommendations?.audiobook as any)?.duration_minutes ? `${(recommendations?.audiobook as any).duration_minutes} min` : undefined}
                        variant="default"
                        accentColor={theme.colors.primary}
                        actionText="Oír"
                        actionIcon="headset"
                    />
                </View>

                <View style={{ marginBottom: 24 }}>
                    <OasisCard
                        superTitle="Relato"
                        title={recommendations?.stories?.title || "Elías y el Mar"}
                        subtitle={"Una historia real de superación personal."}
                        imageUri="https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/background/true_stories_background.webp"
                        onPress={() => recommendations?.stories && navigation.navigate(Screen.STORY_DETAIL, {
                            storyId: recommendations?.stories?.id || '',
                            story: recommendations?.stories
                        })}
                        badgeText="RELATO"
                        duration={(recommendations?.stories as any)?.reading_time_minutes ? `${(recommendations?.stories as any).reading_time_minutes} min` : undefined}
                        variant="default"
                        accentColor="#38BDF8"
                        actionText="Leer"
                        actionIcon="book"
                    />
                </View>

                <View style={{ marginBottom: 16 }}>
                    <OasisCard
                        superTitle="Música ambiente"
                        title={recommendations?.sounds?.title || "Frecuencia de Sanación"}
                        subtitle="Sonidos inmersivos para tu práctica."
                        imageUri={recommendations?.sounds?.image_url || recommendations?.sounds?.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500"}
                        onPress={() => recommendations?.sounds && navigation.navigate(Screen.BACKGROUND_PLAYER, {
                            soundscapeId: recommendations.sounds.id,
                            soundscape: recommendations.sounds
                        })}
                        badgeText="SONIDO"
                        variant="default"
                        accentColor="#10B981"
                        actionText="Oír"
                        actionIcon="musical-notes"
                    />
                </View>
            </View>
        </View>
    );
};
