import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Checkbox, Select, Divider, Typography, Button, Space, message } from "antd";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { MediaUploader } from "../../components/media/MediaUploader";
import { useState } from "react";

const { Text } = Typography;

export const SoundscapeCreate = () => {
    const { form, formProps, saveButtonProps } = useForm();
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

    const playPreview = (url?: string) => {
        if (!url) {
            message.warning("No hay audio para previsualizar.");
            return;
        }
        if (currentAudio) {
            currentAudio.pause();
        }
        const audio = new Audio(url);
        audio.play().catch(e => console.error("Error previewing:", e));
        setCurrentAudio(audio);
    };

    const stopPreview = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setCurrentAudio(null);
        }
    };

    const handleAudioSuccess = (url: string) => {
        form?.setFieldValue("audio_url", url);
    };

    const handleImageSuccess = (url: string) => {
        form?.setFieldValue("image_url", url);
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} form={form} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="e.g. Relaxing Rain" />
                </Form.Item>
                <Form.Item
                    label="Slug (Unique ID)"
                    name="slug"
                    rules={[{ required: true }]}
                    help="URL identifier (e.g. relaxing_rain)"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Divider />
                <Text strong>Subida de Medios (Supabase)</Text>

                <Form.Item label="Audio URL (Supabase)" required>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Form.Item name="audio_url" noStyle rules={[{ required: true }]}>
                            <Input readOnly style={{ flex: 1 }} />
                        </Form.Item>
                        <Space>
                            <Button
                                icon={<PlayCircleOutlined />}
                                onClick={() => playPreview(form?.getFieldValue("audio_url"))}
                            />
                            <Button
                                icon={<StopOutlined />}
                                onClick={stopPreview}
                            />
                        </Space>
                    </div>
                </Form.Item>
                <MediaUploader
                    bucket="soundscapes"
                    label="Archivo de Audio"
                    accept="audio/*"
                    onUploadSuccess={handleAudioSuccess}
                />

                <Form.Item label="Image URL" name="image_url">
                    <Input readOnly placeholder="Carga una imagen abajo" />
                </Form.Item>
                <MediaUploader
                    bucket="soundscapes"
                    label="Imagen de Fondo"
                    accept="image/*"
                    onUploadSuccess={handleImageSuccess}
                />

                <Divider />

                <Form.Item
                    label="Icon (Ionicons)"
                    name="icon"
                >
                    <Input placeholder="leaf, water, etc." />
                </Form.Item>
                <Form.Item
                    label="Visual Color (Hex)"
                    name="color"
                >
                    <Input placeholder="#4a90e2" />
                </Form.Item>
                <Form.Item
                    label="Recommended For"
                    name="recommended_for"
                >
                    <Select mode="tags" placeholder="Concentración, Sueño..." />
                </Form.Item>
                <Form.Item
                    label="Is Premium"
                    name="is_premium"
                    valuePropName="checked"
                >
                    <Checkbox>Available for Plus members only</Checkbox>
                </Form.Item>
            </Form>
        </Create>
    );
};
