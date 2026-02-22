import { List, useTable, TagField, EditButton, DeleteButton, CreateButton } from "@refinedev/antd";
import { Table, Space, Form, Input, Button, Select, Image } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CrudFilters, useGo, useNavigation, useList } from "@refinedev/core";
import { useState, useEffect, useMemo } from "react";
import { Resizable } from "react-resizable";
import { useLocation } from "react-router";
import { MEDITATION_CATEGORIES, PAZIIFY_GUIDES } from "../../constants/meditation-constants";

// --- Resizable Components ---
const ResizableTitle = (props: any) => {
    const { onResize, width, filtered, ...restProps } = props;

    const style: React.CSSProperties = {
        ...restProps.style,
        backgroundColor: filtered ? 'rgba(24, 144, 255, 0.15)' : undefined,
    };

    if (!width) {
        return <th {...restProps} style={style} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} style={style} />
        </Resizable>
    );
};

export const MeditationSessionList = () => {
    const location = useLocation();
    const go = useGo();
    const { createUrl } = useNavigation();

    // --- Soundscape Resolution ---
    const soundscapesQuery = useList({
        resource: "soundscapes",
        pagination: { mode: "off" }
    });

    const soundscapeMap = useMemo(() => {
        const map: Record<string, string> = {};
        const data = (soundscapesQuery as any)?.result?.data;
        data?.forEach((s: any) => {
            map[s.slug] = s.name;
        });
        return map;
    }, [soundscapesQuery]);

    // --- Persistent State ---
    const [columnsWidth, setColumnsWidth] = useState(() => {
        const saved = localStorage.getItem("meditation_list_columns_width");
        return saved ? JSON.parse(saved) : {
            thumbnail_url: 120,
            slug: 150,
            title: 250,
            category: 120,
            cat_id: 80,
            guide: 120,
            binaural: 150,
            soundscape: 150,
            plus: 80,
            actions: 100,
        };
    });

    const [pageSize, setPageSize] = useState(() => {
        const saved = localStorage.getItem("meditation_list_page_size");
        return saved ? parseInt(saved, 10) : 10;
    });

    const { tableProps, searchFormProps, setPageSize: setRefinePageSize, filters } = useTable({
        resource: "meditation_sessions_content",
        pagination: {
            pageSize: pageSize,
        },
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

    // Helper to check active filters
    const isFiltered = (field: string) => {
        return filters?.some(f =>
            'field' in f && f.field === field && f.value !== undefined && f.value !== null && f.value !== ""
        );
    };

    // Sync localStorage
    useEffect(() => {
        localStorage.setItem("meditation_list_columns_width", JSON.stringify(columnsWidth));
    }, [columnsWidth]);

    useEffect(() => {
        localStorage.setItem("meditation_list_page_size", pageSize.toString());
        setRefinePageSize(pageSize);
    }, [pageSize]);

    const handleResize = (key: string) => (_event: any, { size }: any) => {
        setColumnsWidth((prev: any) => ({
            ...prev,
            [key]: size.width,
        }));
    };

    const columns = [
        {
            dataIndex: "thumbnail_url",
            key: "thumbnail_url",
            title: "Cover",
            width: columnsWidth.thumbnail_url,
            render: (value: any) => (
                <Image
                    src={value}
                    alt="Cover"
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                    fallback="https://via.placeholder.com/80?text=No+Cover"
                />
            ),
        },
        {
            dataIndex: "slug",
            key: "slug",
            title: "Slug",
            width: columnsWidth.slug,
        },
        {
            dataIndex: "title",
            key: "title",
            title: "Title",
            width: columnsWidth.title,
            render: (value: string) => <span style={{ fontWeight: 600 }}>{value}</span>
        },
        {
            dataIndex: "category",
            key: "category",
            title: "Category Name",
            width: columnsWidth.category,
            filters: MEDITATION_CATEGORIES.map(cat => ({ text: cat.label, value: cat.value })),
            render: (value: string) => {
                const category = MEDITATION_CATEGORIES.find(cat => cat.value === value);
                return category ? category.label : value;
            },
        },
        {
            dataIndex: "category",
            key: "cat_id",
            title: "Category ID",
            width: columnsWidth.cat_id,
            filters: MEDITATION_CATEGORIES.map(cat => ({ text: cat.value, value: cat.value })),
            render: (v: string) => <code style={{ fontSize: '10px' }}>{v}</code>
        },
        {
            dataIndex: "creator_name",
            key: "guide",
            title: "Guide",
            width: columnsWidth.guide,
            filters: PAZIIFY_GUIDES.map(guide => ({ text: guide.label, value: guide.value })),
            render: (value: string) => {
                const guide = PAZIIFY_GUIDES.find(g => g.value === value);
                return guide ? guide.label : value;
            },
        },
        {
            title: "Binaural",
            key: "binaural",
            width: columnsWidth.binaural,
            render: (_: any, record: any) => record.audio_config?.defaultBinaural || "-",
        },
        {
            title: "Soundscape",
            key: "soundscape",
            width: columnsWidth.soundscape,
            render: (_: any, record: any) => {
                let config = record.audio_config;
                if (typeof config === 'string') {
                    try { config = JSON.parse(config); } catch (e) { config = {}; }
                }
                const slug = config?.defaultSoundscape;
                return soundscapeMap[slug] || slug || "-";
            }
        },
        {
            dataIndex: "is_premium",
            key: "plus",
            title: "Plus",
            width: columnsWidth.plus,
            filters: [
                { text: "Yes", value: true },
                { text: "No", value: false },
            ],
            render: (value: boolean) => <TagField value={value ? "Yes" : "No"} color={value ? "gold" : "default"} />,
        },
        {
            title: "Actions",
            key: "actions",
            width: columnsWidth.actions,
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
                                    resource: "meditation_sessions_content",
                                    action: "edit",
                                    id: record.id,
                                },
                                query: {
                                    to: location.search
                                },
                                options: {
                                    keepQuery: true
                                }
                            });
                        }}
                    />
                    <DeleteButton hideText size="small" recordItemId={record.id} />
                </Space>
            ),
        },
    ];

    const mergedColumns = columns.map((col) => {
        const filtered = isFiltered(col.key || (col as any).dataIndex);
        return {
            ...col,
            onHeaderCell: (column: any) => ({
                width: column.width,
                onResize: handleResize(column.key),
                filtered: filtered,
            }),
            onCell: () => ({
                style: filtered ? { backgroundColor: 'rgba(24, 144, 255, 0.05)' } : {},
            }),
        };
    });

    return (
        <List
            headerButtons={() => (
                <Space>
                    <div style={{ marginRight: '8px' }}>
                        <span style={{ marginRight: '8px', color: '#666' }}>Nº Filas:</span>
                        <Select
                            value={pageSize}
                            onChange={(val) => setPageSize(val)}
                            options={[
                                { label: "10", value: 10 },
                                { label: "20", value: 20 },
                                { label: "50", value: 50 },
                                { label: "100", value: 100 },
                            ]}
                            style={{ width: 80 }}
                        />
                    </div>
                    <Button
                        type="primary"
                        onClick={() => {
                            go({
                                to: {
                                    resource: "meditation_sessions_content",
                                    action: "create",
                                },
                                query: {
                                    to: location.search
                                }
                            });
                        }}
                    >
                        Crear
                    </Button>
                </Space>
            )}
        >
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

            <Table
                {...tableProps}
                rowKey="id"
                columns={mergedColumns}
                components={{
                    header: {
                        cell: ResizableTitle,
                    },
                }}
                pagination={{
                    ...tableProps.pagination,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    showSizeChanger: true,
                    onShowSizeChange: (_, size) => setPageSize(size),
                    position: ["bottomRight"],
                }}
            />
        </List>
    );
};
