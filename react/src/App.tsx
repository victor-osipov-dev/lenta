import { useState, useCallback } from "react";
import "./App.css";
import { useToast } from "./hooks/useToast";
import { AUTHOR_POOL, INITIAL_POSTS, makeId } from "./consts";
import { PostCard } from "./components/PostCard";
import { NewPostModal } from "./components/NewPostModal";
import { useQuery } from "@tanstack/react-query";
import { useCreatePost } from "./hooks/useCreatePost";
import { useToggleLike } from "./hooks/useToggleLike";
import { useAddComment } from "./hooks/useAddComment";

localStorage.setItem("login", "Лёша 🎮");
// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
    const { data: posts } = useQuery({
        queryKey: ["posts"],
        queryFn: () =>
            fetch(
                "http://localhost:3000/posts?login=" +
                    localStorage.getItem("login"),
            ).then((res) => res.json()),
        initialData: [],
    });
    const [modal, setModal] = useState(false);
    const [authorIdx, setAuthorIdx] = useState(0);
    const [toast, showToast] = useToast();
    const createPost = useCreatePost();
    const likeMutation = useToggleLike();
    const addComment = useAddComment();

    // sorted newest first
    const sorted = [...(posts ?? [])].reverse();

    const handleLike = useCallback((id: string) => {
        likeMutation.mutate({
            postId: id,
            login: localStorage.getItem("login")!,
        });
    }, []);

    const handleComment = useCallback((id: string, text: string) => {
        addComment.mutate({
            postId: id,
            login: localStorage.getItem("login")!,
            text,
            avatar: '🎮'
        });
    }, []);

    const handlePublish = useCallback(
        (text: string) => {
            const a = AUTHOR_POOL[authorIdx % AUTHOR_POOL.length];
            setAuthorIdx((i) => i + 1);

            createPost.mutate({
                login: a.name,
                text,
                image: {
                    bg: "blue",
                    label: "Hello",
                },
                avatar: a.avatar,
            });
            showToast("Пост опубликован! 🌟");
        },
        [authorIdx, showToast],
    );

    return (
        <>
            <div className="ff-root">
                {/* Header */}
                <header className="ff-header">
                    <div>
                        <div className="ff-logo">🌸 Наша лента</div>
                        <div className="ff-tagline">только для своих</div>
                    </div>
                    <div className="ff-badge">{posts.length} постов</div>
                </header>

                {/* Feed */}
                <div className="ff-feed">
                    <button
                        className="ff-new-btn"
                        onClick={() => setModal(true)}
                    >
                        ✏️ Что нового? Поделись с нами!
                    </button>

                    {sorted.map((post, i) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            index={i}
                            onLike={handleLike}
                            onComment={handleComment}
                            onShare={() => showToast("Ссылка скопирована! 🔗")}
                        />
                    ))}
                </div>

                {/* Modal */}
                {modal && (
                    <NewPostModal
                        onClose={() => setModal(false)}
                        onPublish={handlePublish}
                    />
                )}

                {/* Toast */}
                {toast && <div className="ff-toast">{toast}</div>}
            </div>
        </>
    );
}
