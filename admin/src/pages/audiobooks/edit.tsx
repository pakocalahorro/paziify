import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, Upload, AutoComplete, Button, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../providers/supabase-client";
import { useEffect, useState } from "react";

export const AudiobookEdit = () => {
    // Use Refine hook for form management
    const { form, formProps, saveButtonProps, onFinish } = useForm();

    // Local state for URLs
    const [audioUrl, setAudioUrl] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");

    // Sync Refine's loaded data to our explicit form instance
    useEffect(() => {
        if (formProps.initialValues) {
            const { audio_url, image_url } = formProps.initialValues;

            // Populate form and state
            form?.setFieldsValue({
                ...formProps.initialValues,
                audio_url: audio_url,
                image_url: image_url,
            });

            if (audio_url) setAudioUrl(audio_url);
            if (image_url) setImageUrl(image_url);
        }
    }, [formProps.initialValues]);

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

    const handleAudioUpload = async (options: any) => {
        console.log("🎤 Starting Audio Upload (Edit)...");
        const { onSuccess, onError, file } = options;
        try {
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const fileName = `${Date.now()}-${sanitizedName}`;

            const { data, error } = await supabaseClient.storage
                .from("audiobook-voices")
                .upload(fileName, file, { cacheControl: "3600", upsert: false });

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("audiobook-voices")
                .getPublicUrl(fileName);

            const url = publicUrlData.publicUrl;
            console.log("🎤 Audio URL set (Edit):", url);
            setAudioUrl(url);
            form?.setFieldValue("audio_url", url);
            onSuccess("ok");
        } catch (err) {
            console.error("Audio Upload error:", err);
            onError({ err });
        }
    };

    const handleImageUpload = async (options: any) => {
        console.log("🖼️ Starting Image Upload (Edit)...");
        const { onSuccess, onError, file } = options;
        try {
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const fileName = `${Date.now()}-${sanitizedName}`;

            const { data, error } = await supabaseClient.storage
                .from("audiobook-thumbnails")
                .upload(fileName, file, { cacheControl: "3600", upsert: false });

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("audiobook-thumbnails")
                .getPublicUrl(fileName);

            const url = publicUrlData.publicUrl;
            console.log("🖼️ Image URL set (Edit):", url);
            setImageUrl(url);
            form?.setFieldValue("image_url", url);
            onSuccess("ok");
        } catch (err) {
            console.error("Image Upload error:", err);
            onError({ err });
        }
    };

    const handleOnFinish = async (values: any) => {
        console.log("Submitting form with values:", values);

        // Merge form values with our guaranteed local state URLs
        const finalValues = {
            ...values,
            audio_url: audioUrl || values.audio_url,
            image_url: imageUrl || values.image_url,
        };

        const { file_upload, image_upload, ...rest } = finalValues;
        console.log("🚀 Sending to Supabase with State Overrides:", rest);
        await onFinish(rest);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form
                {...formProps}
                form={form}
                onFinish={handleOnFinish}
                layout="vertical"
                onFinishFailed={(errorInfo) => {
                    console.log('Failed:', errorInfo);
                    alert("Form validation failed: " + JSON.stringify(errorInfo));
                }}
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
                    <Checkbox>Premium Content</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block style={{ backgroundColor: '#fa541c' }}>
                        Save Changes
                    </Button>
                </Form.Item>

                {/* Uploads */}
                <Form.Item
                    label="Replace Audio (.mp3)"
                    name="file_upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload.Dragger
                        name="file"
                        customRequest={handleAudioUpload}
                        listType="picture"
                        maxCount={1}
                        accept="audio/*"
                    >
                        <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                        <p className="ant-upload-text">Replace MP3 (Voices Bucket)</p>
                    </Upload.Dragger>
                </Form.Item>

                <Form.Item
                    label="Replace Image (.png/.jpg)"
                    name="image_upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload.Dragger
                        name="file"
                        customRequest={handleImageUpload}
                        listType="picture"
                        maxCount={1}
                        accept="image/*"
                    >
                        <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                        <p className="ant-upload-text">Replace Cover (Thumbnails Bucket)</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Edit>
    );
};
