import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IUseCreateEditMutationProps {
    basePath: string;
    id?: string;
    editFn: any;
    createFn: any;
}
export default function useCreateEditMutation<T>({ basePath, id, createFn, editFn }: IUseCreateEditMutationProps) {
    const queryClient = useQueryClient();

    const { mutate: create } = useMutation({
        mutationKey: [basePath, "create"],
        mutationFn: (data: T) => {
            return createFn(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [basePath] });
        }
    })
    const { mutate: edit } = useMutation({
        mutationKey: [basePath, "edit", id],
        mutationFn: (data: T & { id: string }) => {
            return editFn(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [basePath] });
        },
    })

    return id ? edit : create;
}