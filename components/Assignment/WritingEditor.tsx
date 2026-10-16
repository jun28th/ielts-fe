"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { Placeholder, Selection as BlurSelection } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Popover, Spin, Tooltip } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import CheckCircleIcon from "../Icons/CheckCircleIcon";
import CorrectionMenu from "./CorrectionMenu";
import { CorrectionMark } from "./CorrectionMark";

type Format = "bold" | "italic" | "underline" | "strike";

type SaveStatus = "idle" | "saving" | "saved";

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

const CARET_COLORS = ["#d4380d", "#1677ff", "#389e0d", "#c41d7f", "#531dab", "#d48806", "#08979c", "#cf1322"];

const DEFAULT_TEXT_COLOR = "var(--color-fg)";

const COLLAB_URL = process.env.NEXT_PUBLIC_COLLAB_URL ?? "ws://localhost:1234";

const BUBBLE_MENU_KEY = "bubbleMenu";

const BUTTON_BASE_CLASS = "flex size-8 items-center justify-center rounded-md text-base transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const BUTTON_ACTIVE_CLASS = "bg-highlight text-fg hover:bg-highlight-hover";
const BUTTON_INACTIVE_CLASS = "text-fg hover:bg-highlight-bg hover:text-highlight-fg hover:inset-ring hover:inset-ring-highlight/60 active:bg-highlight/40";

const SWATCH_BASE_CLASS = "flex size-8 items-center justify-center rounded-md transition-colors";
const SWATCH_ACTIVE_CLASS = "bg-highlight-bg inset-ring-2 inset-ring-highlight";
const SWATCH_INACTIVE_CLASS = "hover:bg-highlight-bg";

const EDITOR_CLASS = [
    "flex-1 p-5 leading-relaxed text-fg outline-none",
    "selection:bg-highlight/40",
    "[&_p+p]:mt-2",
    "[&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
    "[&_p.is-editor-empty:first-child::before]:text-muted/70",
    "[&_p.is-editor-empty:first-child::before]:pointer-events-none",
    "[&_p.is-editor-empty:first-child::before]:float-left",
    "[&_p.is-editor-empty:first-child::before]:h-0",
].join(" ");

function pickCaretColor(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
    }
    return CARET_COLORS[hash % CARET_COLORS.length];
}

type WritingEditorProps = {
    documentName: string;
    currentUser: { id: string; name: string };
    readOnly?: boolean;
    isCorrection?: boolean;
};

export default function WritingEditor({ documentName, currentUser, readOnly = false, isCorrection = false }: WritingEditorProps) {
    const t = useTranslations("WritingEditor");
    const placeholder = t("placeholder");

    const [isColorOpen, setIsColorOpen] = useState<boolean>(false);
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [isSelecting, setIsSelecting] = useState<boolean>(false);

    const doc = useMemo(() => new Y.Doc(), []);

    useEffect(() => {
        const instance = new HocuspocusProvider({
            url: COLLAB_URL,
            name: documentName,
            document: doc,
            onSynced: () => {
                setProvider(instance);
                setSaveStatus((status) => (status === "idle" ? "saved" : status));
            },
            onStateless: ({ payload }) => {
                try {
                    const message = JSON.parse(payload);
                    if (message.type === "saved") setSaveStatus("saved");
                } catch {}
            },
        });

        const handleUpdate = (_update: Uint8Array, origin: unknown) => {
            if (origin !== instance) setSaveStatus("saving");
        };

        doc.on("update", handleUpdate);

        return () => {
            doc.off("update", handleUpdate);
            instance.destroy();
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
            BlurSelection.configure({ className: "bg-highlight/40" }),
            TextStyle,
            Color,
            CorrectionMark,
            Collaboration.configure({ document: doc }),
            ...(provider
                ? [
                    CollaborationCaret.configure({
                        provider,
                        user: {
                            name: currentUser.name,
                            color: pickCaretColor(currentUser.id),
                        },
                    }),
                ]
                : []),
        ],
        [placeholder, doc, provider, currentUser.id, currentUser.name]
    );

    const editor = useEditor(
        {
            extensions,
            editable: !readOnly,
            immediatelyRender: false,
            enableInputRules: false,
            enablePasteRules: false,
            editorProps: {
                attributes: { class: EDITOR_CLASS },
                handleDOMEvents: {
                    mousedown: (_view, event) => {
                        if (event.button !== 0) return false;
                        setIsSelecting(true);
                        document.addEventListener("mouseup", () => setIsSelecting(false), { once: true });
                        return false;
                    },
                },
            },
        },
        [extensions, readOnly]
    );

    useEffect(() => {
        if (!editor || isSelecting || !isCorrection) return;
        editor.commands.setMeta(BUBBLE_MENU_KEY, "updatePosition");
    }, [editor, isSelecting, isCorrection]);

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
                                disabled={!editor || readOnly}
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
                        open={isColorOpen && !readOnly}
                        onOpenChange={setIsColorOpen}
                    >
                        <button
                            type="button"
                            disabled={!editor || readOnly}
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

                {!readOnly && saveStatus !== "idle" && (
                    <span className={`ml-auto flex items-center gap-1.5 text-sm ${saveStatus === "saving" ? "text-accent" : "text-success"}`}>
                        {saveStatus === "saving" ? (
                            <>
                                <Spin size="small" />
                                {t("saveStatus.saving")}
                            </>
                        ) : (
                            <>
                                <CheckCircleIcon width={14} height={14} />
                                {t("saveStatus.saved")}
                            </>
                        )}
                    </span>
                )}
            </div>

            {editor && isCorrection && (
                <BubbleMenu
                    editor={editor}
                    pluginKey={BUBBLE_MENU_KEY}
                    options={{ placement: "bottom", offset: 8 }}
                    className="z-50"
                >
                    {!isSelecting && (
                        <div className="rounded-lg border border-border bg-bg shadow-lg">
                            <CorrectionMenu editor={editor} />
                        </div>
                    )}
                </BubbleMenu>
            )}

            <EditorContent editor={editor} className="flex flex-1 flex-col" />
        </div>
    );
}