import { List, useTable, TagField, EditButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Tag } from "antd";

export const SoundscapeList = () => {
    const { tableProps } = useTable({
        resource: "soundscapes",
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="image_url"
                    title="Cover"
                    render={(value) => (
                        <img
                            src={value}
                            alt="Cover"
                            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
                        />
                    )}
                />
                <Table.Column dataIndex="name" title="Name" />
                <Table.Column dataIndex="slug" title="Slug" />
                <Table.Column
                    dataIndex="recommended_for"
                    title="Recommended"
                    render={(value: string[]) => (
                        <Space size={[0, 4]} wrap>
                            {value?.map(tag => (
                                <Tag key={tag} color="blue">{tag}</Tag>
                            ))}
                        </Space>
                    )}
                />
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
