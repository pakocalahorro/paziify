import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox } from "antd";
import { MediaUploader } from "../../../components/media/MediaUploader";

export const AcademyModuleEdit = () => {
    const { form, formProps, saveButtonProps } = useForm();

    const handleImageSuccess = (url: string) => {
        form?.setFieldValue("image_url", url);
    };

    const initialImageUrl = formProps.initialValues?.image_url;

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} form={form} layout="vertical">
                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: 'anxiety', label: 'Ansiedad' },
                            { value: 'basics', label: 'Fundamentos' },
                            { value: 'growth', label: 'Crecimiento' },
                            { value: 'sleep', label: 'Sueño' },
                            { value: 'professional', label: 'Profesional' },
                            { value: 'family', label: 'Familia' },
                            { value: 'health', label: 'Salud' }
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Author/Guide" name="author" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: 'Dra. Aria', label: 'Dra. Aria' },
                            { value: 'Dr. Ziro', label: 'Dr. Ziro' },
                            { value: 'Dr. Éter', label: 'Dr. Éter' },
                            { value: 'Dra. Gaia', label: 'Dra. Gaia' },
                            { value: 'Coach Marco', label: 'Coach Marco' }
                        ]}
                    />
                </Form.Item>
                <Form.Item label="Duration Label" name="duration" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Is Premium" name="is_premium" valuePropName="checked">
                    <Checkbox>Available for Plus members only</Checkbox>
                </Form.Item>

                <Form.Item label="Image URL" name="image_url">
                    <Input readOnly />
                </Form.Item>

                <MediaUploader
                    bucket="academy-thumbnails"
                    label="Replace Module Cover"
                    initialUrl={initialImageUrl}
                    onUploadSuccess={handleImageSuccess}
                />
            </Form>
        </Edit>
    );
};
