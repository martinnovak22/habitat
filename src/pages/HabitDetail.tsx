import { useUser } from "@clerk/clerk-react";
import { useParams } from "@tanstack/react-router";
import Calendar from "react-calendar";
import { useHabitById } from "../api/habits";
import "react-calendar/dist/Calendar.css";
import { useEffect } from "react";

import "../styles/calendar-theme.css";

function toLocalISOString(date: Date) {
	const offset = date.getTimezoneOffset();
	const localDate = new Date(date.getTime() - offset * 60 * 1000);
	return localDate.toISOString().split("T")[0];
}

export default function HabitDetail() {
	const { habitId } = useParams({ strict: false });
	const { user } = useUser();
	const { data: habit, isLoading } = useHabitById(habitId, user?.id);

	useEffect(() => {
		document.title = habit?.title ? `Habit: ${habit.title}` : "Habit Detail";
	}, [habit]);

	if (isLoading) return <p>Loading...</p>;
	if (!habit) return <p>Habit not found</p>;

	return (
		<div className="p-4 space-y-4">
			<h2 className="text-2xl font-bold text-gray-800 dark:text-white">
				{habit.title}
			</h2>
			<p className="text-sm text-gray-500 dark:text-gray-400">
				Habit ID: {habit.id}
			</p>

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
