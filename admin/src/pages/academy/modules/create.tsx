import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Checkbox, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../../providers/supabase-client";
import { useState } from "react";

export const AcademyModuleCreate = () => {
    const { form, formProps, saveButtonProps, onFinish } = useForm();
    const [imageUrl, setImageUrl] = useState<string>("");

    const handleImageUpload = async (options: any) => {
        const { onSuccess, onError, file } = options;
        try {
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const fileName = `${Date.now()}-${sanitizedName}`;

            const { data, error } = await supabaseClient.storage
                .from("academy-thumbnails")
                .upload(fileName, file, { cacheControl: "3600", upsert: false });

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("academy-thumbnails")
                .getPublicUrl(fileName);

            const url = publicUrlData.publicUrl;
            setImageUrl(url);
            form?.setFieldValue("image_url", url);
            onSuccess("ok");
        } catch (err) {
            console.error("Image Upload error:", err);
            onError({ err });
        }
    };

    const handleOnFinish = async (values: any) => {
        const currentImageUrl = imageUrl || form?.getFieldValue("image_url") || values.image_url;
        const finalValues = {
            ...values,
            image_url: currentImageUrl,
            is_published: true, // Default to published for now
        };
        const { image_upload, ...rest } = finalValues;
        await onFinish(rest);
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} form={form} onFinish={handleOnFinish} layout="vertical">
                <Form.Item label="ID (Slug)" name="id" rules={[{ required: true }]} help="Unique (e.g., 'anxiety_basics')">
                    <Input />
                </Form.Item>
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
                    <Input placeholder="e.g. 5 Lessons" />
                </Form.Item>
                <Form.Item label="Is Premium" name="is_premium" valuePropName="checked">
                    <Checkbox>Available for Plus members only</Checkbox>
                </Form.Item>
                <Form.Item label="Cover Image" name="image_upload">
                    <Upload.Dragger customRequest={handleImageUpload} maxCount={1} showUploadList={false}>
                        <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                        <p className="ant-upload-text">Click or drag file to upload cover</p>
                    </Upload.Dragger>
                </Form.Item>
                {imageUrl && <img src={imageUrl} alt="Cover" style={{ maxWidth: '200px', marginTop: 10 }} />}
            </Form>
        </Create>
    );
};
