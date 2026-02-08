import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Upload, Checkbox, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../../providers/supabase-client";
import { useState, useEffect } from "react";

export const AcademyLessonCreate = () => {
    const { form, formProps, saveButtonProps, onFinish } = useForm();
    const [audioUrl, setAudioUrl] = useState<string>("");

    // Fetch modules to populate the Select dropdown
    const [modules, setModules] = useState<{ value: string, label: string }[]>([]);

    useEffect(() => {
        const fetchModules = async () => {
            const { data } = await supabaseClient.from('academy_modules').select('id, title');
            if (data) {
                setModules(data.map((m: any) => ({ value: m.id, label: `${m.title} (${m.id})` })));
            }
        };
        fetchModules();
    }, []);

    const handleAudioUpload = async (options: any) => {
        const { onSuccess, onError, file } = options;
        try {
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const fileName = `${Date.now()}-${sanitizedName}`;

            const { data, error } = await supabaseClient.storage
                .from("academy-voices")
                .upload(fileName, file, { cacheControl: "3600", upsert: false });

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("academy-voices")
                .getPublicUrl(fileName);

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

    const handleOnFinish = async (values: any) => {
        const currentAudioUrl = audioUrl || form?.getFieldValue("audio_url") || values.audio_url;
        const finalValues = {
            ...values,
            audio_url: currentAudioUrl,
            // Ensure order_index is a number if not provided? Backend might handle it or we default to 0
            order_index: values.order_index || 0
        };
        const { file_upload, ...rest } = finalValues;
        await onFinish(rest);
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} form={form} onFinish={handleOnFinish} layout="vertical">
                <Form.Item label="ID (Slug)" name="id" rules={[{ required: true }]} help="Unique (e.g., 'anxiety_lesson_1')">
                    <Input />
                </Form.Item>

                <Form.Item label="Course Module" name="module_id" rules={[{ required: true }]}>
                    <Select options={modules} />
                </Form.Item>

                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Form.Item
                    label="Content (Markdown)"
                    name="content"
                    rules={[{ required: true }]}
                    help="Use standard Markdown (# Heading, **Bold**, etc.)"
                >
                    <Input.TextArea rows={10} style={{ fontFamily: 'monospace' }} />
                </Form.Item>

                <Form.Item label="Duration" name="duration" rules={[{ required: true }]}>
                    <Input placeholder="e.g. '10 min'" />
                </Form.Item>

                <Form.Item label="Order Index" name="order_index">
                    <Input type="number" placeholder="0" />
                </Form.Item>

                <Form.Item label="Premium Lesson" name="is_premium" valuePropName="checked">
                    <Checkbox>Premium (Locked)</Checkbox>
                </Form.Item>

                <Form.Item
                    label="Audio File (.mp3)"
                    name="file_upload"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "Please upload audio" }]}
                >
                    <Upload.Dragger
                        name="file"
                        customRequest={handleAudioUpload}
                        listType="picture"
                        maxCount={1}
                        accept="audio/*"
                    >
                        <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                        <p className="ant-upload-text">Upload to academy-voices</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Create>
    );
};
