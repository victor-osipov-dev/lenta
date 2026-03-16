import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../consts";

async function deletePost(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete post");
    }
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}
