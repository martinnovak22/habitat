import {useMemo} from "react";
import {useUser} from "@clerk/clerk-react";
import {useDeleteHabit, useUpdateCompletion} from "../api/habits.ts";

interface Habit {
    id: string;
    title: string;
    completions?: Record<string, boolean>;
}

interface HabitTableProps {
    habits: Habit[];
}

function formatDate(date: Date) {
    const iso = date.toISOString().split("T")[0];
    const czech = date.toLocaleDateString("cs-CZ");
    return {iso, czech};
}

export default function HabitTable({habits}: HabitTableProps) {
    const {user} = useUser();
    const userId = user?.id;
    const {mutate: deleteHabit} = useDeleteHabit(userId);
    const {mutate} = useUpdateCompletion(userId);

    const dates = useMemo(() => {
        const today = new Date();
        const days = [];

        for (let i = -1; i <= 5; i++) {
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

    return (
        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full table-auto border-collapse bg-white dark:bg-gray-900">
                <thead>
                <tr>
                    <th className="px-4 py-2 border-b border-gray-600 text-left text-gray-700 dark:text-gray-300">
                        Habit
                    </th>
                    {dates.map(({czech}) => (
                        <th
                            key={czech}
                            className="px-2 py-2 border-b border-gray-600 text-sm text-gray-600 dark:text-gray-400"
                        >
                            {czech}
                        </th>
                    ))}
                    <th className={"border-b border-gray-600"}/>
                </tr>
                </thead>
                <tbody>
                {habits.map((habit) => (
                    <tr
                        key={habit.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                            {habit.title}
                        </td>
                        {dates.map(({iso, czech}) => {
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
                        <td className={"flex justify-center px-1 py-2"}>
                            <button onClick={() => deleteHabit(habit.id)}>
                                <img
                                    src="/src/assets/bin.png"
                                    alt="Delete"
                                    className="w-5 dark:invert hover:cursor-pointer hover:opacity-50"
                                />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
