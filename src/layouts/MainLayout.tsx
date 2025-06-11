import {Outlet} from '@tanstack/react-router';
import {SignedIn, SignedOut, SignOutButton, RedirectToSignIn} from '@clerk/clerk-react';

export default function MainLayout() {
    return (
        <>
            <SignedIn>
                <div className="flex h-screen">
                    <nav className="w-64 bg-gray-900 text-white p-6 space-y-4">
                        <h1 className="text-2xl font-bold">MyHabits</h1>
                        <ul className="space-y-2">
                            <li><a href="/">Dashboard</a></li>
                            <li><a href="/profile">Profile</a></li>
                            <li><a href="/settings">Settings</a></li>
                        </ul>

                        <SignOutButton>
                            <div className={"hover:cursor-pointer"}>Sign Out</div>
                        </SignOutButton>


                    </nav>
                    <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
                        <Outlet/>
                    </main>
                </div>
            </SignedIn>

            <SignedOut>
                <RedirectToSignIn/>
            </SignedOut>
        </>
    );
}
