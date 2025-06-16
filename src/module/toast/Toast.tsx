import type { ToastState } from "./toast";

interface ToastProps {
	toasts: ToastState[];
}

export default function Toast({ toasts }: ToastProps) {
	return (
		<div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
			{toasts.map((toast) => {
				const icon =
					toast.type === "success"
						? "src/assets/information.png"
						: "src/assets/warning.png";

				return (
					<div
						key={toast.id}
						className={`flex items-center px-4 py-2 rounded shadow-lg text-white text-sm gap-1 ${
							toast.type === "success" ? "bg-green-600" : "bg-red-600"
						}`}
					>
						<img src={icon} alt="Icon" className="w-4 h-4 invert" />
						{toast.message}
					</div>
				);
			})}
		</div>
	);
}
