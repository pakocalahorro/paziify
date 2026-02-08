import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../../providers/supabase-client";
import { useState, useEffect } from "react";

export const AcademyModuleEdit = () => {
    const { form, formProps, saveButtonProps, onFinish } = useForm();
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
        if (formProps.initialValues) {
            setImageUrl(formProps.initialValues.image_url);
        }
    }, [formProps.initialValues]);

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
        };
        const { image_upload, ...rest } = finalValues;
        await onFinish(rest);
    };

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} form={form} onFinish={handleOnFinish} layout="vertical">
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
                <Form.Item label="Replace Cover Image" name="image_upload">
                    <Upload.Dragger customRequest={handleImageUpload} maxCount={1} showUploadList={false}>
                        <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                        <p className="ant-upload-text">Click or drag file to replace cover</p>
                    </Upload.Dragger>
                </Form.Item>
                {imageUrl && <img src={imageUrl} alt="Cover" style={{ maxWidth: '200px', marginTop: 10 }} />}
            </Form>
        </Edit>
    );
};
