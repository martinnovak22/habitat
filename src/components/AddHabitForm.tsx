import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import type React from "react";
import { useCreateHabit } from "../api/habits";
import Toast from "../module/toast/Toast.tsx";
import { useToast } from "../module/toast/toast.ts";

export default function HabitForm() {
	const { user } = useUser();
	const [title, setTitle] = useState("");
	const { toasts, showToast } = useToast();
	const { mutate, isPending } = useCreateHabit(user?.id, {
		onSuccess: () => {
			showToast("Habit added successfully", "success");
		},
		onError: () => {
			showToast("Failed to add habit", "error");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim()) {
			mutate(title);
			setTitle("");
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<div className="flex gap-2">
				<input
					type="text"
					className="flex-1 px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
					placeholder="e.g. Drink water"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					disabled={isPending}
				>
					{isPending ? "Adding..." : "Add Habit"}
				</button>
			</div>

			<Toast toasts={toasts} />
		</form>
	);
}
