import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deletePost(id: string): Promise<void> {
    const res = await fetch(`http://localhost:3000/posts/${id}`, {
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
