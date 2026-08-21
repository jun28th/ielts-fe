"use client";

import { useTranslations } from "next-intl";

export default function AccessControlPage() {
    const t = useTranslations("AdminAccessControlPage");

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif font-bold text-2xl mb-1">
                        {t("title")}
					</h1>
					<p className="text-muted text-sm">
                        {t("subtitle")}
                    </p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-[260px_minmax(0,1fr)] gap-6">
                <div className="h-fit rounded-xl border border-border bg-bg">
                    <div className="border-b border-border px-4 py-3">
                        <p className="text-sm font-semibold text-fg">Vai trò</p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-bg">
                    <div className="border-b border-border px-4 py-3">
                        <p className="text-sm font-semibold text-fg">
                            Quyền của vai trò:{" "}
                            <span className="text-accent-active"></span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}