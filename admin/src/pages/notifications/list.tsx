import { List, useTable, EditButton, DeleteButton, CreateButton, TagField } from "@refinedev/antd";
import { Table, Space, Tag, Typography, Button } from "antd";
import { useGo, useNavigation } from "@refinedev/core";
import { useLocation } from "react-router";
import { BellOutlined, SendOutlined, LoadingOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../providers/supabase-client";
import { useState } from "react";

const { Text } = Typography;

export const NotificationTemplateList = () => {
    const location = useLocation();
    const go = useGo();

    const { tableProps } = useTable({
        resource: "notification_templates",
        sorters: {
            initial: [{ field: "category", order: "asc" }],
        },
    });

    const [sendingId, setSendingId] = useState<string | null>(null);

    const handleSend = async (record: any) => {
        setSendingId(record.id);
        try {
            const { data, error } = await supabaseClient.functions.invoke("send-notification", {
                body: {
                    template_id: record.id,
                    segment: 'all' // Por defecto a todos
                },
            });

            if (error) throw error;

            alert(`Campaña enviada con éxito a ${data.count} usuarios.`);
        } catch (error: any) {
            console.error("Error al enviar campaña:", error);
            alert("Error al enviar campaña: " + (error.message || "Error desconocido"));
        } finally {
            setSendingId(null);
        }
    };

    const columns = [
        {
            dataIndex: "category",
            key: "category",
            title: "Category",
            width: 120,
            render: (value: string) => (
                <Tag color={value === 'behavioral' ? 'blue' : 'purple'}>
                    {value.toUpperCase()}
                </Tag>
            ),
            filters: [
                { text: "Behavioral", value: "behavioral" },
                { text: "Editorial", value: "editorial" },
            ],
            onFilter: (value: any, record: any) => record.category === value,
        },
        {
            dataIndex: "type",
            key: "type",
            title: "Type",
            width: 150,
            render: (value: string) => <code style={{ fontSize: '12px' }}>{value}</code>
        },
        {
            dataIndex: "title",
            key: "title",
            title: "Title",
            width: 250,
            render: (value: string) => <Text strong>{value}</Text>
        },
        {
            dataIndex: "body",
            key: "body",
            title: "Message Body",
            render: (value: string) => (
                <Text ellipsis={{ tooltip: value }} style={{ maxWidth: 350 }}>
                    {value}
                </Text>
            )
        },
        {
            dataIndex: "is_active",
            key: "is_active",
            title: "Active",
            width: 80,
            render: (value: boolean) => (
                <TagField value={value ? "YES" : "NO"} color={value ? "green" : "red"} />
            )
        },
        {
            title: "Actions",
            key: "actions",
            width: 180,
            fixed: "right" as const,
            render: (_: any, record: any) => (
                <Space>
                    <EditButton
                        hideText
                        size="small"
                        recordItemId={record.id}
                        onClick={() => {
                            go({
                                to: {
                                    resource: "notification_templates",
                                    action: "edit",
                                    id: record.id,
                                },
                                query: {
                                    to: location.search
                                }
                            });
                        }}
                    />
                    {record.category === 'editorial' && (
                        <Button
                            size="small"
                            icon={sendingId === record.id ? <LoadingOutlined /> : <SendOutlined />}
                            type="primary"
                            ghost
                            title="Send campaign now"
                            disabled={sendingId === record.id}
                            onClick={() => handleSend(record)}
                        >
                            {sendingId === record.id ? "Sending..." : "Send"}
                        </Button>
                    )}
                    <DeleteButton hideText size="small" recordItemId={record.id} />
                </Space>
            ),
        },
    ];

    return (
        <List
            title={
                <Space>
                    <BellOutlined />
                    <span>Notification Management (CMS)</span>
                </Space>
            }
            headerButtons={() => (
                <CreateButton
                    onClick={() => {
                        go({
                            to: {
                                resource: "notification_templates",
                                action: "create",
                            },
                            query: {
                                to: location.search
                            }
                        });
                    }}
                >
                    New Template
                </CreateButton>
            )}
        >
            <Table
                {...tableProps}
                rowKey="id"
                columns={columns}
                pagination={{
                    ...tableProps.pagination,
                    showSizeChanger: true,
                }}
            />
        </List>
    );
};
