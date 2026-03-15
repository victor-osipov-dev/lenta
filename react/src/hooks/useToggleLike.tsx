import { useMutation, useQueryClient } from "@tanstack/react-query";

type LikeInput = {
    postId: string;
    login: string;
};

type LikeResponse = {
    liked: boolean;
    likes: number;
};

export function useToggleLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            postId,
            login,
        }: LikeInput): Promise<LikeResponse> => {
            const res = await fetch(
                `http://localhost:3000/posts/${postId}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ login }),
                },
            );

            if (!res.ok) {
                throw new Error("Failed to toggle like");
            }

            return res.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}
