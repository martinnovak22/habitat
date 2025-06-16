import { useUser } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useDeleteHabit, useUpdateCompletion } from "../api/habits.ts";
import Toast from "../module/toast/Toast.tsx";
import { useToast } from "../module/toast/toast.ts";

interface Habit {
	id: string;
	title: string;
	completions?: Record<string, boolean>;
}

interface HabitTableProps {
	habits?: Habit[];
}

function formatDate(date: Date) {
	const iso = date.toISOString().split("T")[0];
	const czech = date.toLocaleDateString("cs-CZ");
	return { iso, czech };
}

export default function HabitTable({ habits }: HabitTableProps) {
	const { user } = useUser();
	const userId = user?.id;
	const { toasts, showToast } = useToast();
	const { mutate: deleteHabit } = useDeleteHabit(userId, {
		onSuccess: () => {
			showToast("Habit deleted successfully", "success");
		},
		onError: () => {
			showToast("Failed to delete habit", "error");
		},
	});
	const { mutate } = useUpdateCompletion(userId, {
		onSuccess: () => {
			showToast("Habit updated successfully", "success");
		},
		onError: () => {
			showToast("Failed to update habit", "error");
		},
	});

	const dates = useMemo(() => {
		const today = new Date();
		const days = [];

		for (let i = -5; i <= 1; i++) {
			const d = new Date(today);
			d.setDate(today.getDate() + i);
			days.push(formatDate(d));
		}
		return days;
	}, []);

	const handleToggle = (habitId: string, date: string, current?: boolean) => {
		mutate({
			habitId,
			date,
			done: !current,
		});
	};

	if (!habits?.length)
		return <div className="text-lg">No habits found. Create a new one!</div>;

	return (
		<div className="overflow-x-auto rounded-lg shadow">
			<table className="min-w-full table-auto border-collapse bg-white dark:bg-gray-900">
				<thead>
					<tr>
						<th className="px-4 py-2 border-b border-gray-600 text-left text-gray-700 dark:text-gray-300">
							Habit
						</th>
						{dates.map(({ czech }) => (
							<th
								key={czech}
								className="px-2 py-2 border-b border-gray-600 text-sm text-gray-600 dark:text-gray-400"
							>
								{czech}
							</th>
						))}
						<th className={"w-16 border-b border-gray-600"}>
							<img
								src="/src/assets/bin.png"
								alt="Delete"
								className="w-4 h-4 dark:invert m-auto"
							/>
						</th>
					</tr>
				</thead>
				<tbody>
					{habits.map((habit) => (
						<tr
							key={habit.id}
							className="hover:bg-gray-50 dark:hover:bg-gray-800 h-14"
						>
							<td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
								<Link
									to="/habit/$habitId"
									params={{ habitId: habit.id }}
									className="text-blue-600 hover:underline"
								>
									{habit.title}
								</Link>
							</td>

							{dates.map(({ iso, czech }) => {
								const isDone = habit.completions?.[iso] ?? false;
								return (
									<td key={czech} className="px-2 py-2 text-center">
										<input
											type="checkbox"
											className="w-4 h-4 hover:cursor-pointer hover:opacity-50"
											checked={isDone}
											onChange={() => handleToggle(habit.id, iso, isDone)}
										/>
									</td>
								);
							})}

							<td>
								<button
									type="button"
									onClick={() => deleteHabit(habit.id)}
									className={"w-full h-full"}
								>
									<img
										src="/src/assets/bin.png"
										alt="Delete"
										className="w-4 h-4 dark:invert hover:cursor-pointer hover:opacity-50 m-auto"
									/>
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Toast toasts={toasts} />
		</div>
	);
}
