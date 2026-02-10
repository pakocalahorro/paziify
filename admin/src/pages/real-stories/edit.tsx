import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Checkbox, Select } from "antd";
import { MediaUploader } from "../../components/media/MediaUploader";

export const RealStoriesEdit = () => {
    const { formProps, saveButtonProps, form } = useForm();

    const handleUploadSuccess = (url: string) => {
        form?.setFieldValue("cover_url", url);
    };

    const initialCoverUrl = formProps.initialValues?.cover_url;

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Subtitle"
                    name="subtitle"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Character Name"
                    name="character_name"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Character Role"
                    name="character_role"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true }]}
                >
                    <Select
                        options={[
                            { label: 'Master Mind', value: 'master_mind' },
                            { label: 'Superación', value: 'superacion' },
                            { label: 'Historia Real', value: 'historia_real' },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="Story Text (Markdown)"
                    name="story_text"
                    rules={[{ required: true }]}
                >
                    <Input.TextArea rows={10} style={{ fontFamily: 'monospace' }} />
                </Form.Item>
                <Form.Item
                    label="Transformation Theme"
                    name="transformation_theme"
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Cover URL" name="cover_url">
                    <Input readOnly placeholder="Upload an image below or paste URL" />
                </Form.Item>

                <MediaUploader
                    bucket="meditation-thumbnails"
                    label="Replace Cover Image"
                    initialUrl={initialCoverUrl}
                    onUploadSuccess={handleUploadSuccess}
                />

                <Form.Item
                    label="Is Premium"
                    name="is_premium"
                    valuePropName="checked"
                >
                    <Checkbox>Available for Plus members only</Checkbox>
                </Form.Item>
                <Form.Item
                    label="Is Featured"
                    name="is_featured"
                    valuePropName="checked"
                >
                    <Checkbox>Show in highlights</Checkbox>
                </Form.Item>
            </Form>
        </Edit>
    );
};
