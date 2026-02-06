import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Checkbox } from "antd";

export const MeditationSessionCreate = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
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
                    help="Unique identifier for the session (e.g. 'box_breathing')"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Is Premium"
                    name="is_plus"
                    valuePropName="checked"
                >
                    <Checkbox>Plus Member Only</Checkbox>
                </Form.Item>
                {/* Future: Add JSON editors for audio_layers and breathing_config */}
            </Form>
        </Create>
    );
};
