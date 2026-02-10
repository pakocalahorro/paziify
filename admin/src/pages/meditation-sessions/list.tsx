import { List, useTable, TagField, EditButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Form, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const MeditationSessionList = () => {
    const { tableProps, searchFormProps } = useTable({
        resource: "meditation_sessions_content",
        onSearch: (params: any) => {
            const filters = [];
            if (params.title) {
                filters.push({
                    field: "title",
                    operator: "contains",
                    value: params.title,
                });
            }
            return filters;
        },
    });

    return (
        <List>
            <Form
                {...searchFormProps}
                layout="inline"
                onFinish={(values) => searchFormProps.onFinish?.(values)}
                style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-end" }}
            >
                <Form.Item name="title">
                    <Input
                        placeholder="Buscar por título..."
                        prefix={<SearchOutlined />}
                        allowClear
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Buscar
                    </Button>
                </Form.Item>
            </Form>

            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="thumbnail_url"
                    title="Cover"
                    render={(value) => (
                        <img
                            src={value}
                            alt="Cover"
                            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                        />
                    )}
                />
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column dataIndex="description" title="Description" />
                <Table.Column
                    dataIndex="category"
                    title="Category"
                    filters={[
                        { text: 'Calmasos', value: 'calmasos' },
                        { text: 'Meditación', value: 'meditacion' },
                        { text: 'Respiración', value: 'respiracion' },
                        { text: 'Cuentos', value: 'cuentos' },
                        { text: 'Resiliencia', value: 'resiliencia' },
                        { text: 'Rendimiento', value: 'rendimiento' },
                    ]}
                />
                <Table.Column
                    dataIndex="creator_name"
                    title="Guide"
                    filters={[
                        { text: 'Aria', value: 'Aria' },
                        { text: 'Ziro', value: 'Ziro' },
                        { text: 'Éter', value: 'Éter' },
                        { text: 'Gaia', value: 'Gaia' },
                    ]}
                />
                <Table.Column dataIndex="slug" title="Slug" />
                <Table.Column
                    dataIndex="is_premium"
                    title="Plus"
                    render={(value) => <TagField value={value ? "Yes" : "No"} color={value ? "gold" : "default"} />}
                />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: any) => (
                        <Space>
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
