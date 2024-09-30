import { apiSlice } from "../apiSlice"; // Adjust the import path as necessary

const BOARD_URL = "/board"; // Adjust the URL according to your backend

export const boardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getColumns: builder.query({
            query: () => ({
                url: `${BOARD_URL}/`,
                method: "GET",
                credentials: "include",
            }),
        }),

        addColumn: builder.mutation({
            query: (newColumn) => ({
                url: `${BOARD_URL}/column`,
                method: "POST",
                body: newColumn,
                credentials: "include",
            }),
        }),

        deleteColumn: builder.mutation({
            query: (id) => ({
                url: `${BOARD_URL}/column/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),

        updateColumn: builder.mutation({
            query: (data) => ({
                url: `${BOARD_URL}/column/${data.id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),

        getTasks: builder.query({
            query: () => ({
                url: `${BOARD_URL}/tasks`,
                method: "GET",
                credentials: "include",
            }),
        }),

        addTask: builder.mutation({
            query: (data) => ({
                url: `${BOARD_URL}/tasks`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),

        deleteTask: builder.mutation({
            query: (id) => ({
                url: `${BOARD_URL}/tasks/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),

        updateTask: builder.mutation({
            query: (data) => ({
                url: `${BOARD_URL}/tasks/${data.id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),

        moveTask: builder.mutation({
            query: (data) => ({
                url: `${BOARD_URL}/tasks/move`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),
    }),
});

// Export hooks for using the mutations and queries in components
export const {
    useGetColumnsQuery,
    useAddColumnMutation,
    useDeleteColumnMutation,
    useUpdateColumnMutation,
    useGetTasksQuery,
    useAddTaskMutation,
    useDeleteTaskMutation,
    useUpdateTaskMutation,
    useMoveTaskMutation,
} = boardApiSlice;
