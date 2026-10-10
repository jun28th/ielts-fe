import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { Tooltip } from "antd";
import { useTranslations } from "next-intl";

type Format = "bold" | "italic" | "underline";

const FORMATS: { format: Format; label: string; className: string }[] = [
    { format: "bold", label: "B", className: "font-bold" },
    { format: "italic", label: "I", className: "italic" },
    { format: "underline", label: "U", className: "underline" },
];

// vùng chọn tính bằng vị trí ký tự; start === end nghĩa là chỉ có con trỏ, không bôi đen
type SelectionOffsets = { start: number; end: number };

// (nút, độ lệch) trong DOM -> vị trí tính từ đầu editor
function toIndex(root: HTMLElement, node: Node, offset: number) : number {
    const range = document.createRange();
    // đoạn này ban đầu phủ toàn bộ editor (điểm đầu = đầu editor)
    range.selectNodeContents(root);
    // kéo điểm cuối về đúng chỗ con trỏ
    range.setEnd(node, offset);
    // đếm số ký tự nằm trong đoạn
    return range.toString().length;
}

// vùng chọn hiện tại; null nếu con trỏ không nằm trong editor
function getSelectionOffsets(root: HTMLElement) : SelectionOffsets | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;

    return {
        start: toIndex(root, range.startContainer, range.startOffset),
        end: toIndex(root, range.endContainer, range.endOffset),
    };
}

// vị trí tính từ đầu editor -> (nút, độ lệch) trong DOM
function toDomPosition(root: HTMLElement, index: number) : { node: Node; offset: number }  {
    // TreeWalker, một công cụ có sẵn của trình duyệt để duyệt cây DOM.
    // NodeFilter.SHOW_TEXT bảo nó bỏ qua các thẻ, chỉ dừng ở nút văn bản.
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    // còn phải đi thêm bao nhiêu ký tự nữa
    let remaining = index;
    // nút văn bản cuối cùng đã đi qua
    let last: Text | null = null;

    while (walker.nextNode()) {
        const text = walker.currentNode as Text;

        // Vị trí rơi vào nút này. Dùng <= để ở ranh giới hai nút, con trỏ thuộc về cuối nút TRƯỚC
        if (remaining <= text.length) {
            return { node: text, offset: remaining }
        }
        // chưa tới: trừ độ dài nút này rồi đi tiếp
        remaining -= text.length;
        last = text;
    }

    // Vị trí vượt quá độ dài bài: đặt ở cuối. Bài rỗng (không có nút văn bản nào): đặt ở đầu editor.
    return last ? { node: last, offset: last.length } : { node: root, offset: 0 };
}

// đặt vùng chọn theo vị trí ký tự (start === end thì chỉ đặt con trỏ)
function setSelectionOffsets(root: HTMLElement, start: number, end: number) {
    const selection = window.getSelection();
    if (!selection) return;

    const from = toDomPosition(root, start);
    const to = toDomPosition(root, end);

    const range = document.createRange();
    range.setStart(from.node, from.offset);
    range.setEnd(to.node, to.offset);

    // bỏ vùng chọn cũ
    selection.removeAllRanges();
    // đặt vùng chọn mới
    selection.addRange(range);
}

export default function WritingEditor() {
    const t = useTranslations("WritingEditor");

    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = editorRef.current;
        if (!root) return;

        const doc = new Y.Doc();
        const ytext = doc.getText("content");

        // true trong lúc bộ gõ đang soạn dở một chữ (chữ đang được gạch chân)
        let isComposing = false;

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

            // "\n" ở cuối bài không tự tạo ra dòng trống nhìn thấy được,
            // nên thêm <br> để có một dòng cho con trỏ đứng
            if (ytext.toString().endsWith("\n")) {
                fragment.append(document.createElement("br"));
            }

            root.replaceChildren(fragment);
        };

        ytext.insert(0, "Hello ");
        ytext.insert(6, "bold", { bold: true });
        ytext.insert(10, " world", { bold: null });

        // đang soạn thì không vẽ lại, vì vẽ lại sẽ xoá mất chữ bộ gõ đang soạn dở
        ytext.observe(() => {
            if (!isComposing) render();
        });

        render();

        // định dạng của ký tự tại vị trí index ({} nếu ký tự đó không có định dạng nào)
        const formatAt = (index: number): Record<string, unknown> => {
            let position = 0; // vị trí bắt đầu của đoạn đang xét
            for (const op of ytext.toDelta()) {
                const length = (op.insert as string).length;
                // index nằm trong đoạn này -> trả về định dạng của đoạn
                if (index < position + length) return { ...(op.attributes ?? {}) };
                position += length;
            }
            return {};
        };

        // thay vùng chọn bằng một đoạn chữ (không bôi đen thì chỉ là chèn), rồi đặt lại con trỏ.
        // Dùng chung cho gõ chữ, Enter và dán.
        const replaceSelection = (selection: SelectionOffsets, text: string) => {
            const { start, end } = selection;

            // đang thay thế một đoạn -> chữ mới lấy định dạng của ký tự ĐẦU đoạn bị thay.
            // Chỉ chèn (không bôi đen) -> undefined, để Yjs tự lấy theo ký tự đứng trước.
            // Phải hỏi TRƯỚC khi xoá, vì xoá xong thì ký tự đó không còn.
            const attributes = end > start ? formatAt(start) : undefined;

            // Gom xoá + chèn thành một lần thay đổi, để render() chỉ chạy một lần
            doc.transact(() => {
                // đang bôi đen: xoá đoạn đó trước
                if (end > start) ytext.delete(start, end - start);
                ytext.insert(start, text, attributes);
            });

            // đặt con trỏ ngay sau chữ vừa chèn
            const caret = start + text.length;
            setSelectionOffsets(root, caret, caret);
        };

        // trình duyệt đã tự sửa DOM (bộ gõ vừa soạn xong) -> tìm chỗ khác nhau và ghi vào ytext
        const syncFromDom = () => {
            const oldText = ytext.toString();      // ytext đang nghĩ bài là thế này
            const newText = root.textContent ?? ""; // màn hình thực tế đang là thế này

            // nhớ vị trí con trỏ trước khi vẽ lại (đọc từ DOM hiện tại, tức là theo chữ mới)
            const caret = getSelectionOffsets(root);

            if (newText === oldText) {
                // Chữ không đổi, nhưng bộ gõ có thể đã làm xáo trộn các nút: vẽ lại cho sạch
                render();
            } else {
                // Đếm số ký tự giống nhau ở ĐẦU
                let prefix = 0;
                const max = Math.min(oldText.length, newText.length);
                while (prefix < max && oldText[prefix] === newText[prefix]) prefix++;

                // Đếm số ký tự giống nhau ở CUỐI (không lấn sang phần đầu đã đếm)
                let suffix = 0;
                while (
                    suffix < max - prefix &&
                    oldText[oldText.length - 1 - suffix] === newText[newText.length - 1 - suffix]
                ) suffix++;

                // Phần ở giữa: bên cũ là đoạn bị bỏ, bên mới là đoạn được thêm
                const removedLength = oldText.length - prefix - suffix;
                const inserted = newText.slice(prefix, newText.length - suffix);

                // cùng quy tắc với replaceSelection. Có đoạn bị thay -> lấy định dạng đầu đoạn đó
                const attributes = removedLength > 0 ? formatAt(prefix) : undefined;

                // ytext đổi -> observe chạy -> render() (lúc này isComposing đã là false)
                doc.transact(() => {
                    if (removedLength > 0) ytext.delete(prefix, removedLength);
                    if (inserted) ytext.insert(prefix, inserted, attributes);
                });
            }

            if (caret) setSelectionOffsets(root, caret.start, caret.end);
        };

        // gõ chữ -> chặn trình duyệt, tự ghi vào ytext, rồi đặt lại con trỏ
        const onBeforeInput = (event: InputEvent) => {
            // đang soạn thì để yên cho bộ gõ làm việc (đằng nào cũng không chặn được)
            if (isComposing || event.isComposing || event.inputType.includes("Composition")) return;

            const selection = getSelectionOffsets(root);
            if (!selection) return;

            // --- Gõ chữ ---
            if (event.inputType === "insertText" && event.data) {
                event.preventDefault(); // chặn trình duyệt tự chèn vào DOM
                replaceSelection(selection, event.data);
                return;
            }

            // --- Enter và Shift+Enter đều là chèn ký tự xuống dòng ---
            if (event.inputType === "insertParagraph" || event.inputType === "insertLineBreak") {
                event.preventDefault(); // chặn trình duyệt tự chèn <div> / <br>
                replaceSelection(selection, "\n");
                return;
            }

            // --- Dán, chỉ lấy văn bản thuần để không kéo theo định dạng từ nơi khác ---
            if (event.inputType === "insertFromPaste") {
                event.preventDefault(); // chặn trình duyệt tự dán (kèm HTML) vào DOM

                const pasted = event.dataTransfer?.getData("text/plain") ?? "";
                // Windows xuống dòng bằng "\r\n": đổi hết về "\n"
                const text = pasted.replace(/\r\n?/g, "\n");

                if (text) replaceSelection(selection, text);
                return;
            }

            // --- Kéo thả chữ: chưa hỗ trợ. Phải chặn TRƯỚC nhánh xoá vì deleteByDrag cũng bắt đầu bằng "delete" ---
            if (event.inputType === "deleteByDrag" || event.inputType === "insertFromDrop") {
                event.preventDefault();
                return;
            }

            // --- Xoá (Backspace, Delete, xoá cả từ, xoá cả dòng, cắt...) ---
            if (event.inputType.startsWith("delete")) {
                let { start, end } = selection;

                // hỏi trình duyệt nó định xoá đoạn nào
                const [target] = event.getTargetRanges();
                if (target) {
                    start = toIndex(root, target.startContainer, target.startOffset);
                    end = toIndex(root, target.endContainer, target.endOffset);
                }

                // trình duyệt không cho đoạn nào, hoặc cho đoạn rỗng: tự lùi/tiến một ký tự
                if (start === end) {
                    start = end = selection.start;
                    if (event.inputType === "deleteContentBackward") start = Math.max(0, start - 1);
                    if (event.inputType === "deleteContentForward") end = Math.min(ytext.length, end + 1);
                }

                event.preventDefault(); // chặn trình duyệt tự xoá trong DOM

                if (end > start) {
                    ytext.delete(start, end - start);
                    // con trỏ về đầu đoạn vừa xoá
                    setSelectionOffsets(root, start, start);
                }
                return;
            }

            // --- Mọi thao tác chưa hỗ trợ (định dạng, hoàn tác của trình duyệt...): chặn, để DOM không bao giờ lệch khỏi ytext ---
            event.preventDefault();
        };

        // bộ gõ bắt đầu soạn một chữ
        const onCompositionStart = () => {
            isComposing = true;
        };

        // bộ gõ soạn xong -> DOM đã có chữ hoàn chỉnh, ghi nó vào ytext
        const onCompositionEnd = () => {
            isComposing = false;
            syncFromDom();
        };

        // lưới an toàn. Sau mỗi lần DOM đổi mà không phải đang soạn, kiểm tra lại cho khớp
        // (Safari còn sửa DOM thêm một lần ngay sau compositionend)
        const onInput = () => {
            if (!isComposing && (root.textContent ?? "") !== ytext.toString()) syncFromDom();
        };

        root.addEventListener("beforeinput", onBeforeInput);
        root.addEventListener("compositionstart", onCompositionStart);
        root.addEventListener("compositionend", onCompositionEnd);
        root.addEventListener("input", onInput);

        // (tạm): gõ dump() trong console để xem ytext đang chứa gì
        (window as unknown as { dump: () => void }).dump = () => {
            console.log(JSON.stringify(ytext.toString()));
        };

        return () => {
            root.removeEventListener("beforeinput", onBeforeInput);
            root.removeEventListener("compositionstart", onCompositionStart);
            root.removeEventListener("compositionend", onCompositionEnd);
            root.removeEventListener("input", onInput);
            doc.destroy();
        };
    }, []);

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
                className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap p-5 leading-relaxed text-fg outline-none empty:before:text-muted/70 empty:before:content-[attr(data-placeholder)]"
            />
        </div>
    );
}