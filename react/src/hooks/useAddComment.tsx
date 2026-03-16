import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddCommentInput = {
    postId: string;
    login: string;
    text: string;
    avatar: string;
    color: string;
};

type CommentResponse = {
    id: string;
    author: string;
    avatar: string;
    color: string;
    text: string;
};

export function useAddComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            postId,
            login,
            text,
            avatar,
            color,
        }: AddCommentInput): Promise<CommentResponse> => {
            const res = await fetch(
                `http://localhost:3000/posts/${postId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ login, text, avatar, color }),
                },
            );

            if (!res.ok) {
                throw new Error("Failed to add comment");
            }

            return res.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}
