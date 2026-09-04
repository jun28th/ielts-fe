"use client";

import Button from "@/components/Button";
import { permissionsApi } from "@/lib/api/permissions-client";
import { rolesApi } from "@/lib/api/roles-client";
import { Permission, Role } from "@/types/role-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableColumnsType, TableProps, Tag, Transfer, TransferProps } from "antd";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface PermissionItem {
    key: string;
    code: string;
    tag: string;
    name: string;
    description: string;
}

const TAG_COLORS = [
    "blue", "cyan", "green", "gold", "purple", "magenta", "volcano", "geekblue",
];

function getTag(code: string): string {
    const [, ...rest] = code.split("_");
    return rest.length > 0 ? rest.join("_") : code;
}

function getTagColor(tag: string): string {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
    }
    return TAG_COLORS[hash % TAG_COLORS.length];
}

type TableTransferProps = TransferProps<PermissionItem> & {
    dataSource: PermissionItem[];
    leftColumns: TableColumnsType<PermissionItem>;
    rightColumns: TableColumnsType<PermissionItem>;
};

function TableTransfer({ leftColumns, rightColumns, ...restProps }: TableTransferProps) {
    return (
        <Transfer style={{ width: "100%" }} {...restProps}>
            {({ direction, filteredItems, onItemSelect, onItemSelectAll, selectedKeys, disabled }) => {
                const cols = direction === "left" ? leftColumns : rightColumns;

                const rowSelection: TableProps<PermissionItem>["rowSelection"] = {
                    selectedRowKeys: selectedKeys,
                    getCheckboxProps: () => ({ disabled }),
                    onChange: (keys) => onItemSelectAll(keys as string[], "replace"),
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
                };

                return (
                    <Table<PermissionItem>
                        rowSelection={rowSelection}
                        columns={cols}
                        dataSource={filteredItems}
                        pagination={{ pageSize: 8 }}
                        onRow={({ key }) => ({
                            onClick: () => {
                                if (disabled) return;
                                onItemSelect(key, !selectedKeys.includes(key));
                            },
                        })}
                    />
                );
            }}
        </Transfer>
    );
}

function RolePermissionTransfer({ role, permissions }: { role: Role; permissions: Permission[] }) {
    const t = useTranslations("AdminAccessControlPage");
    const queryClient = useQueryClient();

    const originalKeys = useMemo(() => (role.permissions ?? []).map((p) => p.id), [role]);
    const [targetKeys, setTargetKeys] = useState<string[]>(originalKeys);

    const dataSource = useMemo<PermissionItem[]>(
        () =>
            permissions.map((p) => ({
                key: p.id,
                code: p.code,
                tag: getTag(p.code),
                name: p.name,
                description: p.description,
            })),
        [permissions],
    );

    const tagFilters = useMemo(
        () =>
            Array.from(new Set(dataSource.map((item) => item.tag)))
                .sort()
                .map((tag) => ({ text: tag, value: tag })),
        [dataSource],
    );

    const columns = useMemo<TableColumnsType<PermissionItem>>(
        () => [
            { title: t("columns.code"), dataIndex: "code" },
            {
                title: t("columns.tag"),
                dataIndex: "tag",
                width: 140,
                filters: tagFilters,
                onFilter: (value, record) => record.tag === value,
                render: (tag: string) => (
                    <Tag color={getTagColor(tag)} style={{ marginInlineEnd: 0 }}>
                        {tag}
                    </Tag>
                ),
            },
            { title: t("columns.name"), dataIndex: "name" },
            { title: t("columns.description"), dataIndex: "description" },
        ],
        [t, tagFilters],
    );

    const { mutate, isPending } = useMutation({
        mutationFn: (keys: string[]) => rolesApi.update(role.id, { permissionIds: keys }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
    });

    const isDirty =
        targetKeys.length !== originalKeys.length ||
        targetKeys.some((id) => !originalKeys.includes(id));

    return (
        <>
            <TableTransfer
                disabled={isPending}
                dataSource={dataSource}
                targetKeys={targetKeys}
                onChange={(next) => setTargetKeys(next as string[])}
                showSearch
                showSelectAll={false}
                filterOption={(input, item) => {
                    const q = input.toLowerCase();
                    return (
                        item.code.toLowerCase().includes(q) ||
                        item.tag.toLowerCase().includes(q) ||
                        item.name.toLowerCase().includes(q)
                    );
                }}
                leftColumns={columns}
                rightColumns={columns}
                titles={[t("transfer.available"), t("transfer.assigned")]}
                locale={{
                    searchPlaceholder: t("transfer.searchPlaceholder"),
                    itemUnit: t("transfer.itemUnit"),
                    itemsUnit: t("transfer.itemsUnit"),
                    notFoundContent: t("transfer.notFound"),
                }}
            />

            <div className="mt-4 flex gap-2 justify-end">
                <Button
                    label={t("save")}
                    disabled={!isDirty}
                    loading={isPending}
                    onClick={() => mutate(targetKeys)}
                />
                <Button
                    label={t("cancel")}
                    variant="secondary"
                    disabled={!isDirty || isPending}
                    onClick={() => setTargetKeys(originalKeys)}
                />
            </div>
        </>
    );
}

export default function AccessControlPage() {
    const t = useTranslations("AdminAccessControlPage");
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

    const { data: roles, isLoading: isRolesLoading, error } = useQuery({
        queryKey: ["roles"],
        queryFn: rolesApi.list,
    });

    const { data: permissions, isLoading: isPermissionsLoading } = useQuery({
        queryKey: ["permissions"],
        queryFn: permissionsApi.list,
    });

    const selectedRole = roles?.find((role) => role.id === selectedRoleId) ?? roles?.[0];

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif font-bold text-2xl mb-1">{t("title")}</h1>
                    <p className="text-muted text-sm">{t("subtitle")}</p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-[200px_minmax(0,1fr)] gap-6">
                <div className="h-fit rounded-xl border border-border bg-bg">
                    <div className="border-b border-border px-4 py-3">
                        <p className="text-sm font-semibold text-fg">{t("rolesHeading")}</p>
                    </div>

                    {isRolesLoading && <p className="px-4 py-3 text-sm text-muted">{t("loading")}</p>}

                    {error && <p className="px-4 py-3 text-sm text-red-500">{t("rolesError")}</p>}

                    {roles?.length === 0 && (
                        <p className="px-4 py-3 text-sm text-muted">{t("noRoles")}</p>
                    )}

                    <ul>
                        {roles?.map((role) => (
                            <li key={role.id}>
                                <button
                                    onClick={() => setSelectedRoleId(role.id)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent-bg ${
                                        role.id === selectedRole?.id ? "bg-accent-bg font-medium" : ""
                                    }`}
                                >
                                    {role.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-xl border border-border bg-bg">
                    <div className="border-b border-border px-4 py-3">
                        <p className="text-sm font-semibold text-fg">
                            {t("permissionsFor")}{" "}
                            <span className="text-accent-active">{selectedRole?.name ?? ""}</span>
                        </p>
                    </div>

                    {selectedRole && permissions ? (
                        <div className="p-4">
                            <RolePermissionTransfer
                                key={selectedRole.id}
                                role={selectedRole}
                                permissions={permissions}
                            />
                        </div>
                    ) : (
                        <p className="px-4 py-3 text-sm text-muted">
                            {isRolesLoading || isPermissionsLoading ? t("loading") : t("noRoles")}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}