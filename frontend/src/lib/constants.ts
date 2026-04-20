export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const APP_NAME = "TOEIC Master";

export const TOEIC_PARTS = [
  {
    id: "PART1",
    name: "Photographs",
    nameVi: "Mô tả tranh",
    section: "LISTENING",
    questionCount: 6,
    icon: "🖼️",
    description: "Nhìn vào bức tranh và chọn câu mô tả đúng nhất",
  },
  {
    id: "PART2",
    name: "Question-Response",
    nameVi: "Hỏi - Đáp",
    section: "LISTENING",
    questionCount: 25,
    icon: "💬",
    description: "Nghe câu hỏi và chọn câu trả lời phù hợp nhất",
  },
  {
    id: "PART3",
    name: "Conversations",
    nameVi: "Đoạn hội thoại",
    section: "LISTENING",
    questionCount: 39,
    icon: "🗣️",
    description: "Nghe đoạn hội thoại ngắn rồi trả lời câu hỏi",
  },
  {
    id: "PART4",
    name: "Talks",
    nameVi: "Bài nói chuyện ngắn",
    section: "LISTENING",
    questionCount: 30,
    icon: "📢",
    description: "Nghe bài nói chuyện rồi trả lời câu hỏi",
  },
  {
    id: "PART5",
    name: "Incomplete Sentences",
    nameVi: "Điền vào câu",
    section: "READING",
    questionCount: 30,
    icon: "✏️",
    description: "Chọn từ hoặc cụm từ thích hợp để hoàn thành câu",
  },
  {
    id: "PART6",
    name: "Text Completion",
    nameVi: "Điền vào đoạn văn",
    section: "READING",
    questionCount: 16,
    icon: "📝",
    description: "Chọn từ hoặc câu phù hợp điền vào chỗ trống trong đoạn văn",
  },
  {
    id: "PART7",
    name: "Reading Comprehension",
    nameVi: "Đọc hiểu",
    section: "READING",
    questionCount: 54,
    icon: "📖",
    description: "Đọc đoạn văn và trả lời câu hỏi liên quan",
  },
] as const;

export const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: "Dễ",
  MEDIUM: "Trung bình",
  HARD: "Khó",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: "badge-success",
  MEDIUM: "badge-warning",
  HARD: "badge-danger",
};

export const VOCAB_TOPICS = [
  { id: 1, name: "Office & Business", nameVi: "Văn phòng & Kinh doanh", icon: "🏢" },
  { id: 2, name: "Finance & Banking", nameVi: "Tài chính & Ngân hàng", icon: "💰" },
  { id: 3, name: "Marketing", nameVi: "Marketing & Quảng cáo", icon: "📣" },
  { id: 4, name: "Technology", nameVi: "Công nghệ & CNTT", icon: "💻" },
  { id: 5, name: "Travel", nameVi: "Du lịch & Giao thông", icon: "✈️" },
  { id: 6, name: "Health", nameVi: "Sức khỏe", icon: "🏥" },
  { id: 7, name: "Human Resources", nameVi: "Nhân sự", icon: "👥" },
  { id: 8, name: "Manufacturing", nameVi: "Sản xuất", icon: "🏭" },
  { id: 9, name: "Dining", nameVi: "Ẩm thực & Khách sạn", icon: "🍽️" },
  { id: 10, name: "Entertainment", nameVi: "Giải trí & Truyền thông", icon: "🎬" },
];

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan", icon: "LayoutDashboard" },
  { href: "/vocabulary", label: "Từ vựng", icon: "BookOpen" },
  {
    href: "/listening",
    label: "Luyện nghe",
    icon: "Headphones",
    children: [
      { href: "/listening/part1", label: "Part 1: Mô tả tranh" },
      { href: "/listening/part2", label: "Part 2: Hỏi - Đáp" },
      { href: "/listening/part3", label: "Part 3: Hội thoại" },
      { href: "/listening/part4", label: "Part 4: Bài nói" },
    ],
  },
  {
    href: "/reading",
    label: "Luyện đọc",
    icon: "FileText",
    children: [
      { href: "/reading/part5", label: "Part 5: Điền vào câu" },
      { href: "/reading/part6", label: "Part 6: Điền vào đoạn" },
      { href: "/reading/part7", label: "Part 7: Đọc hiểu" },
    ],
  },
  { href: "/practice-test", label: "Thi thử", icon: "ClipboardList" },
  { href: "/grammar", label: "Ngữ pháp", icon: "BookMarked" },
  { href: "/progress", label: "Tiến trình", icon: "TrendingUp" },
  { href: "/leaderboard", label: "Bảng xếp hạng", icon: "Trophy" },
];
