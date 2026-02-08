import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Upload, Checkbox, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../../providers/supabase-client";
import { useState, useEffect } from "react";

export const AcademyLessonEdit = () => {
    const { form, formProps, saveButtonProps, onFinish } = useForm();
    const [audioUrl, setAudioUrl] = useState<string>("");

    // Fetch modules
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

    useEffect(() => {
        if (formProps.initialValues) {
            if (formProps.initialValues.audio_url) {
                setAudioUrl(formProps.initialValues.audio_url);
            }
        }
    }, [formProps.initialValues]);

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
        };
        const { file_upload, ...rest } = finalValues;
        await onFinish(rest);
    };

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} form={form} onFinish={handleOnFinish} layout="vertical">
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
                >
                    <Input.TextArea rows={10} style={{ fontFamily: 'monospace' }} />
                </Form.Item>

                <Form.Item label="Duration" name="duration" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Order Index" name="order_index">
                    <Input type="number" />
                </Form.Item>

                <Form.Item label="Premium Lesson" name="is_premium" valuePropName="checked">
                    <Checkbox>Premium (Locked)</Checkbox>
                </Form.Item>

                <Form.Item label="Replace Audio" name="file_upload">
                    <Upload.Dragger customRequest={handleAudioUpload} maxCount={1} showUploadList={false}>
                        <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                        <p className="ant-upload-text">Replace MP3 (academy-voices)</p>
                    </Upload.Dragger>
                </Form.Item>
                {audioUrl && <div style={{ marginTop: 5, fontSize: 12 }}>Current Audio: {audioUrl}</div>}
            </Form>
        </Edit>
    );
};
