import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, Divider, Typography, InputNumber } from "antd";
import { MediaUploader } from "../../components/media/MediaUploader";
import {
    MEDITATION_CATEGORIES,
    PAZIIFY_GUIDES,
    TIME_OF_DAY_OPTIONS,
    DIFFICULTY_LEVELS
} from "../../constants/meditation-constants";

const { Text } = Typography;

export const MeditationSessionCreate = () => {
    const { formProps, saveButtonProps, form, onFinish } = useForm({
        resource: "meditation_sessions_content",
    });

    const handleAudioSuccess = (url: string) => {
        form?.setFieldValue("voice_url", url);
    };

    const handleThumbnailSuccess = (url: string) => {
        form?.setFieldValue("thumbnail_url", url);
    };

    const handleOnFinish = async (values: any) => {
        // Enforce Panel Admin = Supabase = App
        // Map slug to legacy_id automatically for backward compatibility or DB constraints
        const finalValues = {
            ...values,
            legacy_id: values.slug,
        };
        await onFinish(finalValues);
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
                <Form.Item label="Título" name="title" rules={[{ required: true }]}>
                    <Input placeholder="Respiración de Calma" />
                </Form.Item>
                <Form.Item label="Descripción" name="description">
                    <Input.TextArea rows={3} />
                </Form.Item>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item
                        label="Orden / Índice (Filtro NNN)"
                        name="order_index"
                        help="Ej: '082' para generar el nombre de archivo"
                    >
                        <Input placeholder="082" maxLength={3} />
                    </Form.Item>
                    <Form.Item label="Slug (ID en App)" name="slug" rules={[{ required: true }]} help="Ej: 'bosque-relajacion'">
                        <Input />
                    </Form.Item>
                </div>

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
                        <Input placeholder="gamma_waves, theta_waves..." />
                    </Form.Item>
                    <Form.Item label="Soundscape (Default)" name={['audio_config', 'defaultSoundscape']}>
                        <Input placeholder="bird_relaxation, moonlight..." />
                    </Form.Item>
                </div>

                <Form.Item label="Voice URL" name="voice_url" rules={[{ required: true }]}>
                    <Input readOnly placeholder="Upload audio below" />
                </Form.Item>
                <MediaUploader
                    bucket="meditation"
                    label="Subir Audio Principal"
                    accept="audio/*"
                    customFileName={`${form?.getFieldValue("order_index")}-${form?.getFieldValue("slug")}`}
                    onUploadSuccess={handleAudioSuccess}
                />

                <Form.Item label="Thumbnail URL" name="thumbnail_url" rules={[{ required: true }]}>
                    <Input readOnly placeholder="Upload image below" />
                </Form.Item>
                <MediaUploader
                    bucket="meditation"
                    label="Subir Miniatura"
                    customFileName={`${form?.getFieldValue("order_index")}-${form?.getFieldValue("slug")}`}
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

                <div style={{ display: 'flex', gap: '24px' }}>
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
        </Create>
    );
};
