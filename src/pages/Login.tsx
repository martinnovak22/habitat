import { SignIn, SignedOut } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function Login() {
	const { isSignedIn } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (isSignedIn) navigate({ to: "/" });
	}, [isSignedIn, navigate]);

	return (
		<>
			<SignedOut>
				<div className="min-h-screen flex items-center justify-center bg-gray-100">
					<div className="bg-white p-8 rounded shadow-md">
						<SignIn />
					</div>
				</div>
			</SignedOut>
		</>
	);
}
