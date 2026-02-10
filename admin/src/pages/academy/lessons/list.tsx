import { List, useTable, TagField, EditButton, ShowButton, DeleteButton, FilterDropdown, useSelect } from "@refinedev/antd";
import { Table, Space, Select } from "antd";

export const AcademyLessonList = () => {
    const { tableProps } = useTable({
        syncWithLocation: true,
        pagination: { pageSize: 10 }
    });

    const { selectProps: moduleSelectProps, query: modulesQuery } = useSelect({
        resource: "academy_modules",
        optionLabel: "title",
        optionValue: "id",
    });

    const modulesData = modulesQuery?.data?.data || [];

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column dataIndex="id" title="ID" />
                <Table.Column dataIndex="title" title="Title" />
                <Table.Column
                    dataIndex="module_id"
                    title="Course"
                    filterDropdown={(props) => (
                        <FilterDropdown {...props}>
                            <Select
                                {...moduleSelectProps}
                                style={{ minWidth: 200 }}
                                placeholder="Select Course"
                            />
                        </FilterDropdown>
                    )}
                    render={(value) => {
                        if (modulesQuery?.isLoading) return "Loading...";
                        return modulesData.find((item: any) => item.id === value)?.title ?? value;
                    }}
                />
                <Table.Column dataIndex="duration" title="Duration" />
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
