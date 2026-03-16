import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../consts";

type CreatePostInput = {
    login: string;
    text: string;
    image?: null | {
        bg: string;
        label: string;
    };
    avatar: string;
    color: string;
};

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreatePostInput) => {
            const res = await fetch(API_URL + "/posts", {
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
