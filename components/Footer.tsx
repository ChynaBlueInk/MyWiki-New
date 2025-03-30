"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const res = await fetch("/api/trackVisitor");
        const data = await res.json();
        setVisitorCount(data.count);
      } catch (error) {
        console.error("❌ Error fetching visitor count:", error);
      }
    };

    trackVisitor();
  }, []);

  return (
    <footer className="text-center py-4 mt-5 border-top">
      <p className="mb-1">© {new Date().getFullYear()} AI Tools Wiki</p>
      {visitorCount !== null && (
        <p className="text-muted small">👁️ Visitors: {visitorCount}</p>
      )}
    </footer>
  );
}
