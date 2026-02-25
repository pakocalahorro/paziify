import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Divider, Typography, Space, Card, Alert } from "antd";
import { useParams, useLocation } from "react-router";
import { InfoCircleOutlined, BellOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export const NotificationTemplateEdit = () => {
    const { id } = useParams();
    const location = useLocation();

    // Get return URL from query params to preserve filters
    const searchParams = new URLSearchParams(location.search);
    const returnTo = searchParams.get("to") || "";

    const { formProps, saveButtonProps, form } = useForm({
        resource: "notification_templates",
        id,
        action: "edit",
        redirect: false,
        onMutationSuccess: () => {
            window.location.href = `/notifications${returnTo}`;
        }
    });

    const category = Form.useWatch("category", form);
    const title = Form.useWatch("title", form);
    const body = Form.useWatch("body", form);

    return (
        <Edit saveButtonProps={saveButtonProps} title="Edit Notification Template">
            <Form {...formProps} layout="vertical">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <Form.Item label="Category" name="category">
                        <Select
                            disabled
                            options={[
                                { label: 'Behavioral (Automatic)', value: 'behavioral' },
                                { label: 'Editorial (Campaign)', value: 'editorial' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Unique Identifier (Type)" name="type">
                        <Input disabled />
                    </Form.Item>
                </div>

                <Divider>Message Content</Divider>

                <Form.Item
                    label="Notification Title"
                    name="title"
                    rules={[{ required: true, message: 'Title is required' }]}
                >
                    <Input placeholder="e.g. New streak achieved!" count={{ show: true, max: 50 }} />
                </Form.Item>

                <Form.Item
                    label="Message Body"
                    name="body"
                    rules={[{ required: true, message: 'Message body cannot be empty' }]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Use {name} for the user's name and {streak} for streak days."
                        count={{ show: true, max: 150 }}
                    />
                </Form.Item>

                <Alert
                    message="Available Variables"
                    description={
                        <Space direction="vertical" size={0}>
                            <Text style={{ fontSize: '12px' }}><code>{"{name}"}</code> - User name (e.g. Paco)</Text>
                            <Text style={{ fontSize: '12px' }}><code>{"{streak}"}</code> - Current streak days (e.g. 7)</Text>
                        </Space>
                    }
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                    style={{ marginBottom: '24px' }}
                />

                <Card
                    title={<Space><BellOutlined /> <Text strong>Live Preview (Simulated)</Text></Space>}
                    size="small"
                    style={{ backgroundColor: '#f5f5f5', marginBottom: '24px' }}
                >
                    <div style={{ padding: '8px' }}>
                        <Text strong style={{ display: 'block' }}>
                            {title?.replace('{name}', 'Paco').replace('{streak}', '7') || 'No title'}
                        </Text>
                        <Text>
                            {body?.replace('{name}', 'Paco').replace('{streak}', '7') || 'Write a message to see the preview...'}
                        </Text>
                    </div>
                </Card>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <Form.Item label="Notification Status" name="is_active" valuePropName="checked">
                        <Switch checkedChildren="ACTIVE" unCheckedChildren="INACTIVE" />
                    </Form.Item>
                </div>

                {category === 'editorial' && (
                    <>
                        <Divider>Scheduling (Optional)</Divider>
                        <Form.Item label="Scheduled Date" name="scheduled_at">
                            <Input type="datetime-local" />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Edit>
    );
};
