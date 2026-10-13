"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Popover, Tooltip } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";

type Format = "bold" | "italic" | "underline" | "strike";

const FORMATS: { format: Format; label: string; className: string }[] = [
    { format: "bold", label: "B", className: "font-bold" },
    { format: "italic", label: "I", className: "italic" },
    { format: "underline", label: "U", className: "underline" },
    { format: "strike", label: "S", className: "line-through" },
];

const COLORS: (string | null)[] = [
    null,
    "#ff4d4f",
    "#2a4fa8",
    "#237804",
    "#d97706",
    "#ffc200"
];

const DEFAULT_TEXT_COLOR = "var(--color-fg)";

const COLLAB_URL = process.env.NEXT_PUBLIC_COLLAB_URL ?? "ws://localhost:1234";

const BUTTON_BASE_CLASS = "flex size-8 items-center justify-center rounded-md text-base transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const BUTTON_ACTIVE_CLASS = "bg-highlight text-fg hover:bg-highlight-hover";
const BUTTON_INACTIVE_CLASS = "text-fg hover:bg-highlight-bg hover:text-highlight-fg hover:inset-ring hover:inset-ring-highlight/60 active:bg-highlight/40";

const SWATCH_BASE_CLASS = "flex size-8 items-center justify-center rounded-md transition-colors";
const SWATCH_ACTIVE_CLASS = "bg-highlight-bg inset-ring-2 inset-ring-highlight";
const SWATCH_INACTIVE_CLASS = "hover:bg-highlight-bg";

const EDITOR_CLASS = [
    "flex-1 p-5 leading-relaxed text-fg outline-none",
    "[&_p+p]:mt-2",
    "[&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
    "[&_p.is-editor-empty:first-child::before]:text-muted/70",
    "[&_p.is-editor-empty:first-child::before]:pointer-events-none",
    "[&_p.is-editor-empty:first-child::before]:float-left",
    "[&_p.is-editor-empty:first-child::before]:h-0",
].join(" ");

type WritingEditorProps = {
    documentName: string;
};

export default function WritingEditor({ documentName }: WritingEditorProps) {
    const t = useTranslations("WritingEditor");
    const placeholder = t("placeholder");

    const [isColorOpen, setIsColorOpen] = useState<boolean>(false);

    const doc = useMemo(() => new Y.Doc(), []);

    useEffect(() => {
        const provider = new HocuspocusProvider({
            url: COLLAB_URL,
            name: documentName,
            document: doc,
        });

        return () => {
            provider.destroy();
        };
    }, [doc, documentName]);

    const extensions = useMemo(
        () => [
            StarterKit.configure({
                heading: false,
                blockquote: false,
                bulletList: false,
                orderedList: false,
                listItem: false,
                listKeymap: false,
                codeBlock: false,
                code: false,
                horizontalRule: false,
                link: false,
                undoRedo: false,
            }),
            Placeholder.configure({ placeholder }),
            TextStyle,
            Color,
            Collaboration.configure({ document: doc }),
        ],
        [placeholder, doc]
    );

    const editor = useEditor(
        {
            extensions,
            immediatelyRender: false,
            enableInputRules: false,
            enablePasteRules: false,
            editorProps: {
                attributes: { class: EDITOR_CLASS },
            },
        },
        [extensions]
    );

    // Hàm selector được gọi sau mỗi thay đổi của editor; component chỉ vẽ lại khi kết quả khác lần trước.
    const editorState = useEditorState({
        editor,
        selector: ({ editor }) => ({
            bold: editor?.isActive("bold") ?? false,
            italic: editor?.isActive("italic") ?? false,
            underline: editor?.isActive("underline") ?? false,
            strike: editor?.isActive("strike") ?? false,
            color: (editor?.getAttributes("textStyle").color as string | undefined) ?? null,
        }),
    });

    const currentColor = editorState?.color ?? null;

    const applyColor = (value: string | null) => {
        if (!editor) return;
        if (value) editor.chain().focus().setColor(value).run();
        else editor.chain().focus().unsetColor().run();
        setIsColorOpen(false);
    };

    const colorPalette = (
        <div className="flex items-center gap-1">
            {COLORS.map((value) => {
                const isActive = currentColor === value;

                return (
                    <button
                        key={value ?? "default"}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyColor(value)}
                        className={`${SWATCH_BASE_CLASS} ${isActive ? SWATCH_ACTIVE_CLASS : SWATCH_INACTIVE_CLASS}`}
                    >
                        <span
                            className="size-5 rounded-full"
                            style={{ backgroundColor: value ?? DEFAULT_TEXT_COLOR }}
                        />
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="flex min-h-180 flex-1 flex-col border border-border">
            <div className="flex items-center gap-1 border-b border-border bg-surface px-3 py-2">
                {FORMATS.map(({ format, label, className }) => {
                    const isActive = editorState?.[format] ?? false;

                    return (
                        <Tooltip key={format} title={t(`formats.${format}`)} placement="top">
                            <button
                                type="button"
                                disabled={!editor}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => editor?.chain().focus().toggleMark(format).run()}
                                className={`${BUTTON_BASE_CLASS} ${className} ${isActive ? BUTTON_ACTIVE_CLASS : BUTTON_INACTIVE_CLASS}`}
                            >
                                {label}
                            </button>
                        </Tooltip>
                    );
                })}

                <Tooltip title={t("textColor")} placement="top">
                    <Popover
                        content={colorPalette}
                        trigger="click"
                        placement="bottomLeft"
                        open={isColorOpen}
                        onOpenChange={setIsColorOpen}
                    >
                        <button
                            type="button"
                            disabled={!editor}
                            onMouseDown={(e) => e.preventDefault()}
                            className={`${BUTTON_BASE_CLASS} flex-col gap-0.5 ${isColorOpen ? "bg-highlight-bg text-fg inset-ring inset-ring-highlight/60" : BUTTON_INACTIVE_CLASS}`}
                        >
                            <span className="text-sm font-semibold leading-none">A</span>
                            <span
                                className="h-1 w-4 rounded-sm"
                                style={{ backgroundColor: currentColor ?? DEFAULT_TEXT_COLOR }}
                            />
                        </button>
                    </Popover>
                </Tooltip>
            </div>

            <EditorContent editor={editor} className="flex flex-1 flex-col" />
        </div>
    );
}