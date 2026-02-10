import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, AutoComplete, InputNumber, Divider, Typography } from "antd";
import { supabaseClient } from "../../providers/supabase-client";
import { useEffect, useState } from "react";
import { MediaUploader } from "../../components/media/MediaUploader";

const { Text } = Typography;

export const AudiobookEdit = () => {
    const { form, formProps, saveButtonProps } = useForm();
    const [existingCategories, setExistingCategories] = useState<{ value: string }[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabaseClient
                .from("audiobooks")
                .select("category");

            if (data) {
                const unique = Array.from(new Set(data.map((item: any) => item.category)))
                    .filter(Boolean)
                    .map(cat => ({ value: cat }));
                setExistingCategories(unique);
            }
        };
        fetchCategories();
    }, []);

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
            <Form
                {...formProps}
                form={form}
                layout="vertical"
            >
                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Author" name="author" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Guide (Narrator)" name="narrator" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: "Aria", label: "Aria (Mindfulness)" },
                            { value: "Ziro", label: "Ziro (Focus)" },
                            { value: "Éter", label: "Éter (Sleep)" },
                            { value: "Gaia", label: "Gaia (Kids)" },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true }]}
                    help="Escribe una nueva o selecciona una existente."
                >
                    <AutoComplete
                        options={existingCategories}
                        filterOption={(inputValue, option) =>
                            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                    />
                </Form.Item>

                <Form.Item label="Duration (Minutes)" name="duration_minutes" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>

                <Form.Item label="Is Premium" name="is_premium" valuePropName="checked">
                    <Checkbox>Available for Plus members only</Checkbox>
                </Form.Item>

                <Divider />
                <Text strong>Gestión de Archivos (Supabase Storage)</Text>

                <Form.Item label="Audio URL" name="audio_url">
                    <Input readOnly />
                </Form.Item>
                <MediaUploader
                    bucket="audiobook-voices"
                    label="Reemplazar Audio MP3"
                    accept="audio/*"
                    initialUrl={initialAudioUrl}
                    onUploadSuccess={handleAudioSuccess}
                />

                <Form.Item label="Image URL" name="image_url">
                    <Input readOnly />
                </Form.Item>
                <MediaUploader
                    bucket="audiobook-thumbnails"
                    label="Reemplazar Portada"
                    initialUrl={initialImageUrl}
                    onUploadSuccess={handleImageSuccess}
                />
            </Form>
        </Edit>
    );
};
