import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/utils/hash';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── 1. Users ────────────────────────────────────────────
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

  await prisma.user.upsert({
    where: { email: 'admin@toeic.vn' },
    update: {},
    create: {
      email: 'admin@toeic.vn',
      name: 'Admin TOEIC',
      password: await hashPassword('admin1234'),
      role: 'ADMIN',
      targetScore: 900,
    },
  });
  console.log(`  ✅ Users created`);

  // ─── 2. Vocabulary Topics & Words ────────────────────────
  const topics = [
    {
      name: 'Office & Business', nameVi: 'Văn phòng & Kinh doanh',
      description: 'Từ vựng về môi trường làm việc văn phòng và kinh doanh', icon: '🏢', order: 1,
      words: [
        { word: 'agenda', pronunciation: '/əˈdʒendə/', partOfSpeech: 'noun', meaningVi: 'Chương trình nghị sự', meaningEn: 'A list of items to be discussed', example: 'Please review the agenda before the meeting.', exampleVi: 'Vui lòng xem lại chương trình trước cuộc họp.' },
        { word: 'deadline', pronunciation: '/ˈdedlaɪn/', partOfSpeech: 'noun', meaningVi: 'Hạn chót', meaningEn: 'The latest time by which something must be done', example: 'The deadline for the project is Friday.', exampleVi: 'Hạn chót của dự án là thứ Sáu.' },
        { word: 'colleague', pronunciation: '/ˈkɑːliːɡ/', partOfSpeech: 'noun', meaningVi: 'Đồng nghiệp', meaningEn: 'A person you work with', example: 'I discussed it with my colleagues.', exampleVi: 'Tôi đã thảo luận với các đồng nghiệp.' },
        { word: 'negotiate', pronunciation: '/nɪˈɡoʊʃieɪt/', partOfSpeech: 'verb', meaningVi: 'Đàm phán', meaningEn: 'To discuss to reach an agreement', example: 'We need to negotiate the contract terms.', exampleVi: 'Chúng ta cần đàm phán điều khoản hợp đồng.' },
        { word: 'revenue', pronunciation: '/ˈrevənuː/', partOfSpeech: 'noun', meaningVi: 'Doanh thu', meaningEn: 'Income generated from business', example: 'The company reported strong revenue growth.', exampleVi: 'Công ty báo cáo tăng trưởng doanh thu mạnh.' },
        { word: 'implement', pronunciation: '/ˈɪmplɪment/', partOfSpeech: 'verb', meaningVi: 'Triển khai', meaningEn: 'To put a plan into action', example: 'We will implement the new strategy next quarter.', exampleVi: 'Chúng tôi sẽ triển khai chiến lược mới vào quý tới.' },
        { word: 'quarterly', pronunciation: '/ˈkwɔːrtərli/', partOfSpeech: 'adjective', meaningVi: 'Hàng quý', meaningEn: 'Happening every three months', example: 'The quarterly report is due tomorrow.', exampleVi: 'Báo cáo quý đến hạn vào ngày mai.' },
        { word: 'invoice', pronunciation: '/ˈɪnvɔɪs/', partOfSpeech: 'noun', meaningVi: 'Hóa đơn', meaningEn: 'A bill for goods or services', example: 'Please send the invoice to accounting.', exampleVi: 'Vui lòng gửi hóa đơn đến kế toán.' },
        { word: 'postpone', pronunciation: '/poʊstˈpoʊn/', partOfSpeech: 'verb', meaningVi: 'Hoãn lại', meaningEn: 'To delay to a later time', example: 'The meeting has been postponed.', exampleVi: 'Cuộc họp đã được hoãn lại.' },
        { word: 'supervisor', pronunciation: '/ˈsuːpərvaɪzər/', partOfSpeech: 'noun', meaningVi: 'Người giám sát', meaningEn: 'A person who oversees workers', example: 'Your supervisor will review your performance.', exampleVi: 'Người giám sát sẽ đánh giá hiệu suất của bạn.' },
        { word: 'productivity', pronunciation: '/ˌproʊdʌkˈtɪvɪti/', partOfSpeech: 'noun', meaningVi: 'Năng suất', meaningEn: 'The effectiveness of productive effort', example: 'Remote work improved employee productivity.', exampleVi: 'Làm việc từ xa cải thiện năng suất nhân viên.' },
        { word: 'collaboration', pronunciation: '/kəˌlæbəˈreɪʃən/', partOfSpeech: 'noun', meaningVi: 'Sự hợp tác', meaningEn: 'Working jointly with others', example: 'Success requires collaboration between teams.', exampleVi: 'Thành công đòi hỏi sự hợp tác giữa các nhóm.' },
        { word: 'proposal', pronunciation: '/prəˈpoʊzəl/', partOfSpeech: 'noun', meaningVi: 'Đề xuất', meaningEn: 'A plan or suggestion put forward', example: 'The team submitted a proposal for the new project.', exampleVi: 'Nhóm đã nộp đề xuất cho dự án mới.' },
        { word: 'efficiency', pronunciation: '/ɪˈfɪʃənsi/', partOfSpeech: 'noun', meaningVi: 'Hiệu quả', meaningEn: 'Accomplishing tasks with minimal waste', example: 'We need to improve efficiency in our processes.', exampleVi: 'Chúng ta cần cải thiện hiệu quả trong quy trình.' },
        { word: 'strategy', pronunciation: '/ˈstrætədʒi/', partOfSpeech: 'noun', meaningVi: 'Chiến lược', meaningEn: 'A plan to achieve a goal', example: 'The marketing strategy was very successful.', exampleVi: 'Chiến lược marketing rất thành công.' },
      ],
    },
    {
      name: 'Finance & Banking', nameVi: 'Tài chính & Ngân hàng',
      description: 'Từ vựng liên quan đến tài chính, ngân hàng và kế toán', icon: '💰', order: 2,
      words: [
        { word: 'deposit', pronunciation: '/dɪˈpɑːzɪt/', partOfSpeech: 'noun', meaningVi: 'Tiền gửi / Đặt cọc', meaningEn: 'Money placed in a bank account', example: 'I need to make a deposit at the bank.', exampleVi: 'Tôi cần gửi tiền tại ngân hàng.' },
        { word: 'withdraw', pronunciation: '/wɪðˈdrɔː/', partOfSpeech: 'verb', meaningVi: 'Rút tiền', meaningEn: 'To take money out of an account', example: 'You can withdraw cash from any ATM.', exampleVi: 'Bạn có thể rút tiền từ bất kỳ ATM nào.' },
        { word: 'interest rate', pronunciation: '/ˈɪntrəst reɪt/', partOfSpeech: 'noun', meaningVi: 'Lãi suất', meaningEn: 'The percentage charged for borrowing money', example: 'The interest rate on savings is 2%.', exampleVi: 'Lãi suất tiền gửi là 2%.' },
        { word: 'mortgage', pronunciation: '/ˈmɔːrɡɪdʒ/', partOfSpeech: 'noun', meaningVi: 'Thế chấp', meaningEn: 'A loan secured against property', example: 'They applied for a mortgage to buy a house.', exampleVi: 'Họ đã đăng ký vay thế chấp để mua nhà.' },
        { word: 'budget', pronunciation: '/ˈbʌdʒɪt/', partOfSpeech: 'noun', meaningVi: 'Ngân sách', meaningEn: 'A financial plan for a period', example: 'We need to stay within the budget.', exampleVi: 'Chúng ta cần giữ trong ngân sách.' },
        { word: 'investment', pronunciation: '/ɪnˈvestmənt/', partOfSpeech: 'noun', meaningVi: 'Đầu tư', meaningEn: 'Money put in to gain profit', example: 'Real estate is a good investment.', exampleVi: 'Bất động sản là khoản đầu tư tốt.' },
        { word: 'audit', pronunciation: '/ˈɔːdɪt/', partOfSpeech: 'noun', meaningVi: 'Kiểm toán', meaningEn: 'An official inspection of accounts', example: 'The company underwent an annual audit.', exampleVi: 'Công ty đã trải qua kiểm toán hàng năm.' },
        { word: 'transaction', pronunciation: '/trænˈzækʃən/', partOfSpeech: 'noun', meaningVi: 'Giao dịch', meaningEn: 'An exchange of money or goods', example: 'All transactions are recorded digitally.', exampleVi: 'Tất cả giao dịch được ghi nhận kỹ thuật số.' },
        { word: 'balance', pronunciation: '/ˈbæləns/', partOfSpeech: 'noun', meaningVi: 'Số dư', meaningEn: 'The amount of money in an account', example: 'Please check your account balance.', exampleVi: 'Vui lòng kiểm tra số dư tài khoản.' },
        { word: 'dividend', pronunciation: '/ˈdɪvɪdend/', partOfSpeech: 'noun', meaningVi: 'Cổ tức', meaningEn: 'A payment made to shareholders', example: 'The company increased its annual dividend.', exampleVi: 'Công ty đã tăng cổ tức hàng năm.' },
        { word: 'expenditure', pronunciation: '/ɪkˈspendɪtʃər/', partOfSpeech: 'noun', meaningVi: 'Chi tiêu', meaningEn: 'Money spent on something', example: 'The government reduced public expenditure.', exampleVi: 'Chính phủ giảm chi tiêu công.' },
        { word: 'portfolio', pronunciation: '/pɔːrtˈfoʊlioʊ/', partOfSpeech: 'noun', meaningVi: 'Danh mục đầu tư', meaningEn: 'A range of investments held', example: 'She manages a diverse investment portfolio.', exampleVi: 'Cô ấy quản lý danh mục đầu tư đa dạng.' },
      ],
    },
    {
      name: 'Travel & Transportation', nameVi: 'Du lịch & Giao thông',
      description: 'Từ vựng về du lịch, sân bay, khách sạn và giao thông', icon: '✈️', order: 3,
      words: [
        { word: 'itinerary', pronunciation: '/aɪˈtɪnəreri/', partOfSpeech: 'noun', meaningVi: 'Lịch trình', meaningEn: 'A planned route or journey', example: 'Please check the travel itinerary carefully.', exampleVi: 'Vui lòng kiểm tra lịch trình cẩn thận.' },
        { word: 'departure', pronunciation: '/dɪˈpɑːrtʃər/', partOfSpeech: 'noun', meaningVi: 'Khởi hành', meaningEn: 'The act of leaving a place', example: 'The departure time is 8:00 AM.', exampleVi: 'Giờ khởi hành là 8:00 sáng.' },
        { word: 'boarding pass', pronunciation: '/ˈbɔːrdɪŋ pæs/', partOfSpeech: 'noun', meaningVi: 'Thẻ lên máy bay', meaningEn: 'A document for boarding aircraft', example: 'Please present your boarding pass.', exampleVi: 'Vui lòng xuất trình thẻ lên máy bay.' },
        { word: 'reservation', pronunciation: '/ˌrezərˈveɪʃən/', partOfSpeech: 'noun', meaningVi: 'Đặt chỗ', meaningEn: 'An arrangement to secure a place', example: 'I have a reservation for two nights.', exampleVi: 'Tôi có đặt chỗ cho hai đêm.' },
        { word: 'accommodation', pronunciation: '/əˌkɑːməˈdeɪʃən/', partOfSpeech: 'noun', meaningVi: 'Chỗ ở', meaningEn: 'A place to stay', example: 'The accommodation includes breakfast.', exampleVi: 'Chỗ ở bao gồm bữa sáng.' },
        { word: 'customs', pronunciation: '/ˈkʌstəmz/', partOfSpeech: 'noun', meaningVi: 'Hải quan', meaningEn: 'The border checkpoint for goods', example: 'You must declare items at customs.', exampleVi: 'Bạn phải khai báo hàng hóa tại hải quan.' },
        { word: 'layover', pronunciation: '/ˈleɪoʊvər/', partOfSpeech: 'noun', meaningVi: 'Thời gian quá cảnh', meaningEn: 'A stop between flights', example: 'We have a 3-hour layover in Singapore.', exampleVi: 'Chúng tôi có 3 giờ quá cảnh ở Singapore.' },
        { word: 'terminal', pronunciation: '/ˈtɜːrmɪnəl/', partOfSpeech: 'noun', meaningVi: 'Nhà ga', meaningEn: 'A building where passengers depart', example: 'Please proceed to terminal B.', exampleVi: 'Vui lòng đến nhà ga B.' },
        { word: 'luggage', pronunciation: '/ˈlʌɡɪdʒ/', partOfSpeech: 'noun', meaningVi: 'Hành lý', meaningEn: 'Bags and suitcases for travel', example: 'Your luggage allowance is 23kg.', exampleVi: 'Định mức hành lý của bạn là 23kg.' },
        { word: 'shuttle', pronunciation: '/ˈʃʌtl/', partOfSpeech: 'noun', meaningVi: 'Xe đưa đón', meaningEn: 'A vehicle making regular short trips', example: 'A free shuttle runs to the hotel.', exampleVi: 'Có xe đưa đón miễn phí đến khách sạn.' },
      ],
    },
    {
      name: 'Human Resources', nameVi: 'Nhân sự & Tuyển dụng',
      description: 'Từ vựng về tuyển dụng, phỏng vấn và quản lý nhân sự', icon: '👥', order: 4,
      words: [
        { word: 'applicant', pronunciation: '/ˈæplɪkənt/', partOfSpeech: 'noun', meaningVi: 'Người nộp đơn', meaningEn: 'A person who applies for a job', example: 'We received 200 applicants for the position.', exampleVi: 'Chúng tôi nhận được 200 đơn ứng tuyển cho vị trí này.' },
        { word: 'recruit', pronunciation: '/rɪˈkruːt/', partOfSpeech: 'verb', meaningVi: 'Tuyển dụng', meaningEn: 'To find people to join an organization', example: 'We are recruiting talented engineers.', exampleVi: 'Chúng tôi đang tuyển dụng kỹ sư tài năng.' },
        { word: 'resign', pronunciation: '/rɪˈzaɪn/', partOfSpeech: 'verb', meaningVi: 'Từ chức', meaningEn: 'To voluntarily leave a job', example: 'She decided to resign from her position.', exampleVi: 'Cô ấy quyết định từ chức.' },
        { word: 'promotion', pronunciation: '/prəˈmoʊʃən/', partOfSpeech: 'noun', meaningVi: 'Sự thăng chức', meaningEn: 'Advancement to a higher position', example: 'He received a promotion after exceeding targets.', exampleVi: 'Anh ấy được thăng chức sau khi vượt chỉ tiêu.' },
        { word: 'compensation', pronunciation: '/ˌkɑːmpənˈseɪʃən/', partOfSpeech: 'noun', meaningVi: 'Lương thưởng / Đền bù', meaningEn: 'Payment for work or damage', example: 'The compensation package includes health insurance.', exampleVi: 'Gói lương thưởng bao gồm bảo hiểm y tế.' },
        { word: 'probation', pronunciation: '/proʊˈbeɪʃən/', partOfSpeech: 'noun', meaningVi: 'Thử việc', meaningEn: 'A trial period for a new employee', example: 'The probation period is three months.', exampleVi: 'Thời gian thử việc là ba tháng.' },
        { word: 'reference', pronunciation: '/ˈrefərəns/', partOfSpeech: 'noun', meaningVi: 'Thư giới thiệu', meaningEn: 'A statement supporting a candidate', example: 'Please provide two professional references.', exampleVi: 'Vui lòng cung cấp hai người giới thiệu chuyên nghiệp.' },
        { word: 'appraisal', pronunciation: '/əˈpreɪzəl/', partOfSpeech: 'noun', meaningVi: 'Đánh giá (hiệu suất)', meaningEn: 'A formal assessment of an employee', example: 'Annual appraisals help employees improve.', exampleVi: 'Đánh giá hàng năm giúp nhân viên phát triển.' },
        { word: 'turnover', pronunciation: '/ˈtɜːrnoʊvər/', partOfSpeech: 'noun', meaningVi: 'Tỷ lệ thay thế nhân viên', meaningEn: 'The rate at which employees leave', example: 'High turnover is costly for companies.', exampleVi: 'Tỷ lệ thay thế cao tốn kém cho công ty.' },
        { word: 'outsource', pronunciation: '/ˈaʊtsɔːrs/', partOfSpeech: 'verb', meaningVi: 'Thuê ngoài', meaningEn: 'To obtain services from outside a company', example: 'We outsource our IT support.', exampleVi: 'Chúng tôi thuê ngoài bộ phận hỗ trợ IT.' },
        { word: 'workforce', pronunciation: '/ˈwɜːrkfɔːrs/', partOfSpeech: 'noun', meaningVi: 'Lực lượng lao động', meaningEn: 'The people employed in an organization', example: 'The company expanded its workforce by 30%.', exampleVi: 'Công ty mở rộng lực lượng lao động thêm 30%.' },
        { word: 'incentive', pronunciation: '/ɪnˈsentɪv/', partOfSpeech: 'noun', meaningVi: 'Khuyến khích / Phần thưởng', meaningEn: 'Something that motivates action', example: 'Bonuses serve as incentives for staff.', exampleVi: 'Tiền thưởng là động lực cho nhân viên.' },
      ],
    },
    {
      name: 'Marketing & Sales', nameVi: 'Marketing & Bán hàng',
      description: 'Từ vựng về marketing, quảng cáo và chiến lược bán hàng', icon: '📊', order: 5,
      words: [
        { word: 'campaign', pronunciation: '/kæmˈpeɪn/', partOfSpeech: 'noun', meaningVi: 'Chiến dịch', meaningEn: 'A series of planned activities to promote', example: 'The marketing campaign boosted sales by 40%.', exampleVi: 'Chiến dịch marketing tăng doanh số 40%.' },
        { word: 'brand', pronunciation: '/brænd/', partOfSpeech: 'noun', meaningVi: 'Thương hiệu', meaningEn: 'A name or symbol identifying a product', example: 'Building a strong brand takes years.', exampleVi: 'Xây dựng thương hiệu mạnh cần nhiều năm.' },
        { word: 'target market', pronunciation: '/ˈtɑːrɡɪt ˈmɑːrkɪt/', partOfSpeech: 'noun', meaningVi: 'Thị trường mục tiêu', meaningEn: 'A specific group of consumers aimed at', example: 'Our target market is young professionals.', exampleVi: 'Thị trường mục tiêu là người đi làm trẻ tuổi.' },
        { word: 'promotion', pronunciation: '/prəˈmoʊʃən/', partOfSpeech: 'noun', meaningVi: 'Khuyến mãi', meaningEn: 'Activities to advertise and sell something', example: 'The store ran a seasonal promotion.', exampleVi: 'Cửa hàng chạy chương trình khuyến mãi theo mùa.' },
        { word: 'market share', pronunciation: '/ˈmɑːrkɪt ʃer/', partOfSpeech: 'noun', meaningVi: 'Thị phần', meaningEn: 'The portion of a market held by a company', example: 'They gained 15% market share last year.', exampleVi: 'Họ đạt 15% thị phần năm ngoái.' },
        { word: 'competitive', pronunciation: '/kəmˈpetɪtɪv/', partOfSpeech: 'adjective', meaningVi: 'Cạnh tranh', meaningEn: 'Involving strong competition', example: 'This is a highly competitive industry.', exampleVi: 'Đây là ngành có tính cạnh tranh cao.' },
        { word: 'launch', pronunciation: '/lɔːntʃ/', partOfSpeech: 'verb', meaningVi: 'Ra mắt', meaningEn: 'To introduce a new product to the market', example: 'We will launch the product next month.', exampleVi: 'Chúng tôi sẽ ra mắt sản phẩm tháng tới.' },
        { word: 'demographics', pronunciation: '/ˌdeməˈɡræfɪks/', partOfSpeech: 'noun', meaningVi: 'Nhân khẩu học', meaningEn: 'Statistical data about a population', example: 'We analyze demographics to understand customers.', exampleVi: 'Chúng tôi phân tích nhân khẩu học để hiểu khách hàng.' },
        { word: 'endorsement', pronunciation: '/ɪnˈdɔːrsmənt/', partOfSpeech: 'noun', meaningVi: 'Sự chứng thực', meaningEn: 'Public support for a product', example: 'Celebrity endorsements increase brand awareness.', exampleVi: 'Chứng thực của người nổi tiếng tăng nhận thức thương hiệu.' },
        { word: 'testimonial', pronunciation: '/ˌtestɪˈmoʊniəl/', partOfSpeech: 'noun', meaningVi: 'Lời chứng thực khách hàng', meaningEn: 'A statement endorsing a product', example: 'Customer testimonials build trust.', exampleVi: 'Lời chứng thực của khách hàng xây dựng niềm tin.' },
        { word: 'slogan', pronunciation: '/ˈsloʊɡən/', partOfSpeech: 'noun', meaningVi: 'Khẩu hiệu', meaningEn: 'A short memorable phrase used in advertising', example: 'Nike\'s slogan is "Just Do It".', exampleVi: 'Khẩu hiệu của Nike là "Just Do It".' },
        { word: 'conversion rate', pronunciation: '/kənˈvɜːrʒən reɪt/', partOfSpeech: 'noun', meaningVi: 'Tỷ lệ chuyển đổi', meaningEn: 'The percentage of visitors who complete a goal', example: 'Improving the website increased conversion rate.', exampleVi: 'Cải thiện website tăng tỷ lệ chuyển đổi.' },
      ],
    },
    {
      name: 'Technology & IT', nameVi: 'Công nghệ & IT',
      description: 'Từ vựng về công nghệ thông tin và kỹ thuật số', icon: '💻', order: 6,
      words: [
        { word: 'software', pronunciation: '/ˈsɔːftwer/', partOfSpeech: 'noun', meaningVi: 'Phần mềm', meaningEn: 'Programs and operating info for computers', example: 'The software needs to be updated.', exampleVi: 'Phần mềm cần được cập nhật.' },
        { word: 'infrastructure', pronunciation: '/ˈɪnfrəstrʌktʃər/', partOfSpeech: 'noun', meaningVi: 'Cơ sở hạ tầng', meaningEn: 'Basic systems needed for operation', example: 'We upgraded our IT infrastructure.', exampleVi: 'Chúng tôi đã nâng cấp cơ sở hạ tầng IT.' },
        { word: 'cybersecurity', pronunciation: '/ˌsaɪbərsɪˈkjʊərɪti/', partOfSpeech: 'noun', meaningVi: 'An ninh mạng', meaningEn: 'Protection of computer systems from attacks', example: 'Cybersecurity is a top priority.', exampleVi: 'An ninh mạng là ưu tiên hàng đầu.' },
        { word: 'database', pronunciation: '/ˈdeɪtəbeɪs/', partOfSpeech: 'noun', meaningVi: 'Cơ sở dữ liệu', meaningEn: 'An organized collection of data', example: 'All records are stored in the database.', exampleVi: 'Tất cả hồ sơ được lưu trong cơ sở dữ liệu.' },
        { word: 'bandwidth', pronunciation: '/ˈbændwɪdθ/', partOfSpeech: 'noun', meaningVi: 'Băng thông', meaningEn: 'The capacity of a network connection', example: 'Streaming video requires high bandwidth.', exampleVi: 'Xem video streaming cần băng thông cao.' },
        { word: 'encryption', pronunciation: '/ɪnˈkrɪpʃən/', partOfSpeech: 'noun', meaningVi: 'Mã hóa', meaningEn: 'Converting data into code for security', example: 'Data encryption protects sensitive information.', exampleVi: 'Mã hóa dữ liệu bảo vệ thông tin nhạy cảm.' },
        { word: 'upgrade', pronunciation: '/ʌpˈɡreɪd/', partOfSpeech: 'verb', meaningVi: 'Nâng cấp', meaningEn: 'To improve or update a system', example: 'We need to upgrade to the latest version.', exampleVi: 'Chúng ta cần nâng cấp lên phiên bản mới nhất.' },
        { word: 'troubleshoot', pronunciation: '/ˈtrʌbəlʃuːt/', partOfSpeech: 'verb', meaningVi: 'Khắc phục sự cố', meaningEn: 'To identify and fix problems', example: 'IT will troubleshoot the network issue.', exampleVi: 'IT sẽ khắc phục sự cố mạng.' },
        { word: 'compatible', pronunciation: '/kəmˈpætɪbəl/', partOfSpeech: 'adjective', meaningVi: 'Tương thích', meaningEn: 'Able to work together', example: 'The software is compatible with all devices.', exampleVi: 'Phần mềm tương thích với tất cả thiết bị.' },
        { word: 'backup', pronunciation: '/ˈbækʌp/', partOfSpeech: 'noun', meaningVi: 'Sao lưu', meaningEn: 'A copy of data for emergencies', example: 'Always keep a backup of important files.', exampleVi: 'Luôn giữ bản sao lưu các tệp quan trọng.' },
      ],
    },
  ];

  for (const topicData of topics) {
    const existing = await prisma.vocabTopic.findFirst({ where: { name: topicData.name } });
    if (existing) continue;
    const { words, ...topicInfo } = topicData;
    const topic = await prisma.vocabTopic.create({ data: topicInfo });
    for (const w of words) {
      await prisma.word.create({ data: { ...w, topicId: topic.id } });
    }
    console.log(`  ✅ Topic: ${topicInfo.nameVi} (${words.length} words)`);
  }

  // ─── 3. Part 5 Questions (30 questions) ──────────────────
  const existingPart5 = await prisma.question.count({ where: { part: 'PART5' } });
  if (existingPart5 === 0) {
    const part5Questions = [
      { content: 'The manager asked all employees to submit their reports _____ Friday.', options: ['by', 'until', 'on', 'at'], answer: 'A', explanation: '"By Friday" means before or on Friday. "By" is used with deadlines.', difficulty: 'EASY', tags: ['prepositions', 'time'] },
      { content: 'Due to the _____ weather, the outdoor event has been canceled.', options: ['severe', 'severeness', 'severely', 'severing'], answer: 'A', explanation: 'An adjective is needed before "weather". "Severe" is the correct adjective form.', difficulty: 'EASY', tags: ['adjectives', 'word-form'] },
      { content: 'The new software will _____ improve efficiency in the workplace.', options: ['significant', 'significantly', 'significance', 'signify'], answer: 'B', explanation: 'An adverb is needed to modify the verb "improve". "Significantly" is the adverb form.', difficulty: 'MEDIUM', tags: ['adverbs', 'word-form'] },
      { content: 'All participants must _____ for the conference at least one week in advance.', options: ['register', 'registering', 'registered', 'registration'], answer: 'A', explanation: 'After "must", we use the base form of the verb.', difficulty: 'EASY', tags: ['modals', 'verb-form'] },
      { content: 'The company is looking for candidates _____ have experience in marketing.', options: ['who', 'which', 'whom', 'whose'], answer: 'A', explanation: '"Who" is the subject relative pronoun for people.', difficulty: 'MEDIUM', tags: ['relative-pronouns'] },
      { content: 'Ms. Kim has been working for this company _____ fifteen years.', options: ['for', 'since', 'during', 'while'], answer: 'A', explanation: '"For" is used with a duration of time.', difficulty: 'EASY', tags: ['prepositions', 'time'] },
      { content: 'The factory _____ closed temporarily due to equipment maintenance.', options: ['will be', 'will being', 'will been', 'will have be'], answer: 'A', explanation: 'Future passive: will + be + past participle.', difficulty: 'MEDIUM', tags: ['passive-voice', 'future-tense'] },
      { content: 'Customer satisfaction has _____ increased since we launched the new service.', options: ['steady', 'steadily', 'steadiness', 'steadied'], answer: 'B', explanation: 'An adverb is needed to modify "increased". "Steadily" means at a constant rate.', difficulty: 'MEDIUM', tags: ['adverbs', 'word-form'] },
      { content: 'The marketing team _____ a new campaign strategy at yesterday\'s meeting.', options: ['proposed', 'proposing', 'proposal', 'proposes'], answer: 'A', explanation: 'Past tense is needed because of "yesterday". "Proposed" is past tense.', difficulty: 'EASY', tags: ['past-tense', 'verb-form'] },
      { content: 'Employees are _____ to wear identification badges at all times.', options: ['required', 'requiring', 'requirement', 'require'], answer: 'A', explanation: '"Are required to" is passive voice meaning "must".', difficulty: 'MEDIUM', tags: ['passive-voice', 'verb-form'] },
      { content: 'The new policy will take _____ at the beginning of next month.', options: ['effect', 'affect', 'effective', 'effectively'], answer: 'A', explanation: '"Take effect" is a fixed phrase meaning "to start being enforced".', difficulty: 'MEDIUM', tags: ['vocabulary', 'collocations'] },
      { content: '_____ the economic downturn, the company managed to increase its profits.', options: ['Despite', 'Although', 'Because', 'However'], answer: 'A', explanation: '"Despite" + noun phrase shows contrast. "Although" needs a full clause.', difficulty: 'HARD', tags: ['conjunctions', 'contrast'] },
      { content: 'The shipment is expected to arrive _____ than originally scheduled.', options: ['early', 'earlier', 'earliest', 'more early'], answer: 'B', explanation: '"Than" signals a comparison, so comparative form "earlier" is needed.', difficulty: 'EASY', tags: ['comparatives'] },
      { content: 'Please make sure that all documents are _____ before the audit.', options: ['organizing', 'organization', 'organized', 'organize'], answer: 'C', explanation: 'After "are", we need a past participle for passive voice.', difficulty: 'MEDIUM', tags: ['passive-voice'] },
      { content: 'The CEO will _____ the annual report at the shareholders\' meeting.', options: ['present', 'presence', 'presentation', 'presenting'], answer: 'A', explanation: 'After "will", use base form of the verb. "Present" means to show formally.', difficulty: 'EASY', tags: ['modals', 'verb-form'] },
      { content: 'The sales team exceeded _____ targets by 20 percent last quarter.', options: ['its', 'their', 'our', 'your'], answer: 'B', explanation: '"Team" is being used as plural here (the team members), so "their" is correct.', difficulty: 'MEDIUM', tags: ['pronouns', 'possessives'] },
      { content: 'The conference room has been _____ for the board meeting this afternoon.', options: ['reserve', 'reserved', 'reserving', 'reservation'], answer: 'B', explanation: '"Has been reserved" is present perfect passive. Past participle needed.', difficulty: 'MEDIUM', tags: ['passive-voice', 'present-perfect'] },
      { content: 'Neither the director nor the managers _____ aware of the new regulation.', options: ['was', 'were', 'is', 'are'], answer: 'B', explanation: 'With "neither...nor", the verb agrees with the nearest subject "managers" (plural).', difficulty: 'HARD', tags: ['subject-verb-agreement'] },
      { content: 'The renovation work _____ completed by the end of this month.', options: ['is expected to be', 'expects to be', 'is expecting to', 'expected to be'], answer: 'A', explanation: '"Is expected to be completed" is passive: be expected + infinitive passive.', difficulty: 'HARD', tags: ['passive-voice', 'infinitive'] },
      { content: 'Staff _____ advised to arrive at least 30 minutes before the seminar begins.', options: ['are', 'is', 'was', 'being'], answer: 'A', explanation: '"Staff" is treated as plural. "Are advised" is present passive.', difficulty: 'MEDIUM', tags: ['passive-voice', 'subject-verb-agreement'] },
      { content: 'The company has _____ introduced a comprehensive training program for new hires.', options: ['recent', 'recently', 'recency', 'more recent'], answer: 'B', explanation: 'An adverb is needed to modify "introduced". "Recently" means not long ago.', difficulty: 'EASY', tags: ['adverbs'] },
      { content: 'The contract must be signed _____ the end of the business day.', options: ['before', 'after', 'since', 'among'], answer: 'A', explanation: '"Before the end" means prior to. This is the only logical preposition here.', difficulty: 'EASY', tags: ['prepositions'] },
      { content: 'Ms. Park was promoted _____ of her exceptional performance.', options: ['because', 'in spite', 'as a result', 'although'], answer: 'C', explanation: '"As a result of" correctly links the reason (performance) to the outcome (promotion).', difficulty: 'MEDIUM', tags: ['conjunctions', 'cause-effect'] },
      { content: 'The company\'s _____ strategy focuses on expanding into Asian markets.', options: ['grow', 'grew', 'growth', 'growing'], answer: 'C', explanation: 'A noun is needed to modify "strategy". "Growth strategy" is a compound noun.', difficulty: 'MEDIUM', tags: ['word-form', 'compound-nouns'] },
      { content: 'All employees should _____ themselves with the company\'s new data policy.', options: ['familiar', 'familiarity', 'familiarize', 'familiarly'], answer: 'C', explanation: '"Familiarize themselves" means to become familiar. A verb is needed here.', difficulty: 'HARD', tags: ['verb-form', 'reflexive'] },
      { content: '_____ the project deadline, the team worked overtime for two weeks.', options: ['To meet', 'Meeting', 'To meeting', 'Met'], answer: 'A', explanation: '"To meet" is an infinitive of purpose, explaining why they worked overtime.', difficulty: 'MEDIUM', tags: ['infinitive', 'purpose'] },
      { content: 'The report was submitted to management _____ review and approval.', options: ['to', 'for', 'in', 'with'], answer: 'B', explanation: '"For review and approval" shows purpose. "For" + noun expresses purpose.', difficulty: 'EASY', tags: ['prepositions'] },
      { content: 'Mr. Chen, _____ has been with the company for 20 years, will retire next month.', options: ['who', 'whom', 'that', 'whose'], answer: 'A', explanation: '"Who" is the subject relative pronoun in this non-restrictive clause.', difficulty: 'MEDIUM', tags: ['relative-clauses'] },
      { content: 'The manager asked whether the new system _____ properly tested before launch.', options: ['has been', 'had been', 'will be', 'was being'], answer: 'B', explanation: 'In indirect speech with past reporting verb, use past perfect "had been".', difficulty: 'HARD', tags: ['reported-speech', 'past-perfect'] },
      { content: 'Sales figures have been _____ steady despite challenging market conditions.', options: ['remain', 'remained', 'remaining', 'remarkably'], answer: 'D', explanation: 'An adverb is needed before "steady" to modify the adjective.', difficulty: 'HARD', tags: ['adverbs', 'word-form'] },
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
  }

  // ─── 4. Part 1 Questions (10 questions) ──────────────────
  const existingPart1 = await prisma.question.count({ where: { part: 'PART1' } });
  if (existingPart1 === 0) {
    const part1Questions = [
      { content: 'A woman is typing on a laptop computer.', options: ['A woman is typing on a laptop computer.', 'A woman is talking on the phone.', 'A woman is reading a book.', 'A woman is writing on a whiteboard.'], answer: 'A', explanation: 'The correct description shows a woman using a laptop.', difficulty: 'EASY', tags: ['office', 'woman', 'technology'] },
      { content: 'Two men are shaking hands in an office.', options: ['Two men are eating lunch.', 'Two men are shaking hands in an office.', 'Two men are looking at documents.', 'Two men are standing near a window.'], answer: 'B', explanation: 'The picture shows two businessmen shaking hands.', difficulty: 'EASY', tags: ['business', 'men', 'meeting'] },
      { content: 'The shelves are fully stocked with products.', options: ['The store is closed for renovation.', 'The shelves are empty.', 'The shelves are fully stocked with products.', 'A customer is paying at the register.'], answer: 'C', explanation: 'The picture shows retail shelves filled with merchandise.', difficulty: 'MEDIUM', tags: ['retail', 'shelves', 'store'] },
      { content: 'A waiter is serving food to the guests.', options: ['The restaurant is empty.', 'A chef is cooking in the kitchen.', 'Customers are waiting in line.', 'A waiter is serving food to the guests.'], answer: 'D', explanation: 'The picture shows a waiter bringing food to diners.', difficulty: 'EASY', tags: ['restaurant', 'waiter', 'dining'] },
      { content: 'Construction workers are building a structure.', options: ['Workers are planting trees.', 'The building has been completed.', 'Construction workers are building a structure.', 'The road is being repaired.'], answer: 'C', explanation: 'The picture shows workers at an active construction site.', difficulty: 'MEDIUM', tags: ['construction', 'workers', 'outdoor'] },
      { content: 'A man is presenting to a group of colleagues.', options: ['A man is presenting to a group of colleagues.', 'The room is empty.', 'Two women are looking at a screen.', 'A man is reading documents alone.'], answer: 'A', explanation: 'The picture shows a presenter and an audience in a meeting room.', difficulty: 'EASY', tags: ['meeting', 'presentation', 'office'] },
      { content: 'Boxes are being loaded onto a truck.', options: ['Boxes are being unloaded from a truck.', 'Workers are repairing a vehicle.', 'Boxes are being loaded onto a truck.', 'The warehouse is empty.'], answer: 'C', explanation: 'Workers are placing boxes into a truck for shipment.', difficulty: 'MEDIUM', tags: ['warehouse', 'shipping', 'truck'] },
      { content: 'A woman is speaking on the telephone at her desk.', options: ['A woman is speaking on the telephone at her desk.', 'A woman is using a computer.', 'A man is answering the phone.', 'A woman is leaving the office.'], answer: 'A', explanation: 'The picture shows a woman on a phone call at her desk.', difficulty: 'EASY', tags: ['office', 'phone', 'desk'] },
      { content: 'Passengers are waiting at the airport gate.', options: ['The airport is empty.', 'People are boarding the plane immediately.', 'Passengers are waiting at the airport gate.', 'Passengers are collecting their luggage.'], answer: 'C', explanation: 'The picture shows travelers seated at a departure gate.', difficulty: 'MEDIUM', tags: ['airport', 'travel', 'waiting'] },
      { content: 'A doctor is examining a patient.', options: ['A nurse is preparing medication.', 'A doctor is examining a patient.', 'Two doctors are discussing a case.', 'The patient is leaving the hospital.'], answer: 'B', explanation: 'The picture shows a doctor performing a medical examination.', difficulty: 'EASY', tags: ['medical', 'hospital', 'doctor'] },
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
  }

  // ─── 5. Part 2 Questions (10 questions — Q&A dialogues) ──
  const existingPart2 = await prisma.question.count({ where: { part: 'PART2' } });
  if (existingPart2 === 0) {
    const part2Questions = [
      { content: 'When is the project deadline?', options: ['It\'s due on Friday afternoon.', 'The deadline is very important.', 'I work on projects every day.'], answer: 'A', explanation: 'A "when" question about deadline should be answered with a time/date.', difficulty: 'EASY', tags: ['when', 'work'] },
      { content: 'Could you help me set up the projector for the meeting?', options: ['The meeting is at 10 o\'clock.', 'Sure, I\'ll be right there.', 'I need a new projector.'], answer: 'B', explanation: 'A request for help should be accepted or declined.', difficulty: 'EASY', tags: ['request', 'meeting'] },
      { content: 'Where should I send the invoice?', options: ['Please send it to the accounting department.', 'The invoice was approved yesterday.', 'I\'ll pay the invoice soon.'], answer: 'A', explanation: 'A "where" question needs a location answer.', difficulty: 'EASY', tags: ['where', 'invoice'] },
      { content: 'Who is responsible for the new marketing campaign?', options: ['The campaign starts next week.', 'It\'s a very important campaign.', 'Ms. Johnson is heading the project.'], answer: 'C', explanation: 'A "who" question needs a person or department as the answer.', difficulty: 'EASY', tags: ['who', 'responsibility'] },
      { content: 'Have you reviewed the contract yet?', options: ['Yes, I finished it this morning.', 'The contract is 10 pages long.', 'Contracts are very important.'], answer: 'A', explanation: 'A yes/no question about reviewing should get a yes/no response with detail.', difficulty: 'MEDIUM', tags: ['present-perfect', 'work'] },
      { content: 'Why was the meeting postponed?', options: ['The meeting was quite productive.', 'Because the director is traveling.', 'We meet every Tuesday.'], answer: 'B', explanation: 'A "why" question needs a reason introduced with "because".', difficulty: 'EASY', tags: ['why', 'meeting'] },
      { content: 'How many people attended the training session?', options: ['The training was very helpful.', 'Training usually lasts two hours.', 'About 25 employees participated.'], answer: 'C', explanation: 'A "how many" question needs a number as the answer.', difficulty: 'EASY', tags: ['how-many', 'training'] },
      { content: 'Can I use the conference room tomorrow?', options: ['It\'s already booked until noon.', 'The conference was interesting.', 'Conference rooms are on the third floor.'], answer: 'A', explanation: 'A yes/no request should be answered with availability information.', difficulty: 'MEDIUM', tags: ['can', 'request', 'booking'] },
      { content: 'When will the new software be implemented?', options: ['The software costs $5,000.', 'It\'s scheduled for next Monday.', 'Our IT team is very skilled.'], answer: 'B', explanation: 'A "when" question needs a time answer.', difficulty: 'EASY', tags: ['when', 'technology'] },
      { content: 'Which report did you submit to the manager?', options: ['I submitted the quarterly sales report.', 'Reports are due every Friday.', 'The manager reviewed it carefully.'], answer: 'A', explanation: 'A "which" question about a report needs a specific identification.', difficulty: 'MEDIUM', tags: ['which', 'report'] },
    ];

    for (const q of part2Questions) {
      await prisma.question.create({
        data: {
          part: 'PART2',
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
    console.log(`  ✅ Part 2 questions: ${part2Questions.length}`);
  }

  // ─── 6. Part 6 — Text Completion (2 passages, 4 q each) ──
  const existingPart6 = await prisma.question.count({ where: { part: 'PART6' } });
  if (existingPart6 === 0) {
    const passage1 = `Dear Mr. Thompson,\n\nI am writing to confirm your reservation at the Grand Wilshire Hotel. Your stay is scheduled from March 15 to March 18. We are pleased to offer you a deluxe room on the executive floor, which includes complimentary breakfast and access to our business lounge.\n\nPlease [1] us know if you require any special arrangements. Our concierge team is available 24 hours a day to [2] with any requests. We look forward to [3] you at our hotel.\n\nSincerely,\nMaria Santos\nGuest Relations Manager`;

    const part6Qs = [
      { content: passage1 + '\n\n[1] Choose the correct word:', options: ['let', 'make', 'have', 'do'], answer: 'A', explanation: '"Let us know" is a fixed phrase meaning "inform us".', difficulty: 'EASY', tags: ['part6', 'collocations'] },
      { content: passage1 + '\n\n[2] Choose the correct word:', options: ['assist', 'assists', 'assisting', 'assistance'], answer: 'A', explanation: 'After "to" (infinitive marker), use base form of verb.', difficulty: 'MEDIUM', tags: ['part6', 'verb-form'] },
      { content: passage1 + '\n\n[3] Choose the correct word:', options: ['welcome', 'welcoming', 'welcomed', 'welcomes'], answer: 'B', explanation: '"Look forward to + -ing". After "to" used as a preposition, use gerund.', difficulty: 'MEDIUM', tags: ['part6', 'gerund'] },
      { content: 'Based on the letter, what type of room was reserved?', options: ['A standard room', 'A suite', 'A deluxe room on the executive floor', 'A room with a sea view'], answer: 'C', explanation: 'The letter states "a deluxe room on the executive floor".', difficulty: 'EASY', tags: ['part6', 'reading-comprehension'] },
    ];

    for (const q of part6Qs) {
      await prisma.question.create({
        data: {
          part: 'PART6',
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
    console.log(`  ✅ Part 6 questions: ${part6Qs.length}`);
  }

  // ─── 7. Part 7 — Reading Comprehension ───────────────────
  const existingPart7 = await prisma.question.count({ where: { part: 'PART7' } });
  if (existingPart7 === 0) {
    const article = `NOTICE: Office Renovation\n\nDated: April 1\nTo: All Staff\nFrom: Facilities Management\n\nPlease be advised that the third floor offices will undergo renovation from April 10 to April 20. During this period, all staff currently based on the third floor will be temporarily relocated to the fifth floor, Room 501.\n\nThe renovation will include new flooring, updated lighting, and the installation of additional electrical outlets. The work will be carried out by Kingston Construction and will take place between 8:00 A.M. and 6:00 P.M. on weekdays.\n\nWe apologize for any inconvenience this may cause. If you have any concerns, please contact the Facilities Management office at extension 342.`;

    const part7Qs = [
      { content: article + '\n\nWhat is the purpose of this notice?', options: ['To announce new office policies', 'To inform staff about a renovation', 'To introduce a new construction company', 'To change office working hours'], answer: 'B', explanation: 'The notice is about informing staff of upcoming renovation work.', difficulty: 'EASY', tags: ['part7', 'purpose'] },
      { content: article + '\n\nWhere will third-floor staff be relocated?', options: ['Room 342', 'The basement', 'Room 501 on the fifth floor', 'A nearby building'], answer: 'C', explanation: 'The notice states they will be relocated to "the fifth floor, Room 501".', difficulty: 'EASY', tags: ['part7', 'detail'] },
      { content: article + '\n\nWhat will NOT be included in the renovation?', options: ['New flooring', 'New furniture', 'Updated lighting', 'Additional electrical outlets'], answer: 'B', explanation: 'The notice mentions flooring, lighting, and outlets — but not furniture.', difficulty: 'MEDIUM', tags: ['part7', 'detail', 'not-stated'] },
      { content: article + '\n\nWho should staff contact with concerns?', options: ['Kingston Construction', 'The CEO', 'Facilities Management at ext. 342', 'HR department'], answer: 'C', explanation: 'The notice says "contact the Facilities Management office at extension 342".', difficulty: 'EASY', tags: ['part7', 'contact-info'] },
    ];

    for (const q of part7Qs) {
      await prisma.question.create({
        data: {
          part: 'PART7',
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
    console.log(`  ✅ Part 7 questions: ${part7Qs.length}`);
  }

  // ─── 8. Practice Tests ────────────────────────────────────
  const existingTests = await prisma.test.count();
  if (existingTests === 0) {
    const allQ = await prisma.question.findMany();

    // Mini test 1 — Part 5
    const p5Qs = allQ.filter(q => q.part === 'PART5').slice(0, 20);
    const t1 = await prisma.test.create({
      data: { title: 'Mini Practice Test #1 — Grammar Focus', description: 'Luyện tập Part 5 (Incomplete Sentences) với 20 câu ngữ pháp chọn lọc', duration: 1200, isFullTest: false, totalQuestions: p5Qs.length },
    });
    for (let i = 0; i < p5Qs.length; i++) {
      await prisma.testQuestion.create({ data: { testId: t1.id, questionId: p5Qs[i].id, order: i + 1 } });
    }
    console.log(`  ✅ Test: "${t1.title}" (${p5Qs.length} questions)`);

    // Mini test 2 — Mixed Parts
    const mixedQs = [...allQ.filter(q => q.part === 'PART1').slice(0, 5), ...allQ.filter(q => q.part === 'PART5').slice(0, 10), ...allQ.filter(q => q.part === 'PART7').slice(0, 4)];
    const t2 = await prisma.test.create({
      data: { title: 'Mini Practice Test #2 — Mixed Parts', description: 'Kết hợp Part 1, Part 5 và Part 7 — 19 câu hỏi', duration: 1500, isFullTest: false, totalQuestions: mixedQs.length },
    });
    for (let i = 0; i < mixedQs.length; i++) {
      await prisma.testQuestion.create({ data: { testId: t2.id, questionId: mixedQs[i].id, order: i + 1 } });
    }
    console.log(`  ✅ Test: "${t2.title}" (${mixedQs.length} questions)`);

    // Full test simulation
    const fullQs = allQ.slice(0, 30);
    const t3 = await prisma.test.create({
      data: { title: 'Full Simulation Test #1', description: 'Đề thi thử đầy đủ bao gồm tất cả các parts — 30 câu', duration: 2400, isFullTest: true, totalQuestions: fullQs.length },
    });
    for (let i = 0; i < fullQs.length; i++) {
      await prisma.testQuestion.create({ data: { testId: t3.id, questionId: fullQs[i].id, order: i + 1 } });
    }
    console.log(`  ✅ Test: "${t3.title}" (${fullQs.length} questions)`);
  }

  // ─── 9. Grammar Lessons ───────────────────────────────────
  const existingGrammar = await prisma.grammarLesson.count();
  if (existingGrammar === 0) {
    const grammarLessons = [
      {
        title: 'Present Perfect Tense', titleVi: 'Thì hiện tại hoàn thành', difficulty: 'EASY', order: 1,
        summary: 'Diễn tả hành động đã xảy ra trong quá khứ với kết quả ở hiện tại',
        content: '# Thì Hiện Tại Hoàn Thành\n## Cấu trúc\n- S + have/has + V3/ed\n## Dấu hiệu: since, for, already, yet, just, ever, never\n## TOEIC Tip: Thường xuất hiện trong Part 5, 6 với "since"/"for".',
        examples: JSON.stringify([{ en: 'She has worked here for five years.', vi: 'Cô ấy đã làm việc đây 5 năm.' }, { en: 'I have already submitted the report.', vi: 'Tôi đã nộp báo cáo rồi.' }]),
        exercises: JSON.stringify([{ question: 'She _____ (work) here since 2019.', answer: 'has worked', type: 'fill' }]),
        tags: JSON.stringify(['tenses', 'present-perfect']),
      },
      {
        title: 'Passive Voice', titleVi: 'Câu bị động', difficulty: 'MEDIUM', order: 2,
        summary: 'Dùng khi chủ thể thực hiện hành động không quan trọng hoặc không rõ',
        content: '# Câu Bị Động\n## Cấu trúc: S + be + V3/ed (+ by + O)\n## Các thì bị động:\n- Hiện tại: am/is/are + V3\n- Quá khứ: was/were + V3\n- Tương lai: will be + V3\n- Hoàn thành: have/has been + V3\n## TOEIC Tip: Phổ biến trong Part 5, 6, 7.',
        examples: JSON.stringify([{ en: 'The report was submitted on time.', vi: 'Báo cáo đã được nộp đúng hạn.' }, { en: 'The meeting has been postponed.', vi: 'Cuộc họp đã được hoãn lại.' }]),
        exercises: JSON.stringify([{ question: 'The contract _____ (sign) yesterday.', answer: 'was signed', type: 'fill' }]),
        tags: JSON.stringify(['passive-voice', 'grammar']),
      },
      {
        title: 'Relative Clauses', titleVi: 'Mệnh đề quan hệ', difficulty: 'MEDIUM', order: 3,
        summary: 'Dùng để bổ sung thông tin cho danh từ',
        content: '# Mệnh Đề Quan Hệ\n## Đại từ quan hệ:\n- **who/whom**: người\n- **which**: vật\n- **that**: người hoặc vật\n- **whose**: sở hữu\n- **where**: nơi chốn\n## TOEIC Tip: Thường xuất hiện trong Part 5 và Part 7.',
        examples: JSON.stringify([{ en: 'The employee who works hardest will get a bonus.', vi: 'Nhân viên chăm chỉ nhất sẽ được thưởng.' }]),
        exercises: JSON.stringify([{ question: 'The candidate _____ applied for the job has 5 years of experience.', answer: 'who', type: 'fill' }]),
        tags: JSON.stringify(['relative-clauses', 'grammar']),
      },
      {
        title: 'Conditional Sentences', titleVi: 'Câu điều kiện', difficulty: 'HARD', order: 4,
        summary: 'Diễn tả điều kiện và kết quả trong nhiều tình huống',
        content: '# Câu Điều Kiện\n## Loại 1 (có thể xảy ra): If + S + V(s/es), S + will + V\n## Loại 2 (khó xảy ra): If + S + V(ed), S + would + V\n## Loại 3 (không xảy ra): If + S + had + V3, S + would have + V3\n## TOEIC Tip: Xuất hiện trong Part 5, 6, 7.',
        examples: JSON.stringify([{ en: 'If the order is confirmed, we will ship it today.', vi: 'Nếu đơn hàng được xác nhận, chúng tôi sẽ giao hàng hôm nay.' }]),
        exercises: JSON.stringify([{ question: 'If she _____ harder, she would get the promotion.', answer: 'worked', type: 'fill' }]),
        tags: JSON.stringify(['conditionals', 'grammar']),
      },
      {
        title: 'Prepositions of Time', titleVi: 'Giới từ chỉ thời gian', difficulty: 'EASY', order: 5,
        summary: 'AT, IN, ON và các giới từ thời gian thông dụng trong TOEIC',
        content: '# Giới Từ Chỉ Thời Gian\n## AT: giờ cụ thể (at 9 AM, at noon)\n## IN: tháng, năm, thế kỷ (in March, in 2024)\n## ON: ngày cụ thể (on Monday, on April 5)\n## FOR: khoảng thời gian (for 3 hours)\n## SINCE: mốc thời gian (since 2020)\n## BY: deadline (by Friday)',
        examples: JSON.stringify([{ en: 'The meeting starts at 9 AM on Monday.', vi: 'Cuộc họp bắt đầu lúc 9 giờ sáng thứ Hai.' }, { en: 'Submit the report by Friday.', vi: 'Nộp báo cáo trước thứ Sáu.' }]),
        exercises: JSON.stringify([{ question: 'The conference is _____ Tuesday _____ 3 PM.', answer: 'on / at', type: 'fill' }]),
        tags: JSON.stringify(['prepositions', 'time']),
      },
      {
        title: 'Word Forms', titleVi: 'Dạng từ (Word Forms)', difficulty: 'MEDIUM', order: 6,
        summary: 'Nhận biết và sử dụng đúng danh từ, động từ, tính từ, trạng từ',
        content: '# Dạng Từ Trong TOEIC\n## 4 loại từ chính:\n- **Noun (N)**: productivity, efficiency\n- **Verb (V)**: produce, achieve\n- **Adjective (Adj)**: productive, efficient\n- **Adverb (Adv)**: productively, efficiently\n## TOEIC Tip: Part 5 thường hỏi loại từ nào phù hợp trong câu.',
        examples: JSON.stringify([{ en: 'The company reported significant growth. (Adj + N)', vi: 'Công ty báo cáo tăng trưởng đáng kể.' }, { en: 'Sales increased significantly. (V + Adv)', vi: 'Doanh số tăng đáng kể.' }]),
        exercises: JSON.stringify([{ question: 'The team worked _____ (efficient) to meet the deadline.', answer: 'efficiently', type: 'fill' }]),
        tags: JSON.stringify(['word-forms', 'vocabulary']),
      },
    ];

    for (const lesson of grammarLessons) {
      await prisma.grammarLesson.create({ data: lesson });
    }
    console.log(`  ✅ Grammar lessons: ${grammarLessons.length}`);
  }

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