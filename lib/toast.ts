export type ToastType = "success" | "error";

export type ToastPayload = {
	id: string;
	message: string;
	type: ToastType;
};

export const TOAST_EVENT_NAME = "app:toast";

const createToastId = () => {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}

	return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export function showToast(message: string, type: ToastType = "success") {
	if (typeof window === "undefined") {
		return;
	}

	const detail: ToastPayload = {
		id: createToastId(),
		message,
		type,
	};

	window.dispatchEvent(new CustomEvent<ToastPayload>(TOAST_EVENT_NAME, { detail }));
}
