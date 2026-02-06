import { List, useTable, TagField, EditButton, DeleteButton } from "@refinedev/antd";
import { Table, Space } from "antd";

export const AudiobookList = () => {
    const { tableProps } = useTable({
        resource: "audiobooks",
        sorters: {
            initial: [
                {
                    field: "title",
                    order: "asc",
                },
            ],
        },
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="image_url"
                    title="Cover"
                    render={(value) => (
                        value ? <img src={value} alt="cover" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : '-'
                    )}
                />
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column dataIndex="author" title="Author" />
                <Table.Column
                    dataIndex="audio_url"
                    title="Audio URL"
                    render={(value) => <span style={{ fontSize: 10 }}>{value ? value.substring(0, 20) + '...' : 'EMPTY'}</span>}
                />
                <Table.Column dataIndex="category" title="Category" />
                <Table.Column
                    dataIndex="is_premium"
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
