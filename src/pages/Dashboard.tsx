import { useUser } from "@clerk/clerk-react";
import { useHabits } from "../api/habits.ts";
import HabitForm from "../components/AddHabitForm.tsx";
import HabitTable from "../components/HabitsTable.tsx";

export default function Dashboard() {
	const { user } = useUser();
	const userId = user?.id;
	const { data: habits, isLoading } = useHabits(userId);

	if (isLoading) return <p>Loading...</p>;

	return (
		<div className="mx-auto space-y-6">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
				Dashboard
			</h2>

			<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
				<HabitTable habits={habits} />
			</div>
			<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
				<HabitForm />
			</div>
		</div>
	);
}
