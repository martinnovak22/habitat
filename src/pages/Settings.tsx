import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export default function Settings() {
	const { user } = useUser();
	const [darkMode, setDarkMode] = useState(() => {
		return localStorage.getItem("theme") === "dark";
	});

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [darkMode]);
	return (
		<div className="mx-auto space-y-6">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-white">
				Settings
			</h2>

			<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
				<div className="space-y-2">
					<p className="text-lg text-gray-800 dark:text-gray-200">
						Welcome, <span className="font-semibold">{user?.firstName}</span>!
					</p>
					<p className="text-gray-600 dark:text-gray-400">
						<strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}
					</p>
				</div>

				<hr className="border-gray-300 dark:border-gray-600" />

				<div className="flex items-center justify-between">
					<label
						htmlFor="dark-mode"
						className="text-gray-800 dark:text-gray-200 font-medium"
					>
						Enable Dark Mode
					</label>
					<input
						id="dark-mode"
						type="checkbox"
						className="w-5 h-5 accent-yellow-500"
						checked={darkMode}
						onChange={(e) => {
							setDarkMode(e.target.checked);
							localStorage.setItem(
								"theme",
								e.target.checked ? "dark" : "light",
							);
						}}
					/>
				</div>

				<hr className="border-gray-300 dark:border-gray-600" />

				<SignOutButton>
					<button className="w-full px-5 py-2 bg-indigo-400 text-white font-semibold rounded hover:bg-indigo-500 transition dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-gray-900">
						Sign Out
					</button>
				</SignOutButton>
			</div>
		</div>
	);
}
