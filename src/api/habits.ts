import { supabase } from "../../lib/supabase.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useHabits(userId?: string) {
	return useQuery({
		queryKey: ["habits", userId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("habits")
				.select("*")
				.eq("user_id", userId);

			if (error) throw error;
			return data;
		},
		enabled: !!userId,
	});
}

export function useCreateHabit(userId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (habitName: string) => {
			if (!userId) throw new Error("Missing userId");

			const { data, error } = await supabase
				.from("habits")
				.insert([{ title: habitName, user_id: userId }]);

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["habits", userId] });
		},
	});
}

export function useUpdateCompletion(userId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			habitId,
			date,
			done,
		}: {
			habitId: string;
			date: string;
			done: boolean;
		}) => {
			const { data, error: fetchError } = await supabase
				.from("habits")
				.select("completions")
				.eq("id", habitId)
				.single();

			if (fetchError) throw fetchError;

			const currentCompletions = data?.completions || {};

			const updatedCompletions = {
				...currentCompletions,
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
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["habits", userId] });
		},
	});
}

export function useDeleteHabit(userId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (habitId: string) => {
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

			const previous = queryClient.getQueryData(["habits", userId]);

			queryClient.setQueryData(["habits", userId], (old: any[]) =>
				old.filter((habit) => habit.id !== habitId),
			);

			return { previous };
		},

		onError: (_error, _habitId, context) => {
			if (context?.previous) {
				queryClient.setQueryData(["habits", userId], context.previous);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["habits", userId] });
		},
	});
}
