import { format } from "date-fns";
import { cs } from "date-fns/locale";
import type { Habit } from "../api/habits.ts";

interface HabitStatsProps {
	habit: Habit;
}

export default function HabitStats({ habit }: HabitStatsProps) {
	const completedDates = Object.keys(habit.completions || {}).filter(
		(date) => habit.completions[date],
	);

	const totalCompletions = completedDates.length;
	const createdDate = new Date(habit.created_at);
	const today = new Date();
	const daysSinceCreated = Math.ceil(
		(today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
	);
	const completionRate = daysSinceCreated
		? Math.round((totalCompletions / daysSinceCreated) * 100)
		: 0;

	const sortedDates = [...completedDates].sort();
	const first = sortedDates[0] || null;
	const last =
		sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null;

	return (
		<div className={"flex flex-col gap-2"}>
			<h3 className="text-xl font-semibold">Statistiky</h3>
			<p className="text-sm text-gray-500 dark:text-gray-400">
				Habit ID: {habit.id}
			</p>
			<p>
				<strong>Vytvořeno:</strong>{" "}
				{format(createdDate, "d. MMMM yyyy", { locale: cs })}
			</p>
			<p>
				<strong>Dokončeno celkem:</strong> {totalCompletions}
			</p>
			<p>
				<strong>Uplynulé dny:</strong> {daysSinceCreated}
			</p>
			<p>
				<strong>Úspěšnost:</strong>{" "}
				<span
					className={
						completionRate >= 80
							? "text-green-500"
							: completionRate >= 50
								? "text-yellow-500"
								: "text-red-500"
					}
				>
					{completionRate} %
				</span>
			</p>
			{first && (
				<p>
					<strong>První splnění:</strong>{" "}
					{format(new Date(first), "d. MMMM yyyy", { locale: cs })}
				</p>
			)}
			{last && (
				<p>
					<strong>Poslední splnění:</strong>{" "}
					{format(new Date(last), "d. MMMM yyyy", { locale: cs })}
				</p>
			)}
		</div>
	);
}
