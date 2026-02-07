import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, Upload, Button, AutoComplete, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../providers/supabase-client";
import { useEffect, useState } from "react";

export const AudiobookCreate = () => {
    // Use Refine hook for form management
    const { form, formProps, saveButtonProps, onFinish } = useForm();

    // Local state for URLs to ensure persistence regardless of form instance issues
    const [audioUrl, setAudioUrl] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");

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

            // Use our explicit form instance AND local state
            const url = publicUrlData.publicUrl;
            console.log("🎤 Audio URL uploaded:", url);
            setAudioUrl(url);
            form?.setFieldValue("audio_url", url);
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

            // Use our explicit form instance AND local state
            const url = publicUrlData.publicUrl;
            console.log("🖼️ Cover URL uploaded:", url);
            setImageUrl(url);
            form?.setFieldValue("image_url", url);
            onSuccess("ok");
        } catch (err) {
            console.error("Image Upload error:", err);
            onError({ err });
        }
    };

    const handleOnFinish = async (values: any) => {
        // Get latest values directly from form instance to be safe
        const currentAudioUrl = audioUrl || form?.getFieldValue("audio_url") || values.audio_url;
        const currentImageUrl = imageUrl || form?.getFieldValue("image_url") || values.image_url;

        console.log("🟢 Submitting form with values:", values);
        console.log("🧐 Resolved URLs:", { currentAudioUrl, currentImageUrl });

        if (!currentAudioUrl || !currentImageUrl) {
            console.warn("URLs missing on submit. Expected urls from state or form.");
            // Let's keep the logic but remove the intrusive alert.
        }

        // Merge form values with our guaranteed local state URLs
        const finalValues = {
            ...values,
            audio_url: currentAudioUrl,
            image_url: currentImageUrl,
        };

        const { file_upload, image_upload, ...rest } = finalValues;
        console.log("🚀 Sending to Supabase:", rest);
        await onFinish(rest);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form
                {...formProps}
                form={form}
                onFinish={handleOnFinish}
                layout="vertical"
                onFinishFailed={(errorInfo) => {
                    console.error('🔴 Form Validation Failed:', errorInfo);
                    alert("Form validation failed! Check console for details.");
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
                    label="Duration (Minutes)"
                    name="duration_minutes"
                    rules={[{ required: true, message: "Please enter duration in minutes" }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} placeholder="e.g. 45" />
                </Form.Item>

                <Form.Item
                    label="Is Premium"
                    name="is_premium"
                    valuePropName="checked"
                >
                    <Checkbox>Premium Content</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block style={{ backgroundColor: '#fa541c' }}>
                        Create Audiobook
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
