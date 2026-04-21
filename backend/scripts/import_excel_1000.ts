import { PrismaClient } from "@prisma/client";
import * as xlsx from "xlsx";
import fs from "fs";

const prisma = new PrismaClient();

const semanticTopics = [
  { id: "finance", nameVi: "Tài chính & Ngân hàng", enName: "Finance & Banking", icon: "💰", keywords: ["tiền", "ngân hàng", "tài khoản", "thuế", "lãi", "đầu tư", "kế toán", "tài chính", "ngân sách", "thanh toán", "chi phí", "doanh thu", "quỹ", "cổ phiếu", "kinh tế", "vay", "nợ", "giá", "tiết kiệm", "ngân phiếu", "tín dụng"] },
  { id: "travel", nameVi: "Du lịch & Vận tải", enName: "Travel & Transportation", icon: "✈️", keywords: ["du lịch", "chuyến bay", "hành khách", "khách sạn", "đặt phòng", "xe", "tàu", "vé", "giao thông", "hành lý", "sân bay", "vận chuyển", "tour", "lái xe", "phương tiện", "chuyến đi", "đường sắt", "hàng không", "trạm", "địa điểm", "chuyến", "đáp"] },
  { id: "office", nameVi: "Văn phòng & Công sở", enName: "Office & Workplace", icon: "🏢", keywords: ["văn phòng", "tài liệu", "nhân viên", "cuộc họp", "sếp", "bàn", "in ấn", "giấy", "đồng nghiệp", "nơi làm việc", "lịch trình", "trợ lý", "phòng ban", "hồ sơ", "tập tin", "máy in", "họp", "thư ký", "báo cáo", "công sở", "thiết bị văn phòng"] },
  { id: "hr", nameVi: "Nhân sự & Tuyển dụng", enName: "HR & Recruitment", icon: "🤝", keywords: ["tuyển dụng", "nhân sự", "phỏng vấn", "ứng viên", "lương", "thưởng", "sa thải", "hợp đồng", "nghỉ phép", "đào tạo", "chức vụ", "thăng tiến", "sơ yếu", "thuyên chuyển", "chấm dứt", "hưu", "đánh giá", "ứng dụng", "công việc", "tuyển"] },
  { id: "marketing", nameVi: "Tiếp thị & Bán hàng", enName: "Marketing & Sales", icon: "📈", keywords: ["tiếp thị", "bán hàng", "quảng cáo", "khách hàng", "khuyến mãi", "doanh số", "thị trường", "sản phẩm", "chiến dịch", "người tiêu dùng", "mua sắm", "thương hiệu", "phân phối", "chiết khấu", "hàng hóa", "cửa hàng", "người bán", "người mua"] },
  { id: "health", nameVi: "Sức khỏe & Y tế", enName: "Health & Medicine", icon: "🏥", keywords: ["sức khỏe", "y tế", "bác sĩ", "bệnh", "thuốc", "bệnh viện", "phòng khám", "điều trị", "bệnh nhân", "cấp cứu", "khỏe", "nha khoa", "thể dục", "dược", "khám", "chữa", "triệu chứng"] },
  { id: "tech", nameVi: "Công nghệ thông tin", enName: "Tech & IT", icon: "💻", keywords: ["công nghệ", "phần mềm", "máy tính", "mạng", "dữ liệu", "internet", "tin học", "lập trình", "ứng dụng", "thiết bị", "kỹ thuật số", "điện tử", "web", "phần cứng", "máy móc", "cài đặt"] },
  { id: "restaurant", nameVi: "Nhà hàng & Dịch vụ", enName: "Restaurants & Services", icon: "🍽️", keywords: ["nhà hàng", "món ăn", "bữa ăn", "thực đơn", "phục vụ", "bếp", "đầu bếp", "đồ uống", "quán", "cà phê", "ăn uống", "đặt bàn", "thức ăn", "nhà trọ", "tiệc", "khách", "ăn", "uống", "giải khát"] },
  { id: "legal", nameVi: "Pháp lý & Hợp đồng", enName: "Legal & Contracts", icon: "⚖️", keywords: ["pháp lý", "hợp đồng", "luật", "quy định", "tòa án", "kiện", "thỏa thuận", "chính sách", "điều khoản", "bồi thường", "nghĩa vụ", "chữ ký", "thương lượng", "bảo hộ", "quyền", "luật sư"] },
  { id: "property", nameVi: "Bất động sản & Xây dựng", enName: "Property & Construction", icon: "🏗️", keywords: ["bất động sản", "xây dựng", "tòa nhà", "căn hộ", "thuê", "kiến trúc", "bảo trì", "nhà ở", "cơ sở hạ tầng", "sửa chữa", "đất", "công trường", "xây", "bảo dưỡng"] },
  { id: "business", nameVi: "Kinh doanh & Tập đoàn", enName: "Business", icon: "💼", keywords: ["kinh doanh", "công ty", "tập đoàn", "xí nghiệp", "đối tác", "thương mại", "mậu dịch", "báo cáo thường niên", "cạnh tranh", "cổ phần", "đối thủ", "hãng", "doanh nghiệp", "thương gia", "thành lập", "ban giám đốc"] },
  { id: "logistics", nameVi: "Nhập khẩu & Vận chuyển", enName: "Logistics & Import/Export", icon: "📦", keywords: ["nhập khẩu", "xuất khẩu", "kho", "kho bãi", "vận đơn", "đóng gói", "giao hàng", "vận chuyển", "nhà cung cấp", "phân phối", "chuyển phát", "lô hàng", "hải quan"] },
  { id: "communication", nameVi: "Giao tiếp & Truyền thông", enName: "Communication", icon: "📡", keywords: ["giao tiếp", "thông báo", "tin nhắn", "truyền thông", "thảo luận", "trình bày", "thuyết trình", "báo chí", "tin tức", "liên lạc", "thông tin", "đàm phán", "thư từ", "bưu điện", "email"] }
];

async function main() {
  console.log("🚀 Starting Semantic Bulk Excel Import...");

  const filePath = "c:\\TOIEC VOCABULARY\\Danh sách 1000 từ vựng tiếng Anh TOEIC.xlsx";
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found at path: ${filePath}`);
    process.exit(1);
  }

  const workbook = xlsx.readFile(filePath);
  const data = xlsx.utils.sheet_to_json<any[]>(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });
  const rows = data.slice(1).filter(r => r.length >= 4 && r[1]); 

  console.log(`📊 Found ${rows.length} valid words in Excel.`);

  // Mapping engine
  const semanticBuckets: Record<string, any[]>  = {};
  semanticTopics.forEach(t => semanticBuckets[t.id] = []);
  const generalWords: any[] = [];

  for (const row of rows) {
    const meaning = row[4] ? row[4].toString().toLowerCase() : "";
    let assigned = false;
    for (const topic of semanticTopics) {
      if (topic.keywords.some(kw => meaning.includes(kw))) {
        semanticBuckets[topic.id].push(row);
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      generalWords.push(row);
    }
  }

  // Clear existing
  console.log("🧹 Clearing old data...");
  await prisma.vocabProgress.deleteMany({});
  await prisma.word.deleteMany({});
  await prisma.vocabTopic.deleteMany({});

  let globalOrder = 10;
  
  // 1. Insert Semantic Topics
  for (const topicConfig of semanticTopics) {
    const chunk = semanticBuckets[topicConfig.id];
    if (chunk.length === 0) continue;

    console.log(`Creating Topic: ${topicConfig.nameVi} (${chunk.length} words)`);
    
    const topic = await prisma.vocabTopic.create({
      data: {
        name: topicConfig.enName,
        nameVi: `CĐ: ${topicConfig.nameVi}`,
        description: `Nhóm từ vựng chuyên ngành thuộc lĩnh vực ${topicConfig.nameVi}. Nắm vững các từ này sẽ giúp ích rất lớn cho bài đọc hiểu TOEIC.`,
        icon: topicConfig.icon,
        order: globalOrder,
      }
    });

    const wordsToCreate = chunk.map(row => buildWord(row, topic.id));
    await prisma.word.createMany({ data: wordsToCreate });
    globalOrder += 10;
  }

  // 2. Insert General/Other words in chunks alphabetically
  const BATCH_SIZE = 50;
  for (let i = 0; i < generalWords.length; i += BATCH_SIZE) {
    const chunk = generalWords.slice(i, i + BATCH_SIZE);
    
    const firstWord = chunk[0][1].toString().trim();
    const lastWord = chunk[chunk.length - 1][1].toString().trim();
    const firstLetter = firstWord.charAt(0).toUpperCase();
    const lastLetter = lastWord.charAt(0).toUpperCase();
    let letterRange = firstLetter !== lastLetter ? `${firstLetter} - ${lastLetter}` : firstLetter;
    
    const topic = await prisma.vocabTopic.create({
      data: {
        name: `General Vocabulary: ${letterRange}`,
        nameVi: `Từ vựng thông dụng: Nhóm ${letterRange}`,
        description: `Tập hợp các từ vựng thông dụng quan trọng từ '${firstWord}' đến '${lastWord}'. Bao gồm ${chunk.length} từ.`,
        icon: "📘",
        order: globalOrder,
      }
    });

    const wordsToCreate = chunk.map(row => buildWord(row, topic.id));
    await prisma.word.createMany({ data: wordsToCreate });
    globalOrder += 10;
  }

  console.log("🎉 Semantic Bulk import completed successfully!");
}

function buildWord(row: any[], topicId: string) {
  const wordStr = row[1] ? row[1].toString().trim() : "unknown";
  return {
    word: wordStr,
    partOfSpeech: row[2] ? row[2].toString().trim() : "n",
    pronunciation: row[3] ? row[3].toString().trim() : "/.../",
    meaningVi: row[4] ? row[4].toString().trim() : "chưa có nghĩa",
    meaningEn: "A common TOEIC vocabulary word.",
    example: `I need to learn the word "${wordStr}" for the TOEIC exam.`,
    exampleVi: `Tôi cần học từ "${wordStr}" cho kỳ thi TOEIC.`,
    topicId
  };
}

main()
  .catch((e) => {
    console.error("❌ Error during bulk import:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
