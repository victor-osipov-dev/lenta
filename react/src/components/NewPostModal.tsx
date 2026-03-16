import { useState } from "react";

interface NewPostModalProps {
    onClose: () => void;
    onPublish: (text: string) => void;
}

export function NewPostModal({ onClose, onPublish }: NewPostModalProps) {
    const [text, setText] = useState("");

    return (
        <div
            className="ff-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="ff-modal">
                <h2>📝 Новый пост</h2>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Расскажи что-нибудь интересное…"
                    autoFocus
                />
                <div className="ff-modal-actions">
                    <button className="ff-btn-cancel" onClick={onClose}>
                        Отмена
                    </button>
                    <button
                        className="ff-btn-publish"
                        disabled={!text.trim()}
                        onClick={() => {
                            onPublish(text.trim());
                            onClose();
                        }}
                    >
                        Опубликовать 🌟
                    </button>
                </div>
            </div>
        </div>
    );
}
