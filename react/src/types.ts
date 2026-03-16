export type Post = {
    id: string;
    author: string;
    avatar: string;
    color: string;
    time: string;
    text: string;
    image: null | {
        bg: string;
        label: string;
    };
    likes: number;
    liked: boolean;
    comments: {
        id: string;
        author: string;
        avatar: string;
        color: string;
        text: string;
    }[];
}