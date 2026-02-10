import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, Tabs, InputNumber, Divider, Typography } from "antd";
import { MediaUploader } from "../../components/media/MediaUploader";

const { Text } = Typography;

export const MeditationSessionCreate = () => {
    const { formProps, saveButtonProps, form } = useForm();

    const handleThumbnailSuccess = (url: string) => {
        form?.setFieldValue("thumbnail_url", url);
    };

    const handleVoiceSuccess = (url: string) => {
        form?.setFieldValue("voice_url", url);
    };

    const tabItems = [
        {
            key: "1",
            label: "Contenido Básico",
            children: (
                <>
                    <Form.Item label="Título" name="title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Slogan / Descripción Corta" name="description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item label="Slug (ID Único)" name="slug" rules={[{ required: true }]} help="ej: respiracion_basica">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Categoría" name="category" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { label: 'Calma SOS', value: 'calmasos' },
                                { label: 'Meditación', value: 'meditacion' },
                                { label: 'Respiración', value: 'respiracion' },
                                { label: 'Cuentos', value: 'cuentos' },
                                { label: 'Resiliencia', value: 'resiliencia' },
                                { label: 'Rendimiento', value: 'rendimiento' },
                                { label: 'Paziify Kids', value: 'kids' },
                                { label: 'Despertar', value: 'despertar' },
                                { label: 'Mindfulness', value: 'mindfulness' },
                                { label: 'Sueño', value: 'sueno' },
                            ]}
                        />
                    </Form.Item>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item label="Duración (Minutos)" name="duration_minutes" style={{ flex: 1 }}>
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Nivel de Dificultad" name="difficulty_level" style={{ flex: 1 }}>
                            <Select
                                options={[
                                    { label: 'Principiante', value: 'principiante' },
                                    { label: 'Intermedio', value: 'intermedio' },
                                    { label: 'Avanzado', value: 'avanzado' },
                                ]}
                            />
                        </Form.Item>
                    </div>
                    <Form.Item label="Tags de Estado de Ánimo" name="mood_tags">
                        <Select mode="tags" placeholder="pánico, estrés, sueño..." />
                    </Form.Item>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item label="Premium" name="is_premium" valuePropName="checked">
                            <Checkbox>Solo para miembros Plus</Checkbox>
                        </Form.Item>
                        <Form.Item label="Es Técnica" name="is_technical" valuePropName="checked">
                            <Checkbox>Requiere guía visual técnica</Checkbox>
                        </Form.Item>
                    </div>
                </>
            )
        },
        {
            key: "2",
            label: "Configuración de Audio y Medios",
            children: (
                <>
                    <Form.Item label="Thumbnail URL" name="thumbnail_url">
                        <Input readOnly />
                    </Form.Item>
                    <MediaUploader
                        bucket="meditation-thumbnails"
                        label="Subir Miniatura"
                        onUploadSuccess={handleThumbnailSuccess}
                    />

                    <Divider />

                    <Form.Item label="Voice URL (Audio principal)" name="voice_url">
                        <Input readOnly />
                    </Form.Item>
                    <MediaUploader
                        bucket="meditation-voices"
                        label="Subir Audio de la Guía"
                        accept="audio/*"
                        onUploadSuccess={handleVoiceSuccess}
                    />

                    <Divider />

                    <Text strong>Configuración Inicial de Sonido</Text>
                    <Form.Item name={["audio_config", "defaultSoundscape"]} label="Paisaje Sonoro Inicial">
                        <Input placeholder="bird_relaxation" />
                    </Form.Item>
                </>
            )
        },
        {
            key: "3",
            label: "Respiración y Metadatos",
            children: (
                <>
                    <Text strong>Patrón de Respiración (Segundos)</Text>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <Form.Item label="Inhalar" name={["breathing_config", "inhale"]} style={{ flex: 1 }}>
                            <InputNumber min={0} defaultValue={4} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Mantener" name={["breathing_config", "hold"]} style={{ flex: 1 }}>
                            <InputNumber min={0} defaultValue={4} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Exhalar" name={["breathing_config", "exhale"]} style={{ flex: 1 }}>
                            <InputNumber min={0} defaultValue={4} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Pausa Post" name={["breathing_config", "holdPost"]} style={{ flex: 1 }}>
                            <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Divider />

                    <Text strong>Metadatos Científicos</Text>
                    <Form.Item label="Beneficios Científicos" name={["metadata", "scientific_benefits"]} style={{ marginTop: '8px' }}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Nombre del Guía" name="creator_name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Credenciales del Guía" name={["metadata", "creator_credentials"]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Habilitar Sincronización Visual" name={["metadata", "visual_sync_enabled"]} valuePropName="checked">
                        <Checkbox defaultChecked>Sincronización del Orbe de Respiración</Checkbox>
                    </Form.Item>
                </>
            )
        }
    ];

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Tabs defaultActiveKey="1" items={tabItems} />
            </Form>
        </Create>
    );
};
