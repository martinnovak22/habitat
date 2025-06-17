import { useUser } from "@clerk/clerk-react";
import { useParams } from "@tanstack/react-router";
import Calendar from "react-calendar";
import { useHabitById } from "../api/habits";
import "react-calendar/dist/Calendar.css";
import "../styles/calendar-theme.css";
import HabitStats from "../components/HabitStats";

function toLocalISOString(date: Date) {
	const offset = date.getTimezoneOffset();
	const localDate = new Date(date.getTime() - offset * 60 * 1000);
	return localDate.toISOString().split("T")[0];
}

export default function HabitDetail() {
	const { habitId } = useParams({ strict: false });
	const { user } = useUser();
	const { data: habit, isLoading } = useHabitById(habitId, user?.id);

	if (isLoading) return <p>Loading...</p>;
	if (!habit) return <p>Habit not found</p>;

	return (
		<div className="mx-auto space-y-6">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
				{habit.title}
			</h2>
			<div className="grid grid-cols-2 mt-6 p-6 bg-white dark:bg-gray-800 rounded shadow space-y-2">
				<HabitStats habit={habit} />
				<Calendar
					locale="cs-CZ"
					calendarType="iso8601"
					className="rounded-lg react-calendar"
					tileClassName={({ date, view }) => {
						if (view !== "month") return "";

						const iso = toLocalISOString(date);
						if (habit.completions?.[iso]) {
							return "completed-tile";
						}
						return "uncompleted-tile";
					}}
					showNeighboringMonth={false}
					formatMonthYear={(locale, date) =>
						date.toLocaleDateString(locale, { month: "long", year: "numeric" })
					}
					formatShortWeekday={(locale, date) =>
						date.toLocaleDateString(locale, { weekday: "short" }).slice(0, 2)
					}
				/>
			</div>

			<button
				className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
				onClick={() => history.back()}
				type="button"
			>
				← Zpět na dashboard
			</button>
		</div>
	);
}
