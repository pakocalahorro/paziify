import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Checkbox, Select, Divider, Typography } from "antd";
import { MediaUploader } from "../../components/media/MediaUploader";

const { Text } = Typography;

export const SoundscapeEdit = () => {
    const { form, formProps, saveButtonProps } = useForm();

    const handleAudioSuccess = (url: string) => {
        form?.setFieldValue("audio_url", url);
    };

    const handleImageSuccess = (url: string) => {
        form?.setFieldValue("image_url", url);
    };

    const initialAudioUrl = formProps.initialValues?.audio_url;
    const initialImageUrl = formProps.initialValues?.image_url;

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} form={form} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Slug (Unique ID)"
                    name="slug"
                    rules={[{ required: true }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Divider />
                <Text strong>Archivos de Medios</Text>

                <Form.Item label="Audio URL (Supabase)" name="audio_url" rules={[{ required: true }]}>
                    <Input readOnly />
                </Form.Item>
                <MediaUploader
                    bucket="soundscapes"
                    label="Cargar Audio (MP3)"
                    accept="audio/*"
                    initialUrl={initialAudioUrl}
                    onUploadSuccess={handleAudioSuccess}
                />

                <Form.Item label="Image URL (Supabase)" name="image_url">
                    <Input readOnly />
                </Form.Item>
                <MediaUploader
                    bucket="soundscape-thumbnails"
                    label="Cargar Imagen de Fondo (WebP)"
                    accept="image/*"
                    initialUrl={initialImageUrl}
                    onUploadSuccess={handleImageSuccess}
                />

                <Divider />

                <Form.Item
                    label="Icon (Ionicons)"
                    name="icon"
                >
                    <Input placeholder="water-outline" />
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
        </Edit>
    );
};
