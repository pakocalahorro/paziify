import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, Divider, Typography, InputNumber, Button, Space, message } from "antd";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import { MediaUploader } from "../../components/media/MediaUploader";
import { useState } from "react";
import {
    MEDITATION_CATEGORIES,
    PAZIIFY_GUIDES,
    TIME_OF_DAY_OPTIONS,
    DIFFICULTY_LEVELS,
    BINAURAL_BEATS
} from "../../constants/meditation-constants";

const { Text } = Typography;

export const MeditationSessionEdit = () => {
    const { formProps, saveButtonProps, form, onFinish } = useForm({
        resource: "meditation_sessions_content",
    });

    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

    // Watch fields for dynamic logic
    const selectedCategory = Form.useWatch("category", form);
    const selectedSlug = Form.useWatch("slug", form);

    // Fetch Soundscapes for the selector
    const soundscapesData = useList({
        resource: "soundscapes",
    });

    const soundscapeOptions = (soundscapesData as any)?.result?.data?.map((s: any) => ({
        label: s.name,
        value: s.slug,
        audioUrl: s.audio_url
    })) || [];

    const handleAudioSuccess = (url: string, fileName?: string) => {
        form?.setFieldValue("voice_url", url);

        // Auto-slug: if slug is empty, use filename (without extension)
        const currentSlug = form?.getFieldValue("slug");
        if (!currentSlug && fileName) {
            const cleanSlug = fileName.split('.')[0];
            form?.setFieldValue("slug", cleanSlug);
            message.info(`Slug autocompletado como: ${cleanSlug}`);
        }
    };

    const handleThumbnailSuccess = (url: string) => {
        form?.setFieldValue("thumbnail_url", url);
    };

    const playPreview = (url?: string) => {
        if (!url) {
            message.warning("No hay audio seleccionado para previsualizar.");
            return;
        }

        // Stop current if playing
        if (currentAudio) {
            currentAudio.pause();
        }

        const audio = new Audio(url);
        audio.play().catch(e => console.error("Error playing preview:", e));
        setCurrentAudio(audio);
    };

    const stopPreview = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setCurrentAudio(null);
        }
    };

    const handleOnFinish = async (values: any) => {
        const finalValues = {
            ...values,
            legacy_id: values.slug,
        };
        await onFinish(finalValues);
    };

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
                <Form.Item label="Slug (ID en App)" name="slug" rules={[{ required: true }]} help="Ej: '0082-bosque-relajacion'. Se autocompleta al subir el audio.">
                    <Input />
                </Form.Item>

                <Form.Item label="Título" name="title" rules={[{ required: true }]}>
                    <Input placeholder="Respiración de Calma" />
                </Form.Item>
                <Form.Item label="Descripción" name="description">
                    <Input.TextArea rows={2} />
                </Form.Item>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item label="Categoría" name="category" rules={[{ required: true }]}>
                        <Select options={MEDITATION_CATEGORIES} />
                    </Form.Item>
                    <Form.Item label="Guía (Creador)" name="creator_name" rules={[{ required: true }]}>
                        <Select options={PAZIIFY_GUIDES} />
                    </Form.Item>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <Form.Item label="Momento del Día" name="time_of_day">
                        <Select options={TIME_OF_DAY_OPTIONS} />
                    </Form.Item>
                    <Form.Item label="Dificultad" name="difficulty_level">
                        <Select options={DIFFICULTY_LEVELS} />
                    </Form.Item>
                    <Form.Item label="Duración (minutos)" name="duration_minutes">
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                </div>

                <Divider>Configuración Técnica & Audio</Divider>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item label="Binaural (Default)" name={['audio_config', 'defaultBinaural']}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Select
                                options={BINAURAL_BEATS}
                                showSearch
                                placeholder="Selecciona ondas..."
                                style={{ flex: 1 }}
                                onChange={(val) => {
                                    const audio = BINAURAL_BEATS.find(b => b.value === val);
                                    if (audio) (window as any)._previewBinauralUrl = audio.url;
                                }}
                            />
                            <Space>
                                <Button
                                    icon={<PlayCircleOutlined />}
                                    onClick={() => playPreview((window as any)._previewBinauralUrl)}
                                    title="Reproducir binaural"
                                />
                                <Button
                                    icon={<StopOutlined />}
                                    onClick={stopPreview}
                                    title="Detener"
                                />
                            </Space>
                        </div>
                    </Form.Item>
                    <Form.Item label="Soundscape (Default)" name={['audio_config', 'defaultSoundscape']}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Select
                                options={soundscapeOptions}
                                showSearch
                                placeholder="Selecciona ambiente..."
                                style={{ flex: 1 }}
                                onChange={(val) => {
                                    const sound = soundscapeOptions.find((o: any) => o.value === val);
                                    if (sound) (window as any)._previewSoundscapeUrl = sound.audioUrl;
                                }}
                            />
                            <Space>
                                <Button
                                    icon={<PlayCircleOutlined />}
                                    onClick={() => playPreview((window as any)._previewSoundscapeUrl)}
                                    title="Reproducir ambiente"
                                />
                                <Button
                                    icon={<StopOutlined />}
                                    onClick={stopPreview}
                                    title="Detener"
                                />
                            </Space>
                        </div>
                    </Form.Item>
                </div>

                <Form.Item label="Voice URL" name="voice_url" rules={[{ required: true }]}>
                    <Input readOnly placeholder="Upload audio below" />
                </Form.Item>
                <MediaUploader
                    bucket="meditation"
                    label="Subir Audio Principal"
                    accept="audio/*"
                    folder={selectedCategory}
                    customFileName={selectedSlug}
                    initialUrl={form?.getFieldValue("voice_url")}
                    onUploadSuccess={handleAudioSuccess}
                />

                <Form.Item label="Thumbnail URL" name="thumbnail_url" rules={[{ required: true }]}>
                    <Input readOnly placeholder="Upload image below" />
                </Form.Item>
                <MediaUploader
                    bucket="meditation"
                    label="Subir Miniatura"
                    folder={selectedCategory}
                    customFileName={selectedSlug}
                    initialUrl={form?.getFieldValue("thumbnail_url")}
                    onUploadSuccess={handleThumbnailSuccess}
                />

                <Divider>Respiración & Metadatos</Divider>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                    <Form.Item label="Inhale" name={['breathing_config', 'inhale']}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Hold" name={['breathing_config', 'hold']}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Exhale" name={['breathing_config', 'exhale']}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Hold Post" name={['breathing_config', 'holdPost']}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                <Form.Item label="Beneficios Científicos" name="scientific_benefits">
                    <Input.TextArea rows={2} />
                </Form.Item>

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <Form.Item label="Es Premium" name="is_premium" valuePropName="checked">
                        <Checkbox>Available for Plus members only</Checkbox>
                    </Form.Item>
                    <Form.Item label="Visual Sync" name="visual_sync" valuePropName="checked">
                        <Checkbox>Show titles & breath orb</Checkbox>
                    </Form.Item>
                    <Form.Item label="Technical Tutorial" name="is_technical" valuePropName="checked">
                        <Checkbox>Mark as breathing tutorial</Checkbox>
                    </Form.Item>
                </div>
            </Form>
        </Edit>
    );
};
