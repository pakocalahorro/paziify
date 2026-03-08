import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, Button, Space, message } from "antd";
import { PlayCircleOutlined, StopOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../../providers/supabase-client";
import { useState, useEffect } from "react";
import { MediaUploader } from "../../../components/media/MediaUploader";

export const AcademyLessonEdit = () => {
    const { form, formProps, saveButtonProps } = useForm();
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

    const playPreview = (url?: string) => {
        if (!url) {
            message.warning("No hay audio para previsualizar.");
            return;
        }
        if (currentAudio) {
            currentAudio.pause();
        }
        const audio = new Audio(url);
        audio.play().catch(e => console.error("Error previewing:", e));
        setCurrentAudio(audio);
    };

    const stopPreview = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setCurrentAudio(null);
        }
    };
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

    const handleAudioSuccess = (url: string) => {
        form?.setFieldValue("audio_url", url);
    };

    const initialAudioUrl = formProps.initialValues?.audio_url;

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} form={form} layout="vertical">
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

                <Form.Item label="Is Premium" name="is_premium" valuePropName="checked">
                    <Checkbox>Available for Plus members only</Checkbox>
                </Form.Item>

                <Form.Item label="Audio URL" required>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Form.Item name="audio_url" noStyle rules={[{ required: true }]}>
                            <Input readOnly style={{ flex: 1 }} />
                        </Form.Item>
                        <Space>
                            <Button
                                icon={<PlayCircleOutlined />}
                                onClick={() => playPreview(form?.getFieldValue("audio_url"))}
                            />
                            <Button
                                icon={<StopOutlined />}
                                onClick={stopPreview}
                            />
                        </Space>
                    </div>
                </Form.Item>

                <MediaUploader
                    bucket="academy-voices"
                    label="Replace Lesson Audio"
                    accept="audio/*"
                    initialUrl={initialAudioUrl}
                    onUploadSuccess={handleAudioSuccess}
                />
            </Form>
        </Edit>
    );
};
