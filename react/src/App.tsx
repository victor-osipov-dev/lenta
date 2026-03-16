import { useState, useCallback } from "react";
import "./App.css";
import { useToast } from "./hooks/useToast";
import { PostCard } from "./components/PostCard";
import { NewPostModal } from "./components/NewPostModal";
import { useQuery } from "@tanstack/react-query";
import { useCreatePost } from "./hooks/useCreatePost";
import { useToggleLike } from "./hooks/useToggleLike";
import { useAddComment } from "./hooks/useAddComment";
import OnboardingModal, {
    loadProfile,
    UserProfile,
} from "./components/OnboardingModal";
import { useDeletePost } from "./hooks/useDeletePost";
import { API_URL } from "./consts";

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
    const [profile, setProfile] = useState<UserProfile | null>(() =>
        loadProfile(),
    );
    const { data: posts } = useQuery({
        queryKey: ["posts", profile],
        queryFn: () =>
            fetch(API_URL + "/posts?login=" + profile?.name).then(
                (res) => res.json(),
            ),
        initialData: [],
    });
    const [modal, setModal] = useState(false);
    const [toast, showToast] = useToast();
    const createPost = useCreatePost();
    const likeMutation = useToggleLike();
    const addComment = useAddComment();
    const { mutate: deletePost, isPending } = useDeletePost();

    // sorted newest first
    const sorted = [...(posts ?? [])].reverse();

    const handleLike = useCallback(
        (id: string) => {
            likeMutation.mutate({
                postId: id,
                login: profile?.name!,
            });
        },
        [profile],
    );

    const handleComment = useCallback(
        (id: string, text: string) => {
            addComment.mutate({
                postId: id,
                login: profile?.name!,
                text,
                avatar: profile?.avatar!,
                color: profile?.color!,
            });
        },
        [profile],
    );

    const handlePublish = useCallback(
        (text: string) => {
            createPost.mutate({
                login: profile?.name!,
                avatar: profile?.avatar!,
                text,
                image: {
                    bg: "blue",
                    label: "Hello",
                },
                color: profile?.color!,
            });
            showToast("Пост опубликован! 🌟");
        },
        [showToast, profile],
    );

    const handleDelete = useCallback((id: string): void => {
        deletePost(id);
    }, []);

    return (
        <>
            {!profile && <OnboardingModal onComplete={(p) => setProfile(p)} />}

            <div className="ff-root">
                {/* Header */}
                <header className="ff-header">
                    <div>
                        <div className="ff-logo">🧻 Наша лента</div>
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
                            onDelete={handleDelete}
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
