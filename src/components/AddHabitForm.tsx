import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useCreateHabit } from "../api/habits";

export default function HabitForm() {
	const { user } = useUser();
	const [title, setTitle] = useState("");
	const { mutate, isPending, isSuccess, isError, error } = useCreateHabit(
		user?.id,
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim()) {
			mutate(title);
			setTitle("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
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

			{isError && (
				<p className="text-red-500 text-sm">
					Error: {(error as Error).message}
				</p>
			)}
			{isSuccess && <p className="text-green-500 text-sm">Habit added!</p>}
		</form>
	);
}
