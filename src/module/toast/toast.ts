import { useCallback, useState } from "react";

export type ToastType = "success" | "error";

export interface ToastState {
	id: number;
	message: string;
	type: ToastType;
	duration: number;
}

export function useToast() {
	const [toasts, setToasts] = useState<ToastState[]>([]);

	const showToast = useCallback(
		(message: string, type: ToastType = "success", duration = 3000) => {
			const id = Date.now();
			const newToast: ToastState = { id, message, type, duration };

			setToasts((prev) => [...prev, newToast]);

			// Auto-remove after duration
			setTimeout(() => {
				setToasts((prev) => prev.filter((toast) => toast.id !== id));
			}, duration);
		},
		[],
	);

	return { toasts, showToast };
}
