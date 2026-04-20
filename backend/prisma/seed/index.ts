import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/utils/hash';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── 1. Create demo user ────────────────────────────────
  const password = await hashPassword('demo1234');
  const user = await prisma.user.upsert({
    where: { email: 'demo@toeic.vn' },
    update: {},
    create: {
      email: 'demo@toeic.vn',
      name: 'Nguyễn Văn Demo',
      password,
      role: 'STUDENT',
      targetScore: 750,
    },
  });
  console.log(`  ✅ Demo user: ${user.email}`);

  // ─── 2. Vocabulary topics & words ───────────────────────
  const topics = [
    {
      name: 'Office & Business',
      nameVi: 'Văn phòng & Kinh doanh',
      description: 'Từ vựng về môi trường làm việc văn phòng',
      icon: '🏢',
      order: 1,
      words: [
        { word: 'agenda', pronunciation: '/əˈdʒendə/', partOfSpeech: 'noun', meaningVi: 'Chương trình nghị sự', meaningEn: 'A list of items to be discussed at a meeting', example: 'Please review the agenda before the meeting.', exampleVi: 'Vui lòng xem lại chương trình nghị sự trước cuộc họp.' },
        { word: 'deadline', pronunciation: '/ˈdedlaɪn/', partOfSpeech: 'noun', meaningVi: 'Hạn chót', meaningEn: 'The latest time by which something must be completed', example: 'The deadline for the project is next Friday.', exampleVi: 'Hạn chót cho dự án là thứ Sáu tuần tới.' },
        { word: 'colleague', pronunciation: '/ˈkɑːliːɡ/', partOfSpeech: 'noun', meaningVi: 'Đồng nghiệp', meaningEn: 'A person you work with', example: 'I discussed the proposal with my colleagues.', exampleVi: 'Tôi đã thảo luận đề xuất với các đồng nghiệp.' },
        { word: 'negotiate', pronunciation: '/nɪˈɡoʊʃieɪt/', partOfSpeech: 'verb', meaningVi: 'Đàm phán', meaningEn: 'To discuss in order to reach an agreement', example: 'We need to negotiate the terms of the contract.', exampleVi: 'Chúng ta cần đàm phán các điều khoản hợp đồng.' },
        { word: 'revenue', pronunciation: '/ˈrevənuː/', partOfSpeech: 'noun', meaningVi: 'Doanh thu', meaningEn: 'Income generated from business', example: 'The company reported strong revenue growth.', exampleVi: 'Công ty báo cáo tăng trưởng doanh thu mạnh.' },
        { word: 'implement', pronunciation: '/ˈɪmplɪment/', partOfSpeech: 'verb', meaningVi: 'Triển khai', meaningEn: 'To put a plan into action', example: 'We will implement the new strategy next quarter.', exampleVi: 'Chúng tôi sẽ triển khai chiến lược mới vào quý tới.' },
        { word: 'quarterly', pronunciation: '/ˈkwɔːrtərli/', partOfSpeech: 'adjective', meaningVi: 'Hàng quý', meaningEn: 'Happening every three months', example: 'The quarterly report is due tomorrow.', exampleVi: 'Báo cáo quý sẽ đến hạn vào ngày mai.' },
        { word: 'invoice', pronunciation: '/ˈɪnvɔɪs/', partOfSpeech: 'noun', meaningVi: 'Hóa đơn', meaningEn: 'A bill for goods or services', example: 'Please send the invoice to our accounting department.', exampleVi: 'Vui lòng gửi hóa đơn đến bộ phận kế toán.' },
        { word: 'postpone', pronunciation: '/poʊstˈpoʊn/', partOfSpeech: 'verb', meaningVi: 'Hoãn lại', meaningEn: 'To delay or reschedule', example: 'The meeting has been postponed until next week.', exampleVi: 'Cuộc họp đã được hoãn lại đến tuần sau.' },
        { word: 'supervisor', pronunciation: '/ˈsuːpərvaɪzər/', partOfSpeech: 'noun', meaningVi: 'Người giám sát', meaningEn: 'A person who oversees workers', example: 'Your supervisor will review your performance.', exampleVi: 'Người giám sát sẽ đánh giá hiệu suất của bạn.' },
      ],
    },
    {
      name: 'Finance & Banking',
      nameVi: 'Tài chính & Ngân hàng',
      description: 'Từ vựng liên quan đến tài chính và ngân hàng',
      icon: '💰',
      order: 2,
      words: [
        { word: 'deposit', pronunciation: '/dɪˈpɑːzɪt/', partOfSpeech: 'noun', meaningVi: 'Tiền gửi', meaningEn: 'Money placed in a bank account', example: 'I need to make a deposit at the bank.', exampleVi: 'Tôi cần gửi tiền tại ngân hàng.' },
        { word: 'withdraw', pronunciation: '/wɪðˈdrɔː/', partOfSpeech: 'verb', meaningVi: 'Rút tiền', meaningEn: 'To take money out of an account', example: 'You can withdraw cash from any ATM.', exampleVi: 'Bạn có thể rút tiền từ bất kỳ ATM nào.' },
        { word: 'interest rate', pronunciation: '/ˈɪntrəst reɪt/', partOfSpeech: 'noun', meaningVi: 'Lãi suất', meaningEn: 'The percentage charged for borrowing money', example: 'The interest rate on savings accounts is 2%.', exampleVi: 'Lãi suất trên tài khoản tiết kiệm là 2%.' },
        { word: 'mortgage', pronunciation: '/ˈmɔːrɡɪdʒ/', partOfSpeech: 'noun', meaningVi: 'Thế chấp', meaningEn: 'A loan to buy property', example: 'They applied for a mortgage to buy a house.', exampleVi: 'Họ đã đăng ký vay thế chấp để mua nhà.' },
        { word: 'budget', pronunciation: '/ˈbʌdʒɪt/', partOfSpeech: 'noun', meaningVi: 'Ngân sách', meaningEn: 'A financial plan', example: 'We need to stay within the budget.', exampleVi: 'Chúng ta cần giữ trong ngân sách.' },
        { word: 'investment', pronunciation: '/ɪnˈvestmənt/', partOfSpeech: 'noun', meaningVi: 'Đầu tư', meaningEn: 'The act of putting money into something for profit', example: 'Real estate is a good long-term investment.', exampleVi: 'Bất động sản là khoản đầu tư dài hạn tốt.' },
        { word: 'audit', pronunciation: '/ˈɔːdɪt/', partOfSpeech: 'noun', meaningVi: 'Kiểm toán', meaningEn: 'An official inspection of accounts', example: 'The company underwent an annual audit.', exampleVi: 'Công ty đã trải qua cuộc kiểm toán hàng năm.' },
        { word: 'transaction', pronunciation: '/trænˈzækʃən/', partOfSpeech: 'noun', meaningVi: 'Giao dịch', meaningEn: 'An exchange of money for goods/services', example: 'All transactions are recorded electronically.', exampleVi: 'Tất cả giao dịch được ghi nhận điện tử.' },
      ],
    },
    {
      name: 'Travel & Transportation',
      nameVi: 'Du lịch & Giao thông',
      description: 'Từ vựng về du lịch, sân bay, và giao thông',
      icon: '✈️',
      order: 3,
      words: [
        { word: 'itinerary', pronunciation: '/aɪˈtɪnəreri/', partOfSpeech: 'noun', meaningVi: 'Lịch trình', meaningEn: 'A planned route or journey', example: 'Please check the travel itinerary carefully.', exampleVi: 'Vui lòng kiểm tra lịch trình chuyến đi cẩn thận.' },
        { word: 'departure', pronunciation: '/dɪˈpɑːrtʃər/', partOfSpeech: 'noun', meaningVi: 'Khởi hành', meaningEn: 'The act of leaving', example: 'The departure time is 8:00 AM.', exampleVi: 'Giờ khởi hành là 8:00 sáng.' },
        { word: 'boarding pass', pronunciation: '/ˈbɔːrdɪŋ pæs/', partOfSpeech: 'noun', meaningVi: 'Thẻ lên máy bay', meaningEn: 'A pass for entering an aircraft', example: 'Please have your boarding pass ready.', exampleVi: 'Vui lòng chuẩn bị thẻ lên máy bay.' },
        { word: 'reservation', pronunciation: '/ˌrezərˈveɪʃən/', partOfSpeech: 'noun', meaningVi: 'Đặt chỗ', meaningEn: 'A booking arrangement', example: 'I have a reservation for two nights.', exampleVi: 'Tôi có đặt chỗ cho hai đêm.' },
        { word: 'accommodation', pronunciation: '/əˌkɑːməˈdeɪʃən/', partOfSpeech: 'noun', meaningVi: 'Nơi ở', meaningEn: 'A place to stay', example: 'The accommodation includes breakfast.', exampleVi: 'Nơi ở bao gồm bữa sáng.' },
        { word: 'customs', pronunciation: '/ˈkʌstəmz/', partOfSpeech: 'noun', meaningVi: 'Hải quan', meaningEn: 'The place at an airport where bags are checked', example: 'You must declare items at customs.', exampleVi: 'Bạn phải khai báo hàng hóa tại hải quan.' },
      ],
    },
  ];

  for (const topicData of topics) {
    const { words, ...topicInfo } = topicData;
    const topic = await prisma.vocabTopic.create({ data: topicInfo });
    for (const w of words) {
      await prisma.word.create({ data: { ...w, topicId: topic.id } });
    }
    console.log(`  ✅ Topic: ${topicInfo.nameVi} (${words.length} words)`);
  }

  // ─── 3. Questions (Part 5 - Incomplete Sentences) ──────
  const part5Questions = [
    { content: 'The manager asked all employees to submit their reports _____ Friday.', options: ['by', 'until', 'on', 'at'], answer: 'A', explanation: '"By Friday" means before or on Friday. "By" is used with deadlines.', difficulty: 'EASY', tags: ['prepositions', 'time'] },
    { content: 'Due to the _____ weather, the outdoor event has been canceled.', options: ['severe', 'severeness', 'severely', 'severing'], answer: 'A', explanation: 'An adjective is needed before the noun "weather". "Severe" is the correct adjective form.', difficulty: 'EASY', tags: ['adjectives', 'word-form'] },
    { content: 'The new software will _____ improve efficiency in the workplace.', options: ['significant', 'significantly', 'significance', 'signify'], answer: 'B', explanation: 'An adverb is needed to modify the verb "improve". "Significantly" is the adverb form.', difficulty: 'MEDIUM', tags: ['adverbs', 'word-form'] },
    { content: 'All participants must _____ for the conference at least one week in advance.', options: ['register', 'registering', 'registered', 'registration'], answer: 'A', explanation: 'After "must", we use the base form of the verb. "Register" is correct.', difficulty: 'EASY', tags: ['modals', 'verb-form'] },
    { content: 'The company is looking for candidates _____ have experience in marketing.', options: ['who', 'which', 'whom', 'whose'], answer: 'A', explanation: '"Who" is the subject relative pronoun for people. The candidates (people) "have experience".', difficulty: 'MEDIUM', tags: ['relative-pronouns'] },
    { content: 'Ms. Kim has been working for this company _____ over fifteen years.', options: ['for', 'since', 'during', 'while'], answer: 'A', explanation: '"For" is used with a duration of time (fifteen years). "Since" is used with a point in time.', difficulty: 'EASY', tags: ['prepositions', 'time'] },
    { content: 'The factory _____ closed temporarily due to equipment maintenance.', options: ['will be', 'will being', 'will been', 'will have be'], answer: 'A', explanation: 'Future passive: will + be + past participle. "Will be closed" is correct.', difficulty: 'MEDIUM', tags: ['passive-voice', 'future-tense'] },
    { content: 'Customer satisfaction has _____ increased since we launched the new service.', options: ['steady', 'steadily', 'steadiness', 'steadied'], answer: 'B', explanation: 'An adverb is needed to modify the verb "increased". "Steadily" means at a constant rate.', difficulty: 'MEDIUM', tags: ['adverbs', 'word-form'] },
    { content: 'The marketing team _____ a new campaign strategy at yesterday\'s meeting.', options: ['proposed', 'proposing', 'proposal', 'proposes'], answer: 'A', explanation: 'Past tense is needed because of "yesterday\'s meeting". "Proposed" is past tense.', difficulty: 'EASY', tags: ['past-tense', 'verb-form'] },
    { content: 'Employees are _____ to wear identification badges at all times.', options: ['required', 'requiring', 'requirement', 'require'], answer: 'A', explanation: '"Are required to" is passive voice meaning "must". It\'s a common TOEIC pattern.', difficulty: 'MEDIUM', tags: ['passive-voice', 'verb-form'] },
    { content: 'The new policy will take _____ at the beginning of next month.', options: ['effect', 'affect', 'effective', 'effectively'], answer: 'A', explanation: '"Take effect" is a fixed phrase meaning "to start being used/enforced".', difficulty: 'MEDIUM', tags: ['vocabulary', 'collocations'] },
    { content: '_____ the economic downturn, the company managed to increase its profits.', options: ['Despite', 'Although', 'Because', 'However'], answer: 'A', explanation: '"Despite" + noun phrase shows contrast. "Although" needs a full clause.', difficulty: 'HARD', tags: ['conjunctions', 'contrast'] },
    { content: 'The shipment is expected to arrive _____ than originally scheduled.', options: ['early', 'earlier', 'earliest', 'more early'], answer: 'B', explanation: '"Than" signals a comparison, so we need the comparative form "earlier".', difficulty: 'EASY', tags: ['comparatives'] },
    { content: 'Please make sure that all documents are _____ before the audit.', options: ['organizing', 'organization', 'organized', 'organize'], answer: 'C', explanation: 'After "are", we need a past participle for passive voice. "Are organized" means have been put in order.', difficulty: 'MEDIUM', tags: ['passive-voice'] },
    { content: 'The CEO will _____ the annual report at the shareholders\' meeting.', options: ['present', 'presence', 'presentation', 'presenting'], answer: 'A', explanation: 'After "will", use the base form of the verb. "Present" means to show/give formally.', difficulty: 'EASY', tags: ['modals', 'verb-form'] },
  ];

  for (const q of part5Questions) {
    await prisma.question.create({
      data: {
        part: 'PART5',
        type: 'SINGLE_CHOICE',
        content: q.content,
        options: JSON.stringify(q.options),
        answer: q.answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        tags: JSON.stringify(q.tags),
      },
    });
  }
  console.log(`  ✅ Part 5 questions: ${part5Questions.length}`);

  // ─── 4. Part 1 questions (Photographs) ─────────────────
  const part1Questions = [
    { content: 'A woman is typing on a laptop.', options: ['A woman is typing on a laptop.', 'A woman is talking on the phone.', 'A woman is reading a book.', 'A woman is writing on a whiteboard.'], answer: 'A', explanation: 'The picture shows a woman using a laptop computer.', difficulty: 'EASY', tags: ['office'] },
    { content: 'Two men are shaking hands.', options: ['Two men are shaking hands.', 'Two men are eating lunch.', 'Two men are looking at documents.', 'Two men are standing near a car.'], answer: 'A', explanation: 'The picture shows two businessmen shaking hands, likely sealing a deal.', difficulty: 'EASY', tags: ['business'] },
    { content: 'The shelves are stacked with products.', options: ['The store is closed for renovation.', 'The shelves are stacked with products.', 'A customer is paying at the register.', 'The shopping cart is empty.'], answer: 'B', explanation: 'The picture shows retail shelves full of merchandise.', difficulty: 'MEDIUM', tags: ['retail'] },
    { content: 'A waiter is serving food to guests.', options: ['The restaurant is empty.', 'A chef is cooking in the kitchen.', 'A waiter is serving food to guests.', 'Customers are waiting in line.'], answer: 'C', explanation: 'The picture shows a waiter bringing plates of food to diners.', difficulty: 'EASY', tags: ['dining'] },
    { content: 'Construction workers are building a structure.', options: ['Workers are planting trees.', 'The building has been completed.', 'Construction workers are building a structure.', 'The road is being repaired.'], answer: 'C', explanation: 'The picture shows construction workers at a building site.', difficulty: 'MEDIUM', tags: ['construction'] },
  ];

  for (const q of part1Questions) {
    await prisma.question.create({
      data: {
        part: 'PART1',
        type: 'SINGLE_CHOICE',
        content: q.content,
        options: JSON.stringify(q.options),
        answer: q.answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        tags: JSON.stringify(q.tags),
      },
    });
  }
  console.log(`  ✅ Part 1 questions: ${part1Questions.length}`);

  // ─── 5. Create a mini practice test ─────────────────────
  const allQuestions = await prisma.question.findMany({ take: 20 });
  const test = await prisma.test.create({
    data: {
      title: 'Mini Practice Test #1',
      description: 'Đề thi thử 20 câu bao gồm Part 1 và Part 5',
      duration: 1200, // 20 minutes
      isFullTest: false,
      totalQuestions: allQuestions.length,
    },
  });

  for (let i = 0; i < allQuestions.length; i++) {
    await prisma.testQuestion.create({
      data: { testId: test.id, questionId: allQuestions[i].id, order: i + 1 },
    });
  }
  console.log(`  ✅ Test: "${test.title}" (${allQuestions.length} questions)`);

  // ─── 6. Grammar lesson sample ───────────────────────────
  await prisma.grammarLesson.create({
    data: {
      title: 'Present Perfect Tense',
      titleVi: 'Thì hiện tại hoàn thành',
      content: `# Thì Hiện Tại Hoàn Thành (Present Perfect)

## Cấu trúc
- **Khẳng định:** S + have/has + V3/ed
- **Phủ định:** S + have/has + not + V3/ed
- **Nghi vấn:** Have/Has + S + V3/ed?

## Dấu hiệu nhận biết
- since, for, already, yet, just, ever, never, recently, so far, up to now

## Trong TOEIC
Thì này thường xuất hiện trong Part 5 và Part 6, đặc biệt khi có "since" hoặc "for".`,
      summary: 'Thì diễn tả hành động đã xảy ra trong quá khứ nhưng có kết quả ở hiện tại',
      examples: JSON.stringify([
        { en: 'She has worked here for five years.', vi: 'Cô ấy đã làm việc ở đây 5 năm.' },
        { en: 'I have already submitted the report.', vi: 'Tôi đã nộp báo cáo rồi.' },
        { en: 'Have you ever been to Japan?', vi: 'Bạn đã bao giờ đến Nhật Bản chưa?' },
      ]),
      order: 1,
      difficulty: 'EASY',
      exercises: JSON.stringify([
        { question: 'She _____ (work) here since 2019.', answer: 'has worked', type: 'fill' },
        { question: 'They _____ already _____ (finish) the project.', answer: 'have already finished', type: 'fill' },
      ]),
      tags: JSON.stringify(['tenses', 'present-perfect', 'part5', 'part6']),
    },
  });
  console.log('  ✅ Grammar lesson: Present Perfect Tense');

  console.log('\n🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });