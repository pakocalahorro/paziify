import React, { useState } from "react";
import { Upload, Modal, message, Typography, Button, Space } from "antd";
import { UploadOutlined, ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { supabaseClient } from "../../providers/supabase-client";

const { Text } = Typography;

interface MediaUploaderProps {
    bucket: string;
    label: string;
    accept?: string;
    initialUrl?: string;
    customFileName?: string;
    folder?: string; // Optional folder path (e.g., "kids" or "calmasos")
    variant?: "card" | "compact";
    onUploadSuccess: (url: string, fileName?: string) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
    bucket,
    label,
    accept = "image/*,audio/*",
    initialUrl,
    customFileName,
    folder,
    variant = "card",
    onUploadSuccess,
}) => {
    const [uploading, setUploading] = useState(false);

    const deleteOldFile = async (oldUrl: string) => {
        try {
            // Extract path from URL (Supabase public URL usually contains the path after /public/bucket-name/)
            const urlParts = oldUrl.split(`${bucket}/`);
            if (urlParts.length < 2) return;

            const filePath = urlParts[1];
            const { error } = await supabaseClient.storage.from(bucket).remove([filePath]);

            if (error) throw error;
            message.success("Archivo antiguo eliminado correctamente.");
        } catch (err) {
            console.error("Error deleting old file:", err);
            message.error("No se pudo eliminar el archivo antiguo del Storage.");
        }
    };

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            let baseName = "";

            if (customFileName) {
                const extension = file.name.split('.').pop();
                baseName = `${customFileName}.${extension}`;
            } else {
                baseName = file.name;
            }

            // OASIS FOLDER STRATEGY: Prefix with folder if provided
            // DEFENSIVE: If baseName already starts with folder prefix, don't duplicate it
            const finalPath = (folder && !baseName.startsWith(`${folder}/`))
                ? `${folder}/${baseName}`
                : baseName;

            const { data, error } = await supabaseClient.storage
                .from(bucket)
                .upload(finalPath, file, { cacheControl: "3600", upsert: true });

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from(bucket)
                .getPublicUrl(finalPath);

            const newUrl = publicUrlData.publicUrl;

            // Success! Pass finalPath for tracking/slugging
            onUploadSuccess(newUrl, finalPath);
            message.success(`Archivo subido a "${finalPath}" con éxito.`);

            // Second warning: Delete old file?
            if (initialUrl && initialUrl !== newUrl) {
                Modal.confirm({
                    title: "Eliminación de archivo antiguo",
                    icon: <DeleteOutlined style={{ color: '#fa541c' }} />,
                    content: (
                        <Space direction="vertical">
                            <Text>¿Desea eliminar el archivo antiguo de Supabase Storage para ahorrar espacio?</Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                <Text strong>URL Antigua:</Text> {initialUrl}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                <Text strong>URL Nueva:</Text> {newUrl}
                            </Text>
                        </Space>
                    ),
                    okText: "Sí, eliminar antiguo",
                    cancelText: "No, mantener ambos",
                    onOk: () => deleteOldFile(initialUrl),
                });
            }

        } catch (err) {
            console.error("Upload error:", err);
            message.error("Error al subir el archivo.");
        } finally {
            setUploading(false);
        }
    };

    const beforeUpload = (file: File) => {
        if (initialUrl) {
            Modal.confirm({
                title: <Text type="danger">Sustitución de archivo</Text>,
                icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
                content: "¿Esta ficha ya tiene un archivo asignado. Quiere sustituirlo?",
                okText: "Sí, sustituir",
                cancelText: "Cancelar",
                okButtonProps: { danger: true },
                onOk: () => handleUpload(file),
            });
            return false; // Prevent auto upload
        }
        handleUpload(file);
        return false; // Manual upload
    };

    if (variant === "compact") {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload
                    accept={accept}
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined />} loading={uploading} size="small">
                        {uploading ? "Subiendo..." : "Cargar"}
                    </Button>
                </Upload>
            </div>
        );
    }

    return (
        <div style={{ marginBottom: '16px', padding: '12px', border: '1px dashed #d9d9d9', borderRadius: '8px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>{label}</Text>
                <Upload
                    accept={accept}
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined />} loading={uploading} block>
                        {uploading ? "Subiendo..." : "Cargar nuevo archivo"}
                    </Button>
                </Upload>
                {initialUrl && (
                    <Text type="secondary" style={{ fontSize: '11px', display: 'block', wordBreak: 'break-all' }}>
                        Actual: {initialUrl}
                    </Text>
                )}
            </Space>
        </div>
    );
};
