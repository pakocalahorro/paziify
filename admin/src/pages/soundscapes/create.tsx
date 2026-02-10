import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Checkbox, Select, Divider, Typography } from "antd";
import { MediaUploader } from "../../components/media/MediaUploader";

const { Text } = Typography;

export const SoundscapeCreate = () => {
    const { form, formProps, saveButtonProps } = useForm();

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

                <Form.Item label="Audio URL" name="audio_url" rules={[{ required: true }]}>
                    <Input readOnly placeholder="Carga un archivo MP3 abajo" />
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
                    bucket="soundscape-thumbnails"
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
