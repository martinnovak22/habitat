import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes/router";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</ClerkProvider>
	</React.StrictMode>,
);
