import { supabase } from "../../lib/supabase.ts";
import { useQuery } from "@tanstack/react-query";

export function useHabits({ userId }: { userId?: string }) {
	return useQuery({
		queryKey: ["habits"],
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
