import { List, useTable, TagField, EditButton, DeleteButton } from "@refinedev/antd";
import { Table, Space } from "antd";

export const MeditationSessionList = () => {
    const { tableProps } = useTable({
        resource: "meditation_sessions_content",
    });

    return (
        <List>
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
                    dataIndex="is_plus"
                    title="Premium"
                    render={(value) => <TagField value={value ? "Plus" : "Free"} color={value ? "gold" : "default"} />}
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
