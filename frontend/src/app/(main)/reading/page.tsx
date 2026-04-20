"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { TOEIC_PARTS } from "@/lib/constants";

export default function ReadingPage() {
  const readingParts = TOEIC_PARTS.filter((p) => p.section === "READING");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">📄 Luyện Đọc TOEIC</h1>
        <p style={{ color: "hsl(var(--muted-foreground))" }}>Luyện tập 3 phần đọc trong bài thi TOEIC</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {readingParts.map((part) => {
          const hasContent = part.id === "PART5";
          return (
            <Link key={part.id} href={hasContent ? `/reading/${part.id.toLowerCase()}` : "#"}
              className={`card p-6 transition-all group ${hasContent ? "hover:shadow-lg hover:-translate-y-0.5" : "opacity-60"}`}>
              <div className="text-3xl mb-3">{part.icon}</div>
              <h3 className="font-bold mb-1">{part.name}</h3>
              <p className="text-sm font-medium mb-2" style={{ color: "hsl(var(--primary))" }}>{part.nameVi}</p>
              <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>{part.description}</p>
              <div className="flex items-center gap-2 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                <FileText className="w-3.5 h-3.5" />
                <span>{part.questionCount} câu trong đề thi</span>
              </div>
              {!hasContent && (
                <div className="mt-3 text-xs px-2 py-1 rounded-full inline-block" style={{ background: "hsl(var(--muted))" }}>
                  🔒 Sắp ra mắt
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
