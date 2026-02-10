import { List, useTable, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table, Space, Image, Tag } from "antd";

export const RealStoriesList = () => {
    const { tableProps } = useTable({
        resource: "real_stories",
        sorters: {
            initial: [
                {
                    field: "created_at",
                    order: "desc",
                },
            ],
        },
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="cover_url"
                    title="Portada"
                    render={(value) => (
                        <Image
                            src={value}
                            width={50}
                            height={50}
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                            fallback="https://via.placeholder.com/50"
                        />
                    )}
                />
                <Table.Column dataIndex="title" title="Título" />
                <Table.Column dataIndex="character_name" title="Personaje" />
                <Table.Column dataIndex="category" title="Categoría" />
                <Table.Column
                    dataIndex="is_premium"
                    title="Plus"
                    render={(value) => (
                        value ? <Tag color="gold">Plus</Tag> : <Tag color="green">Free</Tag>
                    )}
                />
                <Table.Column
                    title="Acciones"
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
