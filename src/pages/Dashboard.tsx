import {useUser} from "@clerk/clerk-react";
import {useHabits} from "../api/habits.ts";

type Habit = {
    id: string;
    user_id: string;
    title: string;
    completed: boolean;
};

export default function Dashboard() {
    const {user} = useUser();
    const userId = user?.id;
    const {data, error} = useHabits({userId});

    console.log(data);

    return (
        <div className="mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
            </h2>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
                {error && <div>Error loading habits</div>}
                {data
                    ? data.map((habit: Habit) => (
                        <div key={habit.id}>
                            {habit.title}
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-yellow-500"
                                checked={false}
                            />
                        </div>
                    ))
                    : null}
            </div>
        </div>
    );
}
