import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, Upload, Button, AutoComplete } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../providers/supabase-client";
import { useEffect, useState } from "react";

export const AudiobookCreate = () => {
    const { formProps, saveButtonProps, form, onFinish } = useForm();
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

            form?.setFieldValue("audio_url", publicUrlData.publicUrl);
            onSuccess("ok");
        } catch (err) {
            console.error("Audio Upload error:", err);
            onError({ err });
        }
    };

    const handleImageUpload = async (options: any) => {
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

            form?.setFieldValue("image_url", publicUrlData.publicUrl);
            onSuccess("ok");
        } catch (err) {
            console.error("Image Upload error:", err);
            onError({ err });
        }
    };

    const handleOnFinish = (values: any) => {
        console.log("Submitting form with values:", values);
        const { file_upload, image_upload, ...rest } = values;
        return onFinish(rest);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const formPropsWithHandler = {
        ...formProps,
        onFinish: handleOnFinish,
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form
                {...formPropsWithHandler}
                form={form}
                layout="vertical"
                onFinishFailed={(errorInfo) => {
                    console.log('Failed:', errorInfo);
                    alert("Form validation failed: " + JSON.stringify(errorInfo));
                }}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Author"
                    name="author"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Guide (Narrator)"
                    name="narrator"
                    rules={[{ required: true }]}
                >
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
                <Form.Item
                    label="Is Premium"
                    name="is_premium"
                    valuePropName="checked"
                >
                    <Checkbox>Premium Content</Checkbox>
                </Form.Item>

                {/* DEBUG FIELDS: Visible to check population */}
                <Form.Item name="audio_url" label="DEBUG: Audio URL (Must not be empty)">
                    <Input />
                </Form.Item>
                <Form.Item name="image_url" label="DEBUG: Image URL (Must not be empty)">
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block style={{ backgroundColor: '#fa541c' }}>
                        DEBUG GUARDAR (Manual)
                    </Button>
                </Form.Item>

                {/* Upload: Audio */}
                <Form.Item
                    label="Audio File (.mp3)"
                    name="file_upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Please upload an audio file" }]}
                >
                    <Upload.Dragger
                        name="file"
                        customRequest={handleAudioUpload}
                        listType="picture"
                        maxCount={1}
                        accept="audio/*"
                        beforeUpload={() => false}
                    >
                        <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                        <p className="ant-upload-text">Upload MP3 (Voices Bucket)</p>
                    </Upload.Dragger>
                </Form.Item>

                {/* Upload: Image */}
                <Form.Item
                    label="Cover Image (.png/.jpg)"
                    name="image_upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Please upload a cover image" }]}
                >
                    <Upload.Dragger
                        name="file"
                        customRequest={handleImageUpload}
                        listType="picture"
                        maxCount={1}
                        accept="image/*"
                        beforeUpload={() => false}
                    >
                        <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                        <p className="ant-upload-text">Upload Cover (Thumbnails Bucket)</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Create>
    );
};
