import { DateField, List, useTable, EditButton, ShowButton, DeleteButton } from "@refinedev/antd";
import { Table, Space, Image } from "antd";

export const AcademyModuleList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
        pagination: { pageSize: 10 }
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="image_url"
                    title="Cover"
                    render={(value) => <Image width={50} src={value} />}
                />
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column dataIndex="category" title="Category" />
                <Table.Column dataIndex="author" title="Author" />
                <Table.Column dataIndex="duration" title="Duration" />
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
