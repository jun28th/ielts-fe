import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { Tooltip } from "antd";
import { useTranslations } from "next-intl";

type Format = "bold" | "italic" | "underline";

export type Person = { id: string; name: string };

type WritingEditorProps = {
    assignmentId: string;
    /** Đang mở bài của ai */
    ownerId: string;
    /** Người đang dùng máy này: khai với server để được đưa vào danh sách */
    me: Person;
    /** Server báo danh sách người mới nhất của assignment -> đưa lên cho page */
    onPeopleChange: (people: Person[]) => void;
}

const FORMATS: { format: Format; label: string; className: string }[] = [
    { format: "bold", label: "B", className: "font-bold" },
    { format: "italic", label: "I", className: "italic" },
    { format: "underline", label: "U", className: "underline" },
];

const WS_URL = "ws://localhost:8080/ws/writing";

export default function WritingEditor({ assignmentId, ownerId, me, onPeopleChange } : WritingEditorProps) {
    const t = useTranslations("WritingEditor");

    const editorRef = useRef<HTMLDivElement>(null);

    // Giữ callback mới nhất trong ref, để nó đổi thì effect bên dưới không chạy lại (không mất kết nối)
    const onPeopleChangeRef = useRef(onPeopleChange);
    useEffect(() => {
        onPeopleChangeRef.current = onPeopleChange;
    });

    useEffect(() => {
        const root = editorRef.current;
        if (!root) return; 
    
        const doc = new Y.Doc();
        const ytext = doc.getText("content");
    
        const render = () => {
            const fragment = document.createDocumentFragment();
            for (const op of ytext.toDelta()) {
                const span = document.createElement("span");
                span.textContent = op.insert;
                if (op.attributes?.bold) span.style.fontWeight = "700";
                if (op.attributes?.italic) span.style.fontStyle = "italic";
                if (op.attributes?.underline) span.style.textDecoration = "underline";
                fragment.append(span);
            }
            root.replaceChildren(fragment);
        };
    
        ytext.observe(render);
        render();
    
        // Vào phòng của ownerId, đồng thời khai mình là ai
        const query = `userId=${encodeURIComponent(me.id)}&name=${encodeURIComponent(me.name)}`;
        const ws = new WebSocket(`${WS_URL}/${assignmentId}/${ownerId}?${query}`);
        ws.binaryType = "arraybuffer";
        ws.onopen = () => console.log("[collab] connected", `${assignmentId}/${ownerId}`);
        ws.onclose = () => console.log("[collab] closed", `${assignmentId}/${ownerId}`);

        // Frame chữ = JSON danh sách người đã mở assignment này
        ws.onmessage = (event) => {
            if (typeof event.data === "string") {
                onPeopleChangeRef.current(JSON.parse(event.data) as Person[]);
            }
        };
    
        return () => {
            ws.close();
            doc.destroy();
        };
    }, [assignmentId, ownerId, me.id, me.name]);

    return (
        <div className="flex h-full flex-col border border-border">
            <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
                {FORMATS.map(({ format, label, className }) => (
                    <Tooltip key={format} title={t(`formats.${format}`)} placement="top">
                        <button
                            type="button"
                            aria-label={t(`formats.${format}`)}
                            onMouseDown={(e) => e.preventDefault()}
                            className={`flex size-8 items-center justify-center rounded-lg text-base text-fg transition-colors hover:bg-accent-bg active:bg-border ${className}`}
                        >
                            {label}
                        </button>
                    </Tooltip>
                ))}
            </div>

            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                data-placeholder={t("placeholder")}
                className="min-h-0 flex-1 overflow-y-auto p-5 leading-relaxed text-fg outline-none empty:before:text-muted/70 empty:before:content-[attr(data-placeholder)]"
            />
        </div>
    );
}