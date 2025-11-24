// components/ConfirmModal.tsx
import React from "react";

export default function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="bg-white rounded-xl shadow-lg p-6 z-10 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">{title ?? "Confirm"}</h3>
        <p className="text-sm text-gray-600 mb-4">{message ?? "Are you sure?"}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn-outline">Cancel</button>
          <button onClick={onConfirm} className="btn-primary">Delete</button>
        </div>
      </div>
    </div>
  );
}
