import { Link, Outlet } from "@tanstack/react-router";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useEffect } from "react";

const CLASS_NAMES = {
	link: "block px-3 py-2 rounded hover:bg-indigo-400 dark:hover:bg-gray-700 transition-colors",
};

export default function MainLayout() {
	useEffect(() => {
		if (window.localStorage.getItem("theme") === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);
	return (
		<>
			<SignedIn>
				<div className="flex h-screen text-gray-900 dark:text-gray-100">
					<nav className="w-64 bg-indigo-300 dark:bg-gray-800 p-6 space-y-6 shadow-md">
						<div className={"flex gap-2"}>
							<img
								src={"/src/assets/hypnosis.png"}
								alt="Logo"
								className="w-10 dark:invert"
							/>
							<h1 className="text-3xl font-bold">Habitat</h1>
						</div>
						<ul className="space-y-2">
							<li>
								<Link to="/" className={CLASS_NAMES.link}>
									Dashboard
								</Link>
							</li>
							<li>
								<Link to="/settings" className={CLASS_NAMES.link}>
									Settings
								</Link>
							</li>
						</ul>
					</nav>
					<main className="flex-1 p-8 bg-indigo-100 dark:bg-gray-900">
						<Outlet />
					</main>
				</div>
			</SignedIn>
			<SignedOut>
				<RedirectToSignIn />
			</SignedOut>
		</>
	);
}
