// components/Toast.tsx
import React from "react";
export type ToastMessage = { id:string; message:string; type?: "info"|"success"|"error" };
export function Toast({ toast }: { toast?: ToastMessage | null }) {
  if (!toast) return null;
  const bg = toast.type === "error" ? "bg-red-600" : toast.type === "success" ? "bg-green-600" : "bg-blue-600";
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`${bg} text-white px-4 py-2 rounded-lg shadow-lg`}>
        {toast.message}
      </div>
    </div>
  );
}
