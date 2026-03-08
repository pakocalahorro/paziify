import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, Divider, Typography, InputNumber, Button, Space, message } from "antd";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import { MediaUploader } from "../../components/media/MediaUploader";
import { useState, useMemo, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import {
    MEDITATION_CATEGORIES,
    PAZIIFY_GUIDES,
    TIME_OF_DAY_OPTIONS,
    DIFFICULTY_LEVELS,
    BINAURAL_BEATS
} from "../../constants/meditation-constants";

const { Text } = Typography;

export const MeditationSessionEdit = () => {
    const { id } = useParams();
    const location = useLocation();

    // Get return URL from query params
    const searchParams = new URLSearchParams(location.search);
    const returnTo = searchParams.get("to") || "";

    const { formProps, saveButtonProps, form, onFinish } = useForm({
        resource: "meditation_sessions_content",
        id,
        action: "edit",
        redirect: false,
        onMutationSuccess: () => {
            message.success("¡Sesión guardada con éxito en la Base de Datos!");
            const listUrl = `/meditations${returnTo}`;
            window.location.href = listUrl;
        }
    });

    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

    // Watch fields for dynamic logic
    const selectedCategory = Form.useWatch("category", form);
    const selectedSlug = Form.useWatch("slug", form);
    const selectedBinaural = Form.useWatch(["audio_config", "defaultBinaural"], form);
    const selectedSoundscape = Form.useWatch(["audio_config", "defaultSoundscape"], form);

    // Populate flat form fields from nested JSON when data loads
    useEffect(() => {
        const data = formProps.initialValues as any;
        if (data) {
            form?.setFieldsValue({
                scientific_benefits: data.metadata?.scientific_benefits,
                visual_sync: data.metadata?.visual_sync_enabled ?? false,
            });
        }
    }, [formProps.initialValues, form]);

    // Fetch Soundscapes for the selector
    const soundscapesData = useList({
        resource: "soundscapes",
        pagination: { mode: "off" }
    });

    const soundscapeOptions = useMemo(() => {
        const data = (soundscapesData as any)?.result?.data || (soundscapesData as any)?.data?.data || (soundscapesData as any)?.data;
        return (data as any[])?.map((s: any) => ({
            label: s.name,
            value: s.slug,
            audioUrl: s.audio_url
        })) || [];
    }, [soundscapesData]);

    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleAudioSuccess = (url: string, fileName?: string) => {
        form?.setFieldValue("voice_url", url);

        // Auto-slug Logic (from filename)
        const currentSlug = form?.getFieldValue("slug");
        if ((!currentSlug || currentSlug === "") && fileName) {
            const baseFileName = fileName.includes('/') ? fileName.split('/').pop() : fileName;
            const cleanSlug = baseFileName?.split('.')[0] || "";
            form?.setFieldValue("slug", cleanSlug);
            message.info(`Slug autocompletado: ${cleanSlug}`);
        }
    };

    const handleThumbnailSuccess = (url: string) => {
        form?.setFieldValue("thumbnail_url", url);
        message.info("Miniatura lista para guardar.");
    };

    const playPreview = (url?: string) => {
        if (!url) {
            message.warning("No hay audio seleccionado para previsualizar.");
            return;
        }
        if (currentAudio) {
            currentAudio.pause();
        }
        const audio = new Audio(url);
        audio.play().catch(e => console.error("Error playing preview:", e));
        setCurrentAudio(audio);
    };

    const stopPreview = () => {
        if (currentAudio) {
            currentAudio.lastChild;
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setCurrentAudio(null);
        }
    };

    const handleOnFinish = async (values: any) => {
        // IMPORTANT: Use initial values to preserve existing fields not in the form
        const currentData = (formProps.initialValues as any) || {};

        const finalValues = {
            ...values,
            legacy_id: currentData.legacy_id || values.slug,
            // Sync both flat columns AND JSONB objects for the App
            audio_config: {
                ...(currentData.audio_config || {}),
                voiceTrack: values.voice_url,
                defaultBinaural: values.audio_config?.defaultBinaural || currentData.audio_config?.defaultBinaural,
                defaultSoundscape: values.audio_config?.defaultSoundscape || currentData.audio_config?.defaultSoundscape
            },
            metadata: {
                ...(currentData.metadata || {}),
                scientific_benefits: values.scientific_benefits,
                visual_sync_enabled: values.visual_sync,
                color: values.metadata?.color || currentData.metadata?.color || "#FF9F43"
            }
        };

        // Remove ephemeral UI fields before PATCH
        delete (finalValues as any).scientific_benefits;
        delete (finalValues as any).visual_sync;

        console.log("FINAL PAYLOAD TO SUPABASE:", finalValues);

        try {
            await onFinish(finalValues);
        } catch (error) {
            console.error("CRITICAL ERROR SAVING:", error);
            message.error("Error crítico al guardar. Revisa la consola.");
        }
    };

    // Correctly get initial values for Uploader
    const initialVoiceUrl = formProps.initialValues?.voice_url;
    const initialThumbUrl = formProps.initialValues?.thumbnail_url;

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
                    <Form.Item label="Slug (ID en App)" name="slug" rules={[{ required: true }]} help="Ej: '0082-bosque-relajacion'.">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Título" name="title" rules={[{ required: true }]}>
                        <Input
                            placeholder="Respiración de Calma"
                            onChange={(e) => {
                                const currentSlug = form?.getFieldValue("slug");
                                if (!currentSlug || currentSlug === "") {
                                    form?.setFieldValue("slug", slugify(e.target.value));
                                }
                            }}
                        />
                    </Form.Item>
                </div>

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
                    <Form.Item label="Binaural (Default)">
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Form.Item name={['audio_config', 'defaultBinaural']} noStyle>
                                <Select
                                    options={[{ label: 'Ninguno (Off)', value: '' }, ...BINAURAL_BEATS]}
                                    showSearch
                                    placeholder="Selecciona ondas..."
                                    style={{ flex: 1 }}
                                />
                            </Form.Item>
                            <Space>
                                <Button
                                    icon={<PlayCircleOutlined />}
                                    onClick={() => {
                                        const found = BINAURAL_BEATS.find(b => b.value === selectedBinaural);
                                        playPreview(found?.url);
                                    }}
                                />
                                <Button
                                    icon={<StopOutlined />}
                                    onClick={stopPreview}
                                />
                            </Space>
                        </div>
                    </Form.Item>
                    <Form.Item label="Soundscape (Default)">
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Form.Item name={['audio_config', 'defaultSoundscape']} noStyle>
                                <Select
                                    options={[{ label: 'Ninguno (Off)', value: '' }, ...soundscapeOptions]}
                                    showSearch
                                    placeholder="Selecciona ambiente..."
                                    style={{ flex: 1 }}
                                />
                            </Form.Item>
                            <Space>
                                <Button
                                    icon={<PlayCircleOutlined />}
                                    onClick={() => {
                                        const found = soundscapeOptions.find(s => s.value === selectedSoundscape);
                                        playPreview(found?.audioUrl);
                                    }}
                                />
                                <Button
                                    icon={<StopOutlined />}
                                    onClick={stopPreview}
                                />
                            </Space>
                        </div>
                    </Form.Item>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <Form.Item label="Voice URL" required>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <MediaUploader
                                variant="compact"
                                bucket="meditation"
                                label="Audio"
                                accept="audio/*"
                                folder={selectedCategory}
                                customFileName={selectedSlug?.includes('/') ? selectedSlug.split('/').pop() : selectedSlug}
                                initialUrl={initialVoiceUrl}
                                onUploadSuccess={handleAudioSuccess}
                            />
                            <Form.Item name="voice_url" noStyle rules={[{ required: true }]}>
                                <Input readOnly placeholder="Upload audio..." style={{ flex: 1 }} />
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <Form.Item label="Thumbnail URL" required>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <MediaUploader
                                variant="compact"
                                bucket="meditation"
                                label="Miniatura"
                                folder={selectedCategory}
                                customFileName={selectedSlug?.includes('/') ? selectedSlug.split('/').pop() : selectedSlug}
                                initialUrl={initialThumbUrl}
                                onUploadSuccess={handleThumbnailSuccess}
                            />
                            <Form.Item name="thumbnail_url" noStyle rules={[{ required: true }]}>
                                <Input readOnly placeholder="Upload image..." style={{ flex: 1 }} />
                            </Form.Item>
                        </div>
                    </Form.Item>
                </div>

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
