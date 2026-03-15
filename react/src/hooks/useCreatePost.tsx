import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreatePostInput = {
    login: string;
    text: string;
    image?: null | {
        bg: string;
        label: string;
    };
    avatar: string;
};

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreatePostInput) => {
            const res = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to create post");

            return res.json();
        },

        onSuccess: () => {
            // инвалидируем список постов
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}
