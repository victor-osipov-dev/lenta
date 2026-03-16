// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostImage {
    bg: string;
    label: string;
}

export interface CreatePostBody {
    login: string;
    text: string;
    image?: PostImage;
    avatar: string;
    color: string;
}

export interface CommentResponse {
    id: string;
    author: string;
    avatar: string;
    color: string;
    text: string;
}

export interface PostResponse {
    id: string;
    author: string;
    avatar: string;
    color: string;
    time: string;
    text: string;
    image: PostImage | null;
    likes: number;
    liked: boolean;
    comments: CommentResponse[];
}

export interface LikePostBody {
    login: string;
}

export interface AddCommentBody {
    login: string;
    text: string;
    avatar: string;
    color: string;
}