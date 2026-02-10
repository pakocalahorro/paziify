import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, Divider, Typography } from "antd";
import { supabaseClient } from "../../../providers/supabase-client";
import { useState, useEffect } from "react";
import { MediaUploader } from "../../../components/media/MediaUploader";

const { Text } = Typography;

export const AcademyLessonCreate = () => {
    const { form, formProps, saveButtonProps } = useForm();
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

    const handleAudioSuccess = (url: string) => {
        form?.setFieldValue("audio_url", url);
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} form={form} layout="vertical">
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

                <Form.Item label="Is Premium" name="is_premium" valuePropName="checked">
                    <Checkbox>Available for Plus members only</Checkbox>
                </Form.Item>

                <Divider />
                <Text strong>Archivo de Audio (academy-voices)</Text>

                <Form.Item label="Audio URL" name="audio_url" rules={[{ required: true }]}>
                    <Input readOnly placeholder="Sube un archivo MP3 abajo" />
                </Form.Item>
                <MediaUploader
                    bucket="academy-voices"
                    label="Subir Audio de la Lección"
                    accept="audio/*"
                    onUploadSuccess={handleAudioSuccess}
                />
            </Form>
        </Create>
    );
};
