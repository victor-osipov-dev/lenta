import { useState } from "react";
import { Post } from "../consts";

interface PostCardProps {
    post: Post;
    index: number;
    onLike: (id: string) => void;
    onComment: (id: string, text: string) => void;
    onShare: () => void;
}

export function PostCard({
    post,
    onLike,
    onComment,
    onShare,
    index,
}: PostCardProps) {
    const [open, setOpen] = useState(post.comments.length > 0 && index === 3);
    const [draft, setDraft] = useState("");
    const [likeAnim, setLikeAnim] = useState(false);

    const handleLike = () => {
        setLikeAnim(true);
        onLike(post.id);
        setTimeout(() => setLikeAnim(false), 350);
    };

    const handleComment = () => {
        const t = draft.trim();
        if (!t) return;
        onComment(post.id, t);
        setDraft("");
    };

    return (
        <div
            className="ff-card"
            style={{ animationDelay: `${0.05 + index * 0.07}s` }}
        >
            {/* Accent bar */}
            <div className="ff-accent-bar" style={{ background: post.color }} />

            {/* Header */}
            <div className="ff-post-header">
                <div
                    className="ff-avatar"
                    style={{
                        background: post.color + "22",
                        border: `3px solid ${post.color}`,
                    }}
                >
                    {post.avatar}
                </div>
                <div>
                    <div className="ff-author">{post.author}</div>
                    <div className="ff-time">{post.time}</div>
                </div>
            </div>

            {/* Body */}
            <div className="ff-body">
                {post.text}
            </div>

            {/* Image */}
            {post.image && (
                <div className="ff-image" style={{ background: post.image.bg }}>
                    {post.image.label}
                </div>
            )}

            <hr className="ff-divider" />

            {/* Actions */}
            <div className="ff-actions">
                <button
                    className={`ff-action-btn${post.liked ? " liked" : ""}`}
                    onClick={handleLike}
                >
                    <span
                        className={`ff-icon${likeAnim ? " ff-like-pop" : ""}`}
                    >
                        {post.liked ? "❤️" : "🤍"}
                    </span>
                    <span className="ff-count">{post.likes}</span>
                </button>
                <button
                    className="ff-action-btn"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="ff-icon">💬</span>
                    <span className="ff-count">{post.comments.length}</span>
                </button>
                <button className="ff-action-btn" onClick={() => onShare()}>
                    <span className="ff-icon">🔗</span>
                    <span style={{ fontSize: ".87rem" }}>Поделиться</span>
                </button>
            </div>

            {/* Comments */}
            {open && (
                <div className="ff-comments">
                    {post.comments.length > 0 ? (
                        <div className="ff-comments-list">
                            {post.comments.map((c) => (
                                <div key={c.id} className="ff-comment">
                                    <div className="ff-comment-ava">
                                        {c.avatar}
                                    </div>
                                    <div className="ff-bubble">
                                        <div
                                            className="ff-comment-author"
                                            style={{ color: c.color }}
                                        >
                                            {c.author}
                                        </div>
                                        <div className="ff-comment-text">
                                            {c.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="ff-empty">
                            Пока нет комментариев — будь первым! 🎉
                        </p>
                    )}
                    <div className="ff-comment-form">
                        <input
                            className="ff-comment-input"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder={`Написать ${post.author.split(" ")[0]}…`}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleComment()
                            }
                        />
                        <button className="ff-send-btn" onClick={handleComment}>
                            🚀
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
