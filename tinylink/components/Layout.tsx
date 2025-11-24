// components/Layout.tsx
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">TinyLink</h1>
              <p className="text-xs text-gray-500"></p>
            </div>
            <nav className="text-sm text-gray-600 flex items-center gap-4">
              <a href="/" className="hover:text-gray-900">Dashboard</a>
              <a href="/api/healthz" className="hover:text-gray-900">Health</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {children}
      </main>
    </div>
  );
}
