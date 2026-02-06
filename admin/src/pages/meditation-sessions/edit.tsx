import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Checkbox, Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../providers/supabase-client";

export const MeditationSessionEdit = () => {
    const { formProps, saveButtonProps, form, onFinish } = useForm();

    const handleAudioUpload = async (options: any) => {
        console.log("🎤 Starting Meditation Audio Upload...");
        const { onSuccess, onError, file } = options;
        try {
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const fileName = `${Date.now()}-${sanitizedName}`;

            // GUESSING BUCKET NAME: meditation-audio (if fails, user will see error)
            const { data, error } = await supabaseClient.storage
                .from("meditation-audio")
                .upload(fileName, file, { cacheControl: "3600", upsert: false });

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("meditation-audio")
                .getPublicUrl(fileName);

            console.log("🎤 Audio URL set:", publicUrlData.publicUrl);
            form?.setFieldValue("voice_url", publicUrlData.publicUrl);
            onSuccess("ok");
        } catch (err) {
            console.error("Audio Upload error:", err);
            onError({ err });
            alert("Upload Failed. Check bucket name 'meditation-audio'?");
        }
    };

    const handleImageUpload = async (options: any) => {
        console.log("🖼️ Starting Meditation Image Upload...");
        const { onSuccess, onError, file } = options;
        try {
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const fileName = `${Date.now()}-${sanitizedName}`;

            // GUESSING BUCKET NAME: meditation-thumbnails
            const { data, error } = await supabaseClient.storage
                .from("meditation-thumbnails")
                .upload(fileName, file, { cacheControl: "3600", upsert: false });

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("meditation-thumbnails")
                .getPublicUrl(fileName);

            console.log("🖼️ Image URL set:", publicUrlData.publicUrl);
            form?.setFieldValue("thumbnail_url", publicUrlData.publicUrl);
            onSuccess("ok");
        } catch (err) {
            console.error("Image Upload error:", err);
            onError({ err });
            alert("Upload Failed. Check bucket name 'meditation-thumbnails'?");
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
        <Edit saveButtonProps={saveButtonProps}>
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
                    label="Description"
                    name="description"
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item
                    label="Slug (ID)"
                    name="slug"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    initialValue="calmasos"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Select.Option value="calmasos">Calmasos (SOS)</Select.Option>
                        <Select.Option value="meditacion">Meditación</Select.Option>
                        <Select.Option value="respiracion">Respiración</Select.Option>
                        <Select.Option value="cuentos">Cuentos</Select.Option>
                        <Select.Option value="resiliencia">Resiliencia</Select.Option>
                        <Select.Option value="rendimiento">Rendimiento</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Guide (Narrator)"
                    name="creator_name"
                    initialValue="Aria"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Select.Option value="Aria">Aria</Select.Option>
                        <Select.Option value="Ziro">Ziro</Select.Option>
                        <Select.Option value="Éter">Éter</Select.Option>
                        <Select.Option value="Gaia">Gaia</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Is Premium"
                    name="is_plus"
                    valuePropName="checked"
                >
                    <Checkbox>Plus Member Only</Checkbox>
                </Form.Item>

                {/* VISIBLE URL FIELDS */}
                <Form.Item name="voice_url" label="Current Voice URL">
                    <Input />
                </Form.Item>
                <Form.Item name="thumbnail_url" label="Current Thumbnail URL">
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block style={{ backgroundColor: '#fa541c' }}>
                        DEBUG GUARDAR (Manual)
                    </Button>
                </Form.Item>

                {/* Uploads */}
                <Form.Item
                    label="Replace Voice (.mp3)"
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
                        <p className="ant-upload-text">Replace Voice (meditation-audio)</p>
                    </Upload.Dragger>
                </Form.Item>

                <Form.Item
                    label="Replace Thumbnail (.png/.jpg)"
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
                        <p className="ant-upload-text">Replace Thumbnail (meditation-thumbnails)</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form>
        </Edit>
    );
};
