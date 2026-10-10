"use client";

import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Tooltip } from "antd";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

type Format = "bold" | "italic" | "underline" | "strike";

const FORMATS: { format: Format; label: string; className: string }[] = [
    { format: "bold", label: "B", className: "font-bold" },
    { format: "italic", label: "I", className: "italic" },
    { format: "underline", label: "U", className: "underline" },
    { format: "strike", label: "S", className: "line-through" },
];

const BUTTON_BASE_CLASS = "flex size-8 items-center justify-center rounded-md text-base transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const BUTTON_ACTIVE_CLASS = "bg-highlight text-fg hover:bg-highlight-hover";
const BUTTON_INACTIVE_CLASS = "text-fg hover:bg-highlight-bg hover:text-highlight-fg hover:inset-ring hover:inset-ring-highlight/60 active:bg-highlight/40";

// class cho vùng gõ được. Thẻ này do Tiptap tự tạo nên phải đưa class vào qua editorProps.
// Viết thành các chuỗi đầy đủ để Tailwind nhận ra.
const EDITOR_CLASS = [
    // cao ít nhất bằng cả khung (để bấm vào khoảng trống vẫn đặt được con trỏ), lề, giãn dòng, màu chữ, bỏ viền khi đang gõ
    "flex-1 p-5 leading-relaxed text-fg outline-none",
    // khoảng cách giữa các đoạn văn: mọi <p> đứng sau một <p> khác có lề trên
    "[&_p+p]:mt-2",
    // chữ gợi ý. Khi bài trống, Tiptap gắn class is-editor-empty vào đoạn đầu tiên
    // và để nội dung gợi ý trong thuộc tính data-placeholder; các class dưới đây vẽ nó ra.
    "[&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]", // lấy chữ từ thuộc tính
    "[&_p.is-editor-empty:first-child::before]:text-muted/70",                    // màu nhạt
    "[&_p.is-editor-empty:first-child::before]:pointer-events-none",              // bấm xuyên qua được
    "[&_p.is-editor-empty:first-child::before]:float-left",                       // hai dòng này: không chiếm chỗ,
    "[&_p.is-editor-empty:first-child::before]:h-0",                              // để con trỏ nằm ngay đầu dòng
].join(" ");

export default function WritingEditor() {
    const t = useTranslations("WritingEditor");
    const placeholder = t("placeholder");

    // danh sách tính năng chuyển vào trong component vì cần chữ gợi ý lấy từ bản dịch.
    // useMemo giữ nguyên danh sách giữa các lần vẽ lại; chỉ tạo lại khi chữ gợi ý đổi.
    const extensions = useMemo(
        () => [
            // StarterKit gom sẵn nhiều extension.
            StarterKit.configure({
                heading: false,        // tiêu đề
                blockquote: false,     // trích dẫn
                bulletList: false,     // danh sách chấm đầu dòng
                orderedList: false,    // danh sách đánh số
                listItem: false,       // mục trong danh sách
                listKeymap: false,     // phím tắt của danh sách
                codeBlock: false,      // khối code
                code: false,           // chữ kiểu code
                horizontalRule: false, // đường kẻ ngang
                link: false,           // đường link
            }),
            // đánh dấu đoạn đầu tiên khi bài trống (việc hiện chữ do CSS ở EDITOR_CLASS lo)
            Placeholder.configure({ placeholder }),
        ],
        [placeholder]
    );

    // Tạo editor. Đối tượng này giữ nội dung bài và mọi lệnh để sửa nó.
    const editor = useEditor({
        extensions,
        // Next.js dựng trang trên server trước: đợi tới khi ở trình duyệt mới dựng editor
        immediatelyRender: false,
        // không tự đổi cú pháp kiểu Markdown thành định dạng khi gõ (ví dụ **chữ** thành chữ đậm)...
        enableInputRules: false,
        // ...và cũng không làm vậy với nội dung dán vào
        enablePasteRules: false,
        // gắn class lên thẻ vùng gõ được
        editorProps: {
            attributes: { class: EDITOR_CLASS },
        },
    });

    // định dạng nào đang bật tại con trỏ hoặc vùng bôi đen.
    // Hàm selector được gọi sau mỗi thay đổi của editor; component chỉ vẽ lại khi kết quả khác lần trước.
    const activeFormats = useEditorState({
        editor,
        selector: ({ editor }) => ({
            bold: editor?.isActive("bold") ?? false,
            italic: editor?.isActive("italic") ?? false,
            underline: editor?.isActive("underline") ?? false,
            strike: editor?.isActive("strike") ?? false
        }),
    });

    return (
        <div className="flex min-h-180 flex-1 flex-col border border-border">
            <div className="flex items-center gap-1 border-b border-border bg-surface px-3 py-2">
                {FORMATS.map(({ format, label, className }) => {
                    const isActive = activeFormats?.[format] ?? false;

                    return (
                        <Tooltip key={format} title={t(`formats.${format}`)} placement="top">
                            <button
                                type="button"
                                aria-pressed={isActive}
                                aria-label={t(`formats.${format}`)}
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
            </div>

            {/* Vùng soạn thảo do Tiptap vẽ. className ở đây gắn lên thẻ bọc ngoài: nó chiếm hết chỗ còn lại và tự cuộn khi bài dài */}
            <EditorContent editor={editor} className="flex flex-1 flex-col" />
        </div>
    );
}