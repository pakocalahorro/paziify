import { List, useTable, TagField, EditButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Form, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CrudFilters } from "@refinedev/core";
import { MEDITATION_CATEGORIES, PAZIIFY_GUIDES } from "../../constants/meditation-constants";

export const MeditationSessionList = () => {
    const { tableProps, searchFormProps } = useTable({
        resource: "meditation_sessions_content",
        onSearch: (params: any) => {
            const filters: CrudFilters = [];
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
                    filters={MEDITATION_CATEGORIES.map(cat => ({ text: cat.label, value: cat.value }))}
                />
                <Table.Column
                    dataIndex="creator_name"
                    title="Guide"
                    filters={PAZIIFY_GUIDES.map(guide => ({ text: guide.label, value: guide.value }))}
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
