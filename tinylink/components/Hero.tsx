// components/Hero.tsx
import React from "react";

export default function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <section className="hero">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative w-full flex justify-center">
        <div className="hero-card">
          <div className="flex items-start gap-4 mb-4 px-3">
            <div className="tab-pill">🔗 Short Link</div>
          </div>

          <div className="card-inner">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
