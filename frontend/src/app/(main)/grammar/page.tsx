"use client";

import { BookOpen, CheckCircle } from "lucide-react";

const GRAMMAR_LESSONS = [
  { id: 1, title: "Present Perfect Tense", titleVi: "Thì hiện tại hoàn thành", difficulty: "EASY", tags: ["tenses"], summary: "Diễn tả hành động đã xảy ra trong quá khứ nhưng có kết quả ở hiện tại", examples: ["She has worked here for 5 years.", "I have already submitted the report."] },
  { id: 2, title: "Relative Clauses", titleVi: "Mệnh đề quan hệ", difficulty: "MEDIUM", tags: ["clauses"], summary: "Cách sử dụng who, which, that, whose trong câu", examples: ["The man who called you is my boss.", "The report which was submitted is incomplete."] },
  { id: 3, title: "Passive Voice", titleVi: "Câu bị động", difficulty: "MEDIUM", tags: ["voice"], summary: "Cấu trúc be + V3/ed, thường gặp trong Part 5 & 6", examples: ["The meeting was postponed.", "All employees are required to attend."] },
  { id: 4, title: "Conditionals", titleVi: "Câu điều kiện", difficulty: "HARD", tags: ["conditionals"], summary: "Câu điều kiện loại 0, 1, 2, 3 và câu điều kiện hỗn hợp", examples: ["If it rains, we will cancel the event.", "If I were you, I would accept the offer."] },
  { id: 5, title: "Comparatives & Superlatives", titleVi: "So sánh", difficulty: "EASY", tags: ["adjectives"], summary: "So sánh hơn và so sánh nhất với tính từ và trạng từ", examples: ["This is more expensive than that.", "She is the most experienced candidate."] },
  { id: 6, title: "Prepositions of Time", titleVi: "Giới từ chỉ thời gian", difficulty: "EASY", tags: ["prepositions"], summary: "Phân biệt in, on, at, for, since, by, until, during", examples: ["The meeting is at 3 PM.", "She has worked here since 2019."] },
  { id: 7, title: "Gerunds vs Infinitives", titleVi: "Danh động từ và động từ nguyên mẫu", difficulty: "HARD", tags: ["verb-form"], summary: "Khi nào dùng V-ing, khi nào dùng to V", examples: ["I enjoy working with the team.", "She decided to resign from the position."] },
  { id: 8, title: "Subject-Verb Agreement", titleVi: "Hòa hợp chủ - vị", difficulty: "MEDIUM", tags: ["agreement"], summary: "Quy tắc chia động từ phù hợp với chủ ngữ", examples: ["The number of applicants has increased.", "A variety of products are available."] },
];

const DIFF_COLORS: Record<string, string> = { EASY: "#10b981", MEDIUM: "#f59e0b", HARD: "#ef4444" };
const DIFF_LABELS: Record<string, string> = { EASY: "Dễ", MEDIUM: "Trung bình", HARD: "Khó" };

export default function GrammarPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">📖 Ngữ Pháp TOEIC</h1>
        <p style={{ color: "hsl(var(--muted-foreground))" }}>Tổng hợp các chủ đề ngữ pháp thường gặp trong TOEIC</p>
      </div>

      <div className="space-y-4">
        {GRAMMAR_LESSONS.map((lesson) => (
          <div key={lesson.id} className="card p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-base mb-0.5">{lesson.titleVi}</h3>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{lesson.title}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: `${DIFF_COLORS[lesson.difficulty]}18`, color: DIFF_COLORS[lesson.difficulty] }}>
                {DIFF_LABELS[lesson.difficulty]}
              </span>
            </div>
            <p className="text-sm mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>{lesson.summary}</p>
            <div className="space-y-1.5">
              {lesson.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--primary))" }} />
                  <span style={{ color: "hsl(var(--muted-foreground))" }}>{ex}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
