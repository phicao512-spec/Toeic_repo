"use client";

import Link from "next/link";
import { Headphones } from "lucide-react";
import { TOEIC_PARTS } from "@/lib/constants";

export default function ListeningPage() {
  const listeningParts = TOEIC_PARTS.filter((p) => p.section === "LISTENING");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">🎧 Luyện Nghe TOEIC</h1>
        <p style={{ color: "hsl(var(--muted-foreground))" }}>Luyện tập 4 phần nghe trong bài thi TOEIC</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {listeningParts.map((part) => (
          <Link key={part.id} href={`/listening/${part.id.toLowerCase()}`}
            className="card p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
            <div className="text-3xl mb-3">{part.icon}</div>
            <h3 className="font-bold mb-1">{part.name}</h3>
            <p className="text-sm font-medium mb-2" style={{ color: "hsl(var(--primary))" }}>{part.nameVi}</p>
            <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>{part.description}</p>
            <div className="flex items-center gap-2 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              <Headphones className="w-3.5 h-3.5" />
              <span>{part.questionCount} câu trong đề thi</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="card p-5 mt-6" style={{ background: "hsl(var(--primary)/0.05)", border: "1px solid hsl(var(--primary)/0.15)" }}>
        <p className="text-sm">💡 <strong>Mẹo:</strong> Nghe TOEIC chiếm 45 phút đầu tiên của bài thi. Hãy luyện nghe mỗi ngày với transcript để cải thiện khả năng nghe hiểu.</p>
      </div>
    </div>
  );
}
