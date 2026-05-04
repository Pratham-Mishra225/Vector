"use client";

import { useEffect, useRef, useState } from "react";

import { TOAST_EVENT_NAME, type ToastPayload } from "@/lib/toast";

export default function Toast() {
	const [toasts, setToasts] = useState<ToastPayload[]>([]);
	const timeouts = useRef<Record<string, number>>({});

	useEffect(() => {
		const handleToast = (event: Event) => {
			const detail = (event as CustomEvent<ToastPayload>).detail;
			if (!detail) {
				return;
			}

			setToasts((current) => [...current, detail]);

			const timeoutId = window.setTimeout(() => {
				setToasts((current) => current.filter((toast) => toast.id !== detail.id));
				delete timeouts.current[detail.id];
			}, 3000);

			timeouts.current[detail.id] = timeoutId;
		};

		window.addEventListener(TOAST_EVENT_NAME, handleToast);

		return () => {
			window.removeEventListener(TOAST_EVENT_NAME, handleToast);
			Object.values(timeouts.current).forEach((timeoutId) => {
				window.clearTimeout(timeoutId);
			});
			timeouts.current = {};
		};
	}, []);

	if (toasts.length === 0) {
		return null;
	}

	return (
		<div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`rounded-xl border px-4 py-3 text-sm shadow-lg ${
						toast.type === "success"
							? "border-emerald-200 bg-emerald-50 text-emerald-700"
							: "border-rose-200 bg-rose-50 text-rose-700"
					}`}
					role="status"
					aria-live="polite"
				>
					{toast.message}
				</div>
			))}
		</div>
	);
}
