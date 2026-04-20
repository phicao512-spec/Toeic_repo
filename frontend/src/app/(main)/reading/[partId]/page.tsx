"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { TOEIC_PARTS } from "@/lib/constants";

export default function ReadingPartPage() {
  const { partId } = useParams();
  const pid = String(partId).toUpperCase();
  const partInfo = TOEIC_PARTS.find((p) => p.id === pid);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/reading" className="flex items-center gap-1 text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
        <ArrowLeft className="w-4 h-4" /> Tất cả phần đọc
      </Link>
      <div className="text-center py-16">
        <div className="text-5xl mb-4">{partInfo?.icon || "📄"}</div>
        <h1 className="text-2xl font-bold mb-2">{partInfo?.nameVi || pid}</h1>
        <p className="text-sm mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>{partInfo?.name}</p>
        <p className="text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>{partInfo?.description}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: "hsl(var(--primary)/0.1)", color: "hsl(var(--primary))" }}>
          <FileText className="w-4 h-4" />
          {partInfo?.questionCount} câu trong đề thi
        </div>
        <div className="card p-6 mt-8 max-w-md mx-auto">
          <p className="text-sm font-medium mb-2">🚧 Đang phát triển</p>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Phần luyện tập này sẽ sớm ra mắt với đoạn văn và câu hỏi đầy đủ. Hãy quay lại sau nhé!</p>
        </div>
      </div>
    </div>
  );
}
