import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rawWords = [
  { word: "ability", pos: "n", pr: "/əˈbɪl.ə.t̬i/", m: "năng lực, khả năng", en: "The power or skill to do something", ex: "He has the ability to manage complex projects effectively.", exVi: "Anh ấy có khả năng quản lý các dự án phức tạp một cách hiệu quả." },
  { word: "abroad", pos: "adv", pr: "/əˈbrɑːd/", m: "ở nước ngoài", en: "In or to a foreign country", ex: "Many students dream of studying abroad for better opportunities.", exVi: "Nhiều sinh viên mơ ước đi du học để có cơ hội tốt hơn." },
  { word: "accept", pos: "v", pr: "/əkˈsept/", m: "chấp nhận, chấp thuận", en: "To agree to take something", ex: "The committee decided to accept the proposal.", exVi: "Ủy ban đã quyết định chấp nhận bản đề xuất." },
  { word: "access", pos: "n, v", pr: "/ˈæk.ses/", m: "quyền truy cập, sự tiếp cận", en: "The right or opportunity to use something", ex: "Only authorized personnel have access to the server room.", exVi: "Chỉ những nhân viên được ủy quyền mới có quyền truy cập vào phòng máy chủ." },
  { word: "accessible", pos: "adj", pr: "/əkˈses.ə.bəl/", m: "khả năng tiếp cận được", en: "Able to be reached or entered", ex: "The building is fully accessible to wheelchair users.", exVi: "Tòa nhà hoàn toàn có thể tiếp cận được đối với người dùng xe lăn." },
  { word: "accident", pos: "n", pr: "/ˈæk.sə.dənt/", m: "tai nạn, sự tình cờ", en: "An unfortunate event that happens unexpectedly", ex: "The report analyzed the cause of the traffic accident.", exVi: "Bản báo cáo đã phân tích nguyên nhân của vụ tai nạn giao thông." },
  { word: "accommodate", pos: "v", pr: "/əˈkɑː.mə.deɪt/", m: "dàn xếp, hỗ trợ", en: "To provide space or help for someone", ex: "The hotel can accommodate up to 500 guests.", exVi: "Khách sạn có thể chứa được tới 500 khách." },
  { word: "accomplish", pos: "v", pr: "/əˈkɑːm.plɪʃ/", m: "hoàn thành, thực hiện", en: "To finish something successfully", ex: "We can accomplish anything with teamwork.", exVi: "Chúng ta có thể hoàn thành bất cứ việc gì bằng sự phối hợp đội nhóm." },
  { word: "according (to)", pos: "prep", pr: "/əˈkɔːr.dɪŋ ˌtuː/", m: "theo như, dựa vào", en: "As stated by or on the authority of", ex: "According to the contract, the work must be finished by Friday.", exVi: "Theo hợp đồng, công việc phải được hoàn thành trước thứ Sáu." },
  { word: "accordingly", pos: "adv", pr: "/əˈkɔːr.dɪŋ.li/", m: "theo đó, vì vậy", en: "In a way that is appropriate to the circumstances", ex: "We have to plan our budget accordingly.", exVi: "Chúng ta phải lập kế hoạch ngân sách của mình sao cho phù hợp." },
  { word: "accounting", pos: "n", pr: "/əˈkaʊn.t̬ɪŋ/", m: "sự tính toán, thanh toán", en: "The process of keeping financial accounts", ex: "She is studying for a career in accounting.", exVi: "Cô ấy đang học để theo đuổi sự nghiệp trong ngành kế toán." },
  { word: "accurate", pos: "adj", pr: "/ˈæk.jɚ.ət/", m: "đúng đắn, chính xác", en: "Correct and without errors", ex: "Please ensure all financial data is accurate.", exVi: "Hãy đảm bảo rằng tất cả dữ liệu tài chính đều chính xác." },
  { word: "achieve", pos: "v", pr: "/əˈtʃiːv/", m: "đạt được, giành được", en: "To succeed in finishing something", ex: "She worked hard to achieve her sales targets.", exVi: "Cô ấy đã làm việc chăm chỉ để đạt được mục tiêu doanh số." },
  { word: "acquire", pos: "v", pr: "/əˈkwaɪɚ/", m: "thu nạp được, giành được", en: "To get or buy something", ex: "The company plans to acquire its competitor next year.", exVi: "Công ty có kế hoạch mua lại đối thủ cạnh tranh vào năm tới." },
  { word: "act", pos: "n, v", pr: "/ækt/", m: "hành động; thực hiện", en: "To do something for a particular purpose", ex: "We must act quickly to solve this problem.", exVi: "Chúng ta phải hành động nhanh chóng để giải quyết vấn đề này." },
  { word: "actually", pos: "adv", pr: "/ˈæk.tʃu.ə.li/", m: "thực sự, trên thực tế", en: "In fact or really", ex: "I actually finished the report ahead of schedule.", exVi: "Tôi thực sự đã hoàn thành bản báo cáo trước thời hạn." },
  { word: "adapt", pos: "v", pr: "/əˈdæpt/", m: "thích nghi, thích ứng", en: "To become adjusted to new conditions", ex: "It took him a while to adapt to the new office culture.", exVi: "Anh ấy đã mất một thời gian để thích nghi với văn hóa văn phòng mới." },
  { word: "adapter", pos: "n", pr: "/əˈdæp.tɚ/", m: "thiết bị chuyển đổi", en: "A device for connecting pieces of equipment", ex: "You'll need a power adapter for your trip to Europe.", exVi: "Bạn sẽ cần một bộ chuyển đổi nguồn cho chuyến đi đến Châu Âu." },
  { word: "additional", pos: "adj", pr: "/əˈdɪʃ.ən.əl/", m: "thêm vào, phụ thêm", en: "Extra or more than planned", ex: "Is there any additional information I should know?", exVi: "Có thông tin bổ sung nào tôi nên biết không?" },
  { word: "adjust", pos: "v", pr: "/əˈdʒʌst/", m: "điều chỉnh", en: "To change slightly to make it better", ex: "You can adjust the seat height for better comfort.", exVi: "Bạn có thể điều chỉnh độ cao của ghế để thoải mái hơn." },
  { word: "adjustment", pos: "n", pr: "/əˈdʒʌst.mənt/", m: "sự điều chỉnh, sự thay đổi", en: "A small change made to something", ex: "The technician made a quick adjustment to the machine.", exVi: "Kỹ thuật viên đã thực hiện một sự điều chỉnh nhanh chóng đối với máy móc." },
  { word: "administration", pos: "n", pr: "/ədˌmɪn.əˈstreɪ.ʃən/", m: "sự quản lý, quản trị", en: "The management of public or business affairs", ex: "He has a degree in business administration.", exVi: "Anh ấy có bằng quản trị kinh doanh." },
  { word: "admire", pos: "v", pr: "/ədˈmaɪr/", m: "ngưỡng mộ, thán phục", en: "To respect or approve of someone", ex: "Everyone admires his dedication to the work.", exVi: "Mọi người đều ngưỡng mộ sự tận tâm của anh ấy đối với công việc." },
  { word: "admit", pos: "v", pr: "/ədˈmɪt/", m: "thừa nhận; tiếp nhận", en: "To confess that something is true", ex: "He refused to admit his mistake during the meeting.", exVi: "Anh ấy đã từ chối thừa nhận sai lầm của mình trong cuộc họp." },
  { word: "admittance", pos: "n", pr: "/ədˈmɪt̬.əns/", m: "sự thu nạp, đón nhận", en: "Permission to enter a place or join a group", ex: "No admittance to authorized staff only.", exVi: "Không phận sự miễn vào (chỉ dành cho nhân viên)." },
  { word: "adopt", pos: "v", pr: "/əˈdɑːpt/", m: "nhân nuôi; áp dụng", en: "To start using a new method or idea", ex: "The company decided to adopt a more flexible work schedule.", exVi: "Công ty đã quyết định áp dụng một lịch làm việc linh hoạt hơn." },
  { word: "advance", pos: "n, v", pr: "/ədˈvæns/", m: "sự tiến lên; tiến lên phía trước", en: "Progress or a development", ex: "Recent advances in technology have changed our lives.", exVi: "Những tiến bộ gần đây trong công nghệ đã thay đổi cuộc sống của chúng ta." },
  { word: "advanced", pos: "adj", pr: "/ədˈvænst/", m: "tiến bộ, cấp tiến", en: "Modern and recently developed", ex: "This is a course for advanced students only.", exVi: "Đây là khóa học chỉ dành cho sinh viên trình độ cao." },
  { word: "advantage", pos: "n", pr: "/ədˈvæn.t̬ɪdʒ/", m: "lợi thế", en: "A condition that puts one in a favorable position", ex: "One advantage of this software is its ease of use.", exVi: "Một lợi thế của phần mềm này là tính dễ sử dụng." },
  { word: "advantageous", pos: "adj", pr: "/ˌæd.vænˈteɪ.dʒəs/", m: "có lợi, thuận lợi", en: "Giving an advantage; favorable", ex: "The new tax law is advantageous to small businesses.", exVi: "Luật thuế mới có lợi cho các doanh nghiệp nhỏ." },
  { word: "advertise", pos: "v", pr: "/ˈæd.vɚ.taɪz/", m: "quảng cáo, thông báo", en: "To promote a product or service", ex: "The company will advertise their new product on TV.", exVi: "Công ty sẽ quảng cáo sản phẩm mới của họ trên tivi." },
  { word: "advertisement", pos: "n", pr: "/æd.vɝːˈtaɪz.mənt/", m: "bản tin quảng cáo", en: "A notice or announcement in a public medium", ex: "I saw an advertisement for a job in the newspaper.", exVi: "Tôi thấy một mẩu quảng cáo việc làm trên báo." },
  { word: "advice", pos: "n", pr: "/ədˈvaɪs/", m: "lời khuyên, lời chỉ bảo", en: "An opinion or recommendation offered", ex: "I need some financial advice regarding my investment.", exVi: "Tôi cần một vài lời khuyên tài chính về khoản đầu tư của mình." },
  { word: "advise", pos: "v", pr: "/ədˈvaɪz/", m: "đưa ra lời khuyên", en: "To offer suggestions about what should be done", ex: "We advise you to book your tickets in advance.", exVi: "Chúng tôi khuyên bạn nên đặt vé trước." },
  { word: "affect", pos: "v", pr: "/əˈfekt/", m: "ảnh hưởng, tác động", en: "To have an influence on someone or something", ex: "The new regulations will affect how we do business.", exVi: "Các quy định mới sẽ ảnh hưởng đến cách chúng tôi kinh doanh." },
  { word: "afford", pos: "v", pr: "/əˈfɔːrd/", m: "có khả năng chi trả", en: "To have enough money to pay for something", ex: "We can't afford to lose any more customers.", exVi: "Chúng ta không thể để mất thêm bất kỳ khách hàng nào nữa." },
  { word: "affordable", pos: "adj", pr: "/əˈfɔːr.də.bəl/", m: "có khả năng chi trả", en: "Relatively inexpensive; reasonably priced", ex: "The company provides affordable housing for its employees.", exVi: "Công ty cung cấp nhà ở giá rẻ cho nhân viên của mình." },
  { word: "agency", pos: "n", pr: "/ˈeɪ.dʒən.si/", m: "đại lý, trung gian", en: "A business or organization providing a service", ex: "We hired an advertising agency to promote the campaign.", exVi: "Chúng tôi đã thuê một công ty quảng cáo để thúc đẩy chiến dịch." },
  { word: "agenda", pos: "n", pr: "/əˈdʒen.də/", m: "chương trình nghị sự", en: "A list of items to be discussed at a meeting", ex: "The first item on the agenda is the budget review.", exVi: "Mục đầu tiên trong chương trình nghị sự là xem xét ngân sách." },
  { word: "agree", pos: "v", pr: "/əˈɡriː/", m: "đồng ý, tán thành", en: "To have the same opinion", ex: "I agree with your assessment of the situation.", exVi: "Tôi đồng ý với đánh giá của bạn về tình hình." },
  { word: "agreeable", pos: "adj", pr: "/əˈɡriː.ə.bəl/", m: "dễ chịu; thích hợp", en: "Pleasant or willing to agree", ex: "She is an agreeable person to work with.", exVi: "Cô ấy là một người dễ làm việc cùng." },
  { word: "agreement", pos: "n", pr: "/əˈɡriː.mənt/", m: "hợp đồng, giao kèo", en: "A negotiated and typically legally binding arrangement", ex: "They reached an agreement after long negotiations.", exVi: "Họ đã đạt được một thỏa thuận sau những cuộc đàm phán dài." },
  { word: "agricultural", pos: "adj", pr: "/ˌæɡ.rəˈkʌl.tʃɚ.əl/", m: "thuộc nông nghiệp", en: "Relating to agriculture or farming", ex: "The country's economy depends on agricultural exports.", exVi: "Nền kinh tế của đất nước phụ thuộc vào xuất khẩu nông sản." },
  { word: "aid", pos: "n, v", pr: "/eɪd/", m: "sự giúp đỡ; cứu trợ", en: "Help, typically of a practical or financial nature", ex: "The charity provides aid to people in need.", exVi: "Tổ chức từ thiện cung cấp sự viện trợ cho những người có hoàn cảnh khó khăn." },
  { word: "aim", pos: "n, v", pr: "/eɪm/", m: "mục tiêu; nhắm đến", en: "A result that your plans or actions are intended to achieve", ex: "Our primary aim is to increase customer satisfaction.", exVi: "Mục tiêu chính của chúng tôi là tăng mức độ hài lòng của khách hàng." },
];

async function main() {
  console.log("🚀 Starting clean vocab import...");

  // 1. Create the Topic
  const topic = await prisma.vocabTopic.create({
    data: {
      name: "TOEIC Mastery - Vol 1",
      nameVi: "TOEIC Thông dụng - Tập 1",
      description: "Hành trình chinh phục 1000 từ vựng TOEIC khởi đầu với 50 từ căn bản đầu tiên.",
      icon: "Star",
      order: 10,
    },
  });

  console.log(`✅ Created topic: ${topic.nameVi}`);

  // 2. Map and Insert Words
  const wordsToCreate = rawWords.map(w => ({
    word: w.word,
    partOfSpeech: w.pos,
    pronunciation: w.pr,
    meaningVi: w.m,
    meaningEn: w.en || "A vital TOEIC vocabulary term.",
    example: w.ex || `Essential context for ${w.word}.`,
    exampleVi: w.exVi || `Ví dụ tiêu biểu cho từ ${w.word}.`,
    topicId: topic.id,
  }));

  const result = await prisma.word.createMany({
    data: wordsToCreate,
  });

  console.log(`🎉 Success! Imported ${result.count} words into '${topic.nameVi}'`);
}

main()
  .catch((e) => {
    console.error("❌ Error during import:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
