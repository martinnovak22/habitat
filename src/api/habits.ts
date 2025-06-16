import {
	type UseMutationOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../../lib/supabase.ts";

export type Habit = {
	id: string;
	title: string;
	user_id: string;
	created_at: string;
	completions: Record<string, boolean>;
};

// ---------- GET ALL HABITS ----------
export function useHabits(userId?: string) {
	return useQuery<Habit[], Error>({
		queryKey: ["habits", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("habits")
				.select("*")
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) throw error;
			return data;
		},
		enabled: !!userId,
	});
}

// ---------- CREATE HABIT ----------
export function useCreateHabit(
	userId?: string,
	options?: UseMutationOptions<unknown, Error, string>,
) {
	const queryClient = useQueryClient();

	return useMutation<unknown, Error, string>({
		mutationFn: async (habitName) => {
			if (!userId) throw new Error("Missing userId");

			const { data, error } = await supabase
				.from("habits")
				.insert([{ title: habitName, user_id: userId }]);

			if (error) throw error;
			return data;
		},
		onSuccess: (data, vars, ctx) => {
			queryClient.invalidateQueries({ queryKey: ["habits", userId] });
			options?.onSuccess?.(data, vars, ctx);
		},
		onError: (error, vars, ctx) => {
			options?.onError?.(error, vars, ctx);
		},
	});
}

// ---------- UPDATE COMPLETION ----------
type CompletionInput = {
	habitId: string;
	date: string;
	done: boolean;
};

export function useUpdateCompletion(
	userId?: string,
	options?: UseMutationOptions<CompletionInput, Error, CompletionInput>,
) {
	const queryClient = useQueryClient();

	return useMutation<CompletionInput, Error, CompletionInput>({
		mutationFn: async ({ habitId, date, done }) => {
			const { data, error: fetchError } = await supabase
				.from("habits")
				.select("completions")
				.eq("id", habitId)
				.single();

			if (fetchError) throw fetchError;

			const updatedCompletions = {
				...(data?.completions || {}),
				[date]: done,
			};

			const { error: updateError } = await supabase
				.from("habits")
				.update({ completions: updatedCompletions })
				.eq("id", habitId)
				.eq("user_id", userId);

			if (updateError) throw updateError;

			return { habitId, date, done };
		},
		onSettled: (data, error, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ["habits", userId] });
			options?.onSettled?.(data, error, variables, context);
		},
		onSuccess: (data, vars, ctx) => {
			options?.onSuccess?.(data, vars, ctx);
		},
		onError: (error, vars, ctx) => {
			options?.onError?.(error, vars, ctx);
		},
	});
}

// ---------- DELETE HABIT ----------
export function useDeleteHabit(
	userId?: string,
	options?: UseMutationOptions<string, Error, string>,
) {
	const queryClient = useQueryClient();

	return useMutation<string, Error, string, { previous?: Habit[] }>({
		mutationFn: async (habitId) => {
			const { error } = await supabase
				.from("habits")
				.delete()
				.eq("id", habitId)
				.eq("user_id", userId);

			if (error) throw error;
			return habitId;
		},
		onMutate: async (habitId) => {
			await queryClient.cancelQueries({ queryKey: ["habits", userId] });

			const previous = queryClient.getQueryData<Habit[]>(["habits", userId]);

			queryClient.setQueryData<Habit[]>(["habits", userId], (old) =>
				(old ?? []).filter((habit) => habit.id !== habitId),
			);

			return { previous };
		},
		onError: (error, _habitId, context) => {
			if (context?.previous) {
				queryClient.setQueryData(["habits", userId], context.previous);
			}
			options?.onError?.(error, _habitId, context);
		},
		onSettled: (data, error, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ["habits", userId] });
			options?.onSettled?.(data, error, variables, context);
		},
		onSuccess: (data, vars, ctx) => {
			options?.onSuccess?.(data, vars, ctx);
		},
	});
}

// ---------- GET HABIT BY ID ----------
export function useHabitById(habitId?: string, userId?: string) {
	return useQuery<Habit, Error>({
		queryKey: ["habit", habitId],
		queryFn: async () => {
			if (!habitId || !userId) throw new Error("Missing id");

			const { data, error } = await supabase
				.from("habits")
				.select("*")
				.eq("id", habitId)
				.eq("user_id", userId)
				.single();

			if (error) throw error;
			return data;
		},
		enabled: !!habitId && !!userId,
	});
}
