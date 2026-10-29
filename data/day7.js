COURSE.days.push({
  n: 7, short: 'Chốt hạ: CV, phỏng vấn, chứng chỉ', title: 'Biến kiến thức thành offer: thị trường, CV, phỏng vấn, chứng chỉ và 90 ngày đầu',
  tagline: 'Ôn tập, hoàn thiện portfolio, luyện phỏng vấn và lập kế hoạch sau 7 ngày.',
  hours: '7–8 giờ',
  intro: 'Kiến thức chỉ tạo ra giá trị khi nhà tuyển dụng <b>nhìn thấy</b> nó. Hôm nay bạn đọc hiểu một JD thật, hoàn thiện CV &amp; GitHub portfolio, luyện trả lời phỏng vấn theo mẫu, biết nên thi chứng chỉ nào, và có kế hoạch cho 30–60–90 ngày đầu đi làm.',
  outcomes: [
    'Phân tích một JD helpdesk và biết mình đã đáp ứng bao nhiêu % (và cần lấp khoảng trống nào)',
    'Có CV 1 trang kèm portfolio GitHub với ít nhất 3 dự án có bằng chứng',
    'Trả lời trôi chảy 30+ câu phỏng vấn phổ biến theo khung STAR và “giải quyết sự cố”',
    'Chọn lộ trình chứng chỉ phù hợp (A+, MS-900, Network+, ITIL, AZ-900…)',
    'Có kế hoạch 30/60/90 ngày đầu đi làm và lộ trình lên L2 / sysadmin / cloud / security'
  ],
  plan: ['<b>1h</b> Ôn lại kiến thức (xem lại Quiz sai)', '<b>1.5h</b> Bài 1–2 (thị trường, CV)', '<b>2h</b> Hoàn thiện dự án + GitHub', '<b>2h</b> Luyện phỏng vấn (trang Hỏi đáp)', '<b>1h</b> Quiz tổng hợp + kế hoạch'],
  lessons: [
    {
      id: 'd7-l1', title: 'Thị trường việc làm IT Support fresher & cách đọc JD', min: 40,
      html: `
<h3>Các loại tổ chức tuyển fresher helpdesk</h3>
<table><thead><tr><th>Loại</th><th>Ví dụ</th><th>Đặc điểm</th></tr></thead><tbody>
<tr><td><b>Công ty dịch vụ IT / MSP / outsourcing</b></td><td>FPT IS, CMC, NTT, Tập đoàn công nghệ trong nước, các MSP nhỏ</td><td>Đa dạng khách hàng, học nhanh, có thể onsite tại khách, nhiều ca</td></tr>
<tr><td><b>Doanh nghiệp (in-house IT)</b></td><td>Ngân hàng, bảo hiểm, sản xuất, bán lẻ, bệnh viện, trường học</td><td>Ổn định, hiểu nghiệp vụ, quy trình bảo mật chặt; có thể tăng ca khi sự cố</td></tr>
<tr><td><b>Shared service / BPO / công ty nước ngoài</b></td><td>Các trung tâm dịch vụ toàn cầu, công ty FDI</td><td>Quy trình ITIL, tiếng Anh, có ca đêm theo múi giờ, lương và phúc lợi tốt</td></tr>
<tr><td><b>Nhà mạng/ISP/hãng thiết bị</b></td><td>Viettel, VNPT, hãng laptop/máy in</td><td>Support khách hàng, kỹ thuật thiết bị cụ thể</td></tr>
</tbody></table>
<aside class="note"><p>Mức lương fresher helpdesk tại Việt Nam thay đổi theo thành phố, công ty, tiếng Anh và chứng chỉ; với nhiều tin fresher helpdesk ở khoảng <b>9–12 triệu VND/tháng</b>, phổ biến 10–15 triệu; tin yêu cầu tiếng Anh giao tiếp hoặc ca đêm thường trả <b>16–26 triệu</b>. Con số này dựa trên khảo sát tin đăng tháng 10/2026 trên các trang việc làm, vẫn nên đối chiếu lại khi bạn ứng tuyển.</p></aside>
<h3>Mổ xẻ một JD điển hình</h3>
<pre><code>IT Helpdesk / Service Desk Fresher
- Tiếp nhận & xử lý yêu cầu hỗ trợ qua ticket/điện thoại/email         -> Bài 4-5 Ngày 1
- Cài đặt, cấu hình, bảo trì máy tính, máy in, thiết bị ngoại vi         -> Ngày 1-2, 5
- Hỗ trợ tài khoản Active Directory, Microsoft 365, Outlook, Teams        -> Ngày 4-5
- Xử lý sự cố mạng LAN/Wi-Fi/VPN cơ bản                                  -> Ngày 3
- Lập tài liệu hướng dẫn (KB), báo cáo định kỳ                           -> Ngày 1, 6
Yêu cầu: hiểu Windows, Office, mạng; tiếng Anh đọc hiểu; có chứng chỉ A+/Network+ là lợi thế;
         kỹ năng giao tiếp tốt, chịu áp lực, có thể làm ca/ trực</code></pre>
<p>Bạn đã được học đầy đủ các mục trên. Từ khoá nên có trong CV: <i>Windows 10/11, Active Directory, Group Policy, Microsoft 365, Exchange Online, Entra ID/Azure AD, Intune, DHCP, DNS, TCP/IP, VPN, PowerShell, ticketing (Jira/ServiceNow/GLPI), ITIL, troubleshooting, remote support, KB documentation</i> — nhưng chỉ ghi những gì bạn thật sự làm được.</p>
<h3>Đối chiếu với JD thật (khảo sát tháng 10/2026)</h3>
<p>Đã đọc các tin IT Helpdesk / IT Support trên 123job, VietnamWorks, Techvify, Grant Thornton và danh sách tin trên CareerViet, Vieclam24h. Kết quả so với khoá học:</p>
<table><thead><tr><th>Yêu cầu hay gặp trong JD</th><th>Mức độ</th><th>Khoá học đã phủ?</th></tr></thead><tbody>
<tr><td>Active Directory: tạo, reset, mở khoá tài khoản, quản lý nhóm</td><td>Gần như mọi tin</td><td>Có — Ngày 4</td></tr>
<tr><td>Office 365 / Microsoft 365, Outlook</td><td>Rất phổ biến</td><td>Có — Ngày 5</td></tr>
<tr><td>Windows 10/11, Windows Server</td><td>Phổ biến</td><td>Có — Ngày 2, 4</td></tr>
<tr><td>Mạng LAN/WAN, TCP/IP, Wi-Fi, VPN</td><td>Phổ biến</td><td>Có — Ngày 3</td></tr>
<tr><td>Ticket, SLA, Jira (lợi thế)</td><td>Phổ biến</td><td>Có — Ngày 1, 6; nên có thêm bản lab Jira</td></tr>
<tr><td>Xử lý sự cố phần cứng</td><td>Phổ biến</td><td>Có — Ngày 1</td></tr>
<tr><td><b>Tiếng Anh giao tiếp</b> (gọi điện, chat), một số tin yêu cầu IELTS 6.5</td><td>Hay gặp ở tin lương cao và ca đêm</td><td><b>Còn yếu</b> — chỉ có mẫu câu ở Ngày 1</td></tr>
<tr><td>Linux, Azure/Entra ID, Intune, PowerShell</td><td>Điểm cộng</td><td>Có — Ngày 4, 5, 6</td></tr>
<tr><td>ISO 27001 / ISMS, ITIL</td><td>Điểm cộng</td><td>ITIL có; ISO 27001 mới ở mức khái niệm</td></tr>
<tr><td>Bằng cử nhân CNTT hoặc “tối thiểu 1 năm kinh nghiệm IT support”</td><td>Hay gặp, kể cả tin ghi “fresher”</td><td><b>Không phủ được</b> — cần thực tập, part-time hoặc dự án có bằng chứng</td></tr>
</tbody></table>
<aside class="warn"><p><b>Kết luận từ JD:</b> phần kỹ thuật cốt lõi (AD, M365, Windows, mạng, ticket) khớp với khoá học. Có hai khoảng trống: <b>tiếng Anh giao tiếp</b> và <b>kinh nghiệm thực tế</b>. Nhiều tin ghi “fresher” nhưng vẫn đòi 1 năm kinh nghiệm IT support, nên hãy tìm thực tập hoặc hỗ trợ IT bán thời gian song song với việc nộp CV.</p></aside>
<h3>Làm thế nào để vượt qua “fresher, không kinh nghiệm”?</h3>
<ul>
<li><b>Chứng minh bằng dự án</b> (mục Dự án CV): home lab AD, hệ thống ticket, mạng, script. Coi đây là “kinh nghiệm thực hành”.</li>
<li><b>Thực tập / part-time / tình nguyện:</b> hỗ trợ IT cho trường, CLB, cửa hàng, gia đình; ghi lại như kinh nghiệm.</li>
<li><b>Chứng chỉ</b> vừa phải: A+ hoặc MS-900/AZ-900 chứng tỏ bạn nghiêm túc.</li>
<li><b>Mạng lưới:</b> LinkedIn, nhóm cộng đồng IT, meetup; nhờ giới thiệu (referral) tăng tỉ lệ rất nhiều.</li>
<li><b>Ứng tuyển rộng:</b> Helpdesk, Service Desk, Desktop Support, IT Support, IT Admin Intern, Technical Support, Field Engineer; 20–30 CV chất lượng/tuần.</li>
</ul>
<h3>Kênh tìm việc</h3>
<p>TopCV, ITviec, VietnamWorks, LinkedIn Jobs, CareerViet, trang tuyển dụng của công ty, các group Facebook “Việc làm IT”, bạn bè/anh chị trong ngành. Lọc theo từ khoá: <code>helpdesk</code>, <code>service desk</code>, <code>IT support</code>, <code>desktop support</code>, <code>technical support</code>, <code>IT admin</code>.</p>`
    },
    {
      id: 'd7-l2', title: 'CV, LinkedIn và GitHub portfolio cho IT Support fresher', min: 45,
      html: `
<h3>CV 1 trang — cấu trúc</h3>
<ol class="steps">
<li><b>Tiêu đề &amp; liên hệ:</b> Họ tên · IT Support / Helpdesk Fresher · SĐT · email chuyên nghiệp · LinkedIn · GitHub · khu vực.</li>
<li><b>Tóm tắt 2–3 dòng</b> (đã cá nhân hoá theo JD).</li>
<li><b>Kỹ năng</b> (nhóm theo chủ đề): Hệ điều hành; Mạng; Directory &amp; Cloud; Tool &amp; Ticketing; Scripting; Kỹ năng mềm; Tiếng Anh.</li>
<li><b>Dự án thực hành</b> (đặt <i>trên</i> phần học vấn nếu chưa có kinh nghiệm) — 3 dự án, mỗi dự án 2–3 gạch đầu dòng đo được.</li>
<li><b>Kinh nghiệm</b> (thực tập, part-time, tình nguyện, câu lạc bộ) nếu có.</li>
<li><b>Học vấn &amp; chứng chỉ</b>.</li>
</ol>
<aside class="ex"><h4>Mẫu tóm tắt</h4><p>“IT Support fresher với nền tảng thực hành về Windows, Active Directory, Microsoft 365 và mạng TCP/IP. Đã dựng lab domain 2 máy, xử lý 40+ ticket mô phỏng bằng hệ thống GLPI và viết 6 script PowerShell tự động hoá tác vụ helpdesk. Mong muốn đóng góp vào đội Service Desk, rút ngắn thời gian xử lý sự cố và nâng cao trải nghiệm người dùng.”</p></aside>
<h3>Bullet “mạnh” = Hành động + Công nghệ + Kết quả</h3>
<table><thead><tr><th>Yếu</th><th>Mạnh</th></tr></thead><tbody>
<tr><td>Biết cài Windows</td><td>Cài đặt và cấu hình 10+ máy ảo Windows 10/11; xây dựng quy trình cài đặt chuẩn kèm checklist, rút thời gian cài từ 60 xuống 35 phút</td></tr>
<tr><td>Có kiến thức Active Directory</td><td>Dựng domain <code>corp.local</code> (Windows Server 2022): tạo 6 OU, 25 user qua PowerShell/CSV, 3 GPO (map ổ, chặn USB, wallpaper), phân quyền file server theo nhóm AGDLP</td></tr>
<tr><td>Biết xử lý lỗi mạng</td><td>Chẩn đoán 15 lỗi mạng mô phỏng (DHCP, DNS, gateway, VLAN) trên Cisco Packet Tracer bằng ipconfig/ping/tracert/nslookup; lập bảng triệu chứng-nguyên nhân-cách sửa</td></tr>
<tr><td>Dùng hệ thống ticket</td><td>Triển khai GLPI, xây dựng 20 bài KB và xử lý 40 ticket mô phỏng theo SLA; thiết lập quy tắc phân loại ưu tiên P1–P4</td></tr>
</tbody></table>
<aside class="warn"><p><b>Trung thực.</b> Chỉ ghi những gì bạn làm được và có thể demo/giải thích trong phỏng vấn. Nhà tuyển dụng sẽ hỏi “bạn đã cấu hình GPO như thế nào?” — bạn phải trả lời được từng bước. Số liệu trong dự án lab là số liệu của lab, hãy ghi rõ “home lab / mô phỏng”.</p></aside>
<h3>LinkedIn &amp; GitHub</h3>
<ul>
<li><b>LinkedIn:</b> ảnh chuyên nghiệp, headline “IT Support | Windows • Active Directory • Microsoft 365 • Networking”, mục About 4–5 dòng, thêm Projects (link GitHub), Skills, chứng chỉ. Kết nối với recruiter và kỹ sư IT; theo dõi công ty mục tiêu.</li>
<li><b>GitHub:</b> repo <code>it-support-portfolio</code> với README tổng quan + thư mục từng dự án; ảnh chụp, sơ đồ, script, KB. Không đưa thông tin nhạy cảm.</li>
<li>Gắn link GitHub/LinkedIn trong CV (PDF, không dùng Word nhiều định dạng lỗi). Tên file: <code>NguyenVanAn_ITSupport_CV.pdf</code>.</li>
</ul>
<h3>Thư xin việc ngắn (3 đoạn)</h3>
<p>(1) Vì sao ứng tuyển vị trí/công ty này. (2) 2–3 bằng chứng phù hợp nhất với JD (dự án, chứng chỉ). (3) Mong muốn phỏng vấn + cảm ơn.</p>`
    },
    {
      id: 'd7-l3', title: 'Phỏng vấn: quy trình, khung trả lời và bài thực hành', min: 55,
      html: `
<h3>Quy trình phổ biến</h3>
<ol class="steps">
<li><b>Sàng lọc HR (15–30 phút):</b> giới thiệu, động lực, mức lương, thời gian, tiếng Anh nói cơ bản.</li>
<li><b>Phỏng vấn kỹ thuật (30–60 phút):</b> câu hỏi Windows, mạng, AD, M365, tình huống xử lý sự cố.</li>
<li><b>Bài thực hành / role-play (có thể có):</b> xử lý một ticket giả, trả lời một cuộc gọi, đọc output <code>ipconfig</code>, cấu hình đơn giản.</li>
<li><b>Gặp quản lý (văn hoá, thái độ):</b> câu hỏi hành vi, ca làm việc, kế hoạch phát triển.</li>
</ol>
<h3>Khung trả lời câu hỏi kỹ thuật tình huống</h3>
<p>Dùng mẫu <b>“Hỏi – Khoanh vùng – Kiểm tra – Giải quyết – Ghi chép”</b>:</p>
<aside class="ex"><p><b>Câu hỏi:</b> “User nói không vào được Internet, bạn làm gì?”<br>
<b>Trả lời mẫu:</b> “Trước tiên em hỏi lỗi cụ thể, chỉ máy này hay nhiều người, bắt đầu từ khi nào. Em kiểm tra vật lý (cáp/Wi-Fi), rồi <code>ipconfig</code> xem có IP hợp lệ không (169.254 = lỗi DHCP). Sau đó ping gateway, ping 8.8.8.8, ping tên miền để phân biệt lỗi LAN, lỗi ra ngoài hay lỗi DNS. Tuỳ kết quả em xử lý (renew IP, flush DNS, kiểm tra proxy/VPN) hoặc chuyển cho team mạng nếu nhiều người cùng lỗi. Cuối cùng em xác nhận với user và ghi lại ticket.”</p></aside>
<h3>Khung STAR cho câu hỏi hành vi</h3>
<p><b>S</b>ituation (bối cảnh) → <b>T</b>ask (nhiệm vụ) → <b>A</b>ction (hành động của bạn) → <b>R</b>esult (kết quả, bài học). Chuẩn bị 4 câu chuyện (có thể từ lab, học tập, đi làm thêm):</p>
<ul>
<li>Một lần bạn giải quyết vấn đề kỹ thuật khó (tự gây lỗi trong lab và sửa).</li>
<li>Một lần làm việc với người khó tính / áp lực thời gian.</li>
<li>Một lần bạn tự học thứ mới nhanh.</li>
<li>Một lần bạn mắc sai lầm và rút ra bài học.</li>
</ul>
<h3>Khi không biết đáp án</h3>
<p>Đừng đoán bừa hay im lặng. Nói: “Em chưa gặp trường hợp này. Em sẽ tiếp cận như sau: … (nêu cách tìm hiểu – tra Microsoft Learn, hỏi đồng nghiệp, kiểm tra log). Em sẽ ghi lại để lần sau xử lý nhanh hơn.” Nhà tuyển dụng đánh giá cao <b>tư duy</b> hơn là thuộc lòng.</p>
<h3>Giới thiệu bản thân (60–90 giây)</h3>
<p>Công thức: <i>Tôi là ai</i> → <i>nền tảng/học gì gần đây</i> → <i>bằng chứng thực hành</i> → <i>vì sao muốn vị trí này</i>. Ví dụ tiếng Anh: “I'm An, a fresh graduate passionate about IT support. Over the last few weeks I built a home lab with Windows Server 2022 and Active Directory, handled mock tickets in GLPI and wrote PowerShell scripts to automate common tasks. I enjoy helping people solve problems and I'm eager to grow in a service desk team like yours.”</p>
<h3>Câu hỏi bạn nên hỏi lại</h3>
<ul><li>Một ngày làm việc điển hình của đội helpdesk? Bao nhiêu ticket/ngày?</li><li>Công cụ ticket và remote đang dùng? Có KB không?</li><li>Quy trình onboarding & đào tạo cho người mới? Lộ trình lên L2?</li><li>Ca làm việc/ trực, ngoài giờ như thế nào?</li><li>Đội đánh giá hiệu quả bằng KPI nào (SLA, CSAT)?</li></ul>
<aside class="tip"><p>Luyện tập: mở trang <a href="#/interview">Hỏi đáp phỏng vấn</a>, ghi âm câu trả lời của mình, nghe lại. Làm mock interview với bạn bè. Mặc trang phục gọn gàng, đến sớm 10 phút (hoặc test mic/camera trước nếu phỏng vấn online).</p></aside>`
    },
    {
      id: 'd7-l4', title: 'Chứng chỉ nên thi và lộ trình sau 7 ngày', min: 35,
      html: `
<p>Chứng chỉ không thay thế kinh nghiệm, nhưng với fresher chúng giúp <b>vượt vòng lọc CV</b> và chứng tỏ nền tảng. Đừng sa đà — 1–2 chứng chỉ đúng chỗ là đủ.</p>
<table><thead><tr><th>Chứng chỉ</th><th>Phù hợp</th><th>Ghi chú</th></tr></thead><tbody>
<tr><td><b>CompTIA A+</b> (Core 1 &amp; Core 2)</td><td>Rất phù hợp cho helpdesk/desktop support</td><td>Phần cứng, Windows, mạng cơ bản, bảo mật, quy trình xử lý sự cố; được công nhận toàn cầu. Hai đề thi</td></tr>
<tr><td><b>Google IT Support Professional Certificate</b> (Coursera)</td><td>Nhập môn có cấu trúc</td><td>Khoá học + chứng nhận, giá rẻ, tốt cho người tự học; ít uy tín hơn A+ nhưng vẫn được nhắc</td></tr>
<tr><td><b>Microsoft MS-900</b></td><td>Fundamentals M365</td><td>Dễ, khớp với công ty dùng M365</td></tr>
<tr><td><b>Microsoft MD-102</b> (Endpoint Administrator)</td><td>Intune/Autopilot/endpoint</td><td>Nâng cao hơn, rất giá trị sau 6–12 tháng đi làm</td></tr>
<tr><td><b>Microsoft AZ-900 / SC-900</b></td><td>Cloud / Security fundamentals</td><td>Nhẹ, giúp định hướng cloud/security</td></tr>
<tr><td><b>CompTIA Network+</b></td><td>Mạng sâu hơn</td><td>Bước đệm lên Network Engineer; <b>CCNA</b> nếu muốn chuyên mạng</td></tr>
<tr><td><b>CompTIA Security+</b></td><td>Bảo mật</td><td>Cho hướng SOC/Security</td></tr>
<tr><td><b>ITIL 4 Foundation</b></td><td>Quy trình dịch vụ</td><td>Nhiều công ty yêu cầu hoặc ưu tiên</td></tr>
</tbody></table>
<aside class="note"><p>Mã đề, giá và nội dung kỳ thi thay đổi theo từng phiên bản. Hãy kiểm tra trang chính thức của CompTIA/Microsoft/Axelos (PeopleCert) trước khi đăng ký.</p></aside>
<h3>Gợi ý lộ trình</h3>
<ul>
<li><b>Tuần 2–4:</b> Ôn A+ (hoặc Google IT Support) song song nộp CV. Nếu công ty mục tiêu dùng M365: thêm MS-900.</li>
<li><b>Tháng 2–3:</b> Làm thêm 2 dự án nâng cao (Intune/Autopilot lab, PowerShell automation, Wazuh/Defender), thi chứng chỉ chính.</li>
<li><b>Sau 6–12 tháng đi làm:</b> chọn hướng phát triển:
<ul><li><b>SysAdmin / Endpoint:</b> MD-102, AZ-104, Windows Server nâng cao, PowerShell.</li><li><b>Network:</b> Network+, CCNA.</li><li><b>Cloud:</b> AZ-104/AZ-500 hoặc AWS SAA.</li><li><b>Security:</b> Security+, SC-200, SOC analyst.</li></ul></li>
</ul>`
    },
    {
      id: 'd7-l5', title: '90 ngày đầu đi làm: cách để được giữ lại và thăng tiến', min: 30,
      html: `
<h3>Thói quen của một fresher được đánh giá cao</h3>
<ul>
<li><b>Ghi chép mọi thứ:</b> ticket đầy đủ, KB, sổ tay cá nhân (lệnh hay dùng, quy trình, lỗi đã gặp).</li>
<li><b>Hỏi thông minh:</b> “Em đã thử A, B, kết quả X; em nghĩ nguyên nhân là Y, anh/chị có gợi ý gì không?” thay vì “Lỗi này làm sao?”.</li>
<li><b>Biết khi nào escalate</b> và <b>giữ lời hứa thời gian</b> với user.</li>
<li><b>Chủ động giảm ticket lặp:</b> nhận ra lỗi lặp lại → đề xuất bài KB, script, hướng dẫn tự phục vụ.</li>
<li><b>Bảo mật là thói quen:</b> luôn xác minh, không chia sẻ mật khẩu, báo cáo bất thường.</li>
<li><b>Thái độ phục vụ:</b> lịch sự kể cả khi user bực; không phàn nàn người dùng “ngớ ngẩn”.</li>
</ul>
<h3>Kế hoạch 30 – 60 – 90</h3>
<table><thead><tr><th>Mốc</th><th>Mục tiêu</th></tr></thead><tbody>
<tr><td><b>30 ngày</b></td><td>Nắm công cụ (ticketing, remote, AD, M365 admin), quy trình, 80% ticket loại phổ biến xử lý độc lập; học tên người và hệ thống quan trọng</td></tr>
<tr><td><b>60 ngày</b></td><td>Đạt SLA ổn định; bắt đầu xử lý ticket L2 đơn giản; đóng góp 3–5 bài KB; hỗ trợ onboarding/offboarding đầy đủ</td></tr>
<tr><td><b>90 ngày</b></td><td>Đề xuất cải tiến (script/quy trình); thi chứng chỉ phù hợp; trao đổi với quản lý về lộ trình lên L2/chuyên môn</td></tr>
</tbody></table>
<h3>Những sai lầm kinh điển cần tránh</h3>
<ul>
<li>Thay đổi nhiều thứ cùng lúc rồi không biết cái nào có tác dụng.</li>
<li>Xoá/khôi phục không sao lưu; chạy script lạ trên môi trường thật.</li>
<li>Chia sẻ mật khẩu qua chat; reset không xác minh danh tính.</li>
<li>Đóng ticket khi user chưa xác nhận.</li>
<li>Giấu lỗi của mình — hãy báo sớm, sửa nhanh, học bài học.</li>
</ul>
<aside class="tip"><p>Sau 6–12 tháng, tự hỏi: <i>“Mình thích mảng nào nhất?”</i> (hệ thống, mạng, cloud, bảo mật, tự động hoá). Việc thích và giỏi một mảng sẽ quyết định bước tiếp theo — đây là lý do helpdesk là điểm khởi đầu tuyệt vời.</p></aside>`
    }
  ],
  lab: {
    title: 'Hoàn thiện portfolio, CV và buổi phỏng vấn thử',
    html: `
<ol class="steps">
<li><b>Chọn 3 JD thật</b> (TopCV/ITviec/LinkedIn). Lập bảng: yêu cầu → mình đã có (bằng chứng) → còn thiếu → kế hoạch bù. Tô đậm từ khoá xuất hiện ≥ 2 lần.</li>
<li><b>Hoàn thiện ít nhất 3 dự án</b> trong trang <a href="#/projects">Dự án CV</a> (ưu tiên 1, 2, 3) với README + ảnh chụp. Đẩy lên GitHub.</li>
<li><b>Viết CV 1 trang</b> (PDF) theo mẫu Bài 2, cá nhân hoá cho 1 JD. Nhờ một người bạn/anh chị đọc và góp ý.</li>
<li><b>Cập nhật LinkedIn</b>: headline, About, Projects, Skills.</li>
<li><b>Luyện phỏng vấn:</b> vào trang Hỏi đáp, trả lời thành tiếng 30 câu; ghi âm 5 câu và nghe lại. Chuẩn bị 4 câu chuyện STAR và phần giới thiệu bản thân (tiếng Việt + tiếng Anh).</li>
<li><b>Mock interview</b> 30 phút với bạn bè (hoặc dùng Claude/ChatGPT đóng vai nhà tuyển dụng) — yêu cầu họ hỏi 10 câu kỹ thuật + 3 câu hành vi + 1 tình huống.</li>
<li><b>Làm bài Quiz tổng hợp bên dưới</b> để xác định điểm yếu. Quay lại bài tương ứng để ôn.</li>
<li><b>Kế hoạch 14 ngày tiếp theo:</b> nộp 20–30 CV, ôn A+/MS-900, thêm 2 dự án.</li>
</ol>`
  },
  quiz: [
    { q: 'User báo “internet không vào được”. Ping 127.0.0.1 OK, ping gateway timeout, ipconfig IP hợp lệ. Hướng chẩn đoán hợp lý nhất?', o: ['Lỗi DNS', 'Lỗi LAN: cáp/switch/Wi-Fi/VLAN/gateway; kiểm tra thiết bị và so sánh với máy khác', 'Cài lại Windows', 'Đổi website'], a: 1, e: 'Ping gateway fail dù có IP → vấn đề từ phía LAN/gateway.' },
    { q: 'Khi nhận yêu cầu reset mật khẩu qua điện thoại, hành động ĐÚNG là?', o: ['Reset ngay', 'Xác minh danh tính theo quy trình, đặt mật khẩu tạm bắt đổi, ghi ticket', 'Gửi mật khẩu qua SMS cá nhân', 'Từ chối mọi yêu cầu'], a: 1, e: 'Xác minh danh tính là điều kiện bắt buộc.' },
    { q: 'Dấu hiệu 169.254.x.x trên máy khách cho biết?', o: ['Đang dùng VPN', 'DHCP không cấp được địa chỉ (APIPA)', 'IP public', 'DNS sai'], a: 1, e: 'APIPA = tự cấp khi DHCP thất bại.' },
    { q: 'GPO nào có thể “đánh bại” GPO khác trong trường hợp xung đột (mặc định)?', o: ['GPO được áp dụng sau cùng (OU gần đối tượng nhất)', 'GPO áp đầu tiên', 'Không có quy tắc', 'GPO đặt tên dài nhất'], a: 0, e: 'LSDOU: áp sau thắng (trừ Enforced).' },
    { q: 'Điều nào giải thích đúng nhất vì sao RAID không phải backup?', o: ['RAID chậm', 'RAID chỉ bảo vệ khi hỏng ổ cứng, không bảo vệ khi xoá nhầm, hỏng dữ liệu hay ransomware', 'RAID rẻ', 'RAID chỉ dùng cho Linux'], a: 1, e: 'RAID là dự phòng phần cứng, không phải bản sao dữ liệu độc lập.' },
    { q: 'Bạn nhận 2 ticket cùng lúc: (a) CEO không in được, hội nghị bắt đầu sau 30 phút; (b) nhân viên xin cài phần mềm vẽ, không gấp. Bạn xử lý?', o: ['Làm theo thứ tự đến', 'Ưu tiên theo tác động & khẩn cấp: xử lý (a) trước, thông báo cho (b) thời gian dự kiến', 'Làm (b) trước vì dễ', 'Chuyển cả hai cho đồng nghiệp'], a: 1, e: 'Ưu tiên = impact × urgency, giao tiếp rõ ràng với người đợi.' },
    { q: 'Điểm khác nhau giữa Incident và Problem?', o: ['Không có', 'Incident là khôi phục dịch vụ nhanh; Problem là tìm nguyên nhân gốc của sự cố lặp lại', 'Incident chỉ dành cho phần cứng', 'Problem là do user gây ra'], a: 1, e: 'ITIL: xử lý triệu chứng (incident) vs xử lý nguyên nhân gốc (problem).' },
    { q: 'Lệnh nào hiển thị các GPO đang áp dụng?', o: ['gpupdate', 'gpresult /r', 'ipconfig /all', 'sfc /scannow'], a: 1, e: 'gpresult /r hoặc /h.' },
    { q: 'Khi phát hiện user đã bấm link phishing và nhập mật khẩu, thứ tự ưu tiên hợp lý là?', o: ['Xoá mail → đóng ticket', 'Reset mật khẩu + revoke session + kiểm tra MFA/ sign-in logs/ forwarding rule + báo Security', 'Chờ xem có chuyện gì không', 'Chỉ nhắc nhở user'], a: 1, e: 'Giả định bị chiếm tài khoản, xử lý nhanh và leo thang.' },
    { q: 'Máy cũ không cài/nâng cấp được Windows 11 — nguyên nhân phổ biến nhất?', o: ['Thiếu chuột', 'Không đạt yêu cầu: TPM 2.0 / Secure Boot / CPU hỗ trợ', 'Màn hình nhỏ', 'Thiếu loa'], a: 1, e: 'Windows 11 yêu cầu TPM 2.0, UEFI Secure Boot và CPU trong danh sách hỗ trợ.' },
    { q: 'Ý nghĩa của DORA trong DHCP?', o: ['Discover, Offer, Request, Acknowledge', 'Detect, Open, Reply, Allow', 'Discover, Open, Route, Assign', 'Dynamic, Offer, Renew, Assign'], a: 0, e: 'Quy trình bốn bước cấp IP.' },
    { q: 'Hộp thư dùng chung (shared mailbox) cần license không?', o: ['Luôn cần license riêng', 'Thường không cần license nếu dung lượng ≤ 50GB và không cần các tính năng nâng cao', 'Chỉ cần Windows license', 'Không bao giờ dùng được'], a: 1, e: 'Shared mailbox chuẩn không cần license nếu không vượt giới hạn/không cần Archive.' },
    { q: 'Câu trả lời tốt nhất khi phỏng vấn gặp câu bạn chưa biết?', o: ['Im lặng', 'Nói thẳng chưa gặp, trình bày cách bạn sẽ tìm hiểu và tiếp cận, ghi lại sau khi giải quyết', 'Bịa đáp án', 'Đổi chủ đề'], a: 1, e: 'Trung thực + tư duy giải quyết vấn đề được đánh giá cao.' },
    { q: 'Trước khi cài lại Windows cho máy của user bạn BẮT BUỘC phải?', o: ['Tắt máy', 'Xác nhận và sao lưu dữ liệu, ghi lại phần mềm/ cấu hình cần thiết, có sự đồng ý của user', 'Đổi mật khẩu', 'Gỡ pin CMOS'], a: 1, e: 'Phòng tránh mất dữ liệu — nguyên nhân khiếu nại hàng đầu.' },
    { q: 'KPI nào đo tỷ lệ ticket giải quyết ngay lần liên hệ đầu?', o: ['MTTR', 'FCR', 'CSAT', 'RPO'], a: 1, e: 'First Contact Resolution.' },
    { q: 'Điều gì làm cho một ticket tốt?', o: ['Ngắn nhất có thể', 'Tiêu đề rõ, mô tả triệu chứng/tác động, đã thử gì, kết quả, thời gian, nguyên nhân & cách xử lý', 'Có nhiều emoji', 'Chỉ cần tên người gọi'], a: 1, e: 'Ticket đầy đủ giúp chuyển cấp, thống kê và tái sử dụng kiến thức.' }
  ],
  scenarios: [
    { q: '<b>Tình huống phỏng vấn:</b> “Một nhân viên bực bội gọi nói máy tính của họ chạy rất chậm từ sáng, họ có báo cáo quan trọng. Bạn nói và làm gì?”', o: ['“Máy bạn cũ rồi nên chậm”', 'Đồng cảm, xin lỗi vì bất tiện, đặt kỳ vọng; hỏi nhanh triệu chứng; kết nối từ xa xem Task Manager (CPU/RAM/Disk, startup), xử lý nhanh phần dễ (đóng app, dọn), đề xuất giải pháp lâu dài; cập nhật ticket', 'Hẹn ngày mai', 'Bảo họ tự restart nhiều lần'], a: 1, e: 'Đồng cảm + quy trình + xử lý nhanh phần ưu tiên + đề xuất dài hạn.' },
    { q: '<b>Tình huống phỏng vấn:</b> “Bạn phát hiện đồng nghiệp ghi mật khẩu admin lên giấy dán màn hình. Bạn sẽ làm gì?”', o: ['Làm ngơ', 'Nhắc nhở lịch sự, giải thích rủi ro, đề xuất dùng trình quản lý mật khẩu, và báo quản lý/Security theo chính sách nếu cần', 'Chụp ảnh đăng lên mạng', 'Dùng mật khẩu đó'], a: 1, e: 'Giữ chuẩn bảo mật, giao tiếp tôn trọng và báo cáo đúng kênh.' },
    { q: '<b>Tình huống phỏng vấn:</b> “Nếu bạn mắc sai lầm làm user mất file, bạn sẽ…”', o: ['Giấu đi', 'Báo ngay cho user và quản lý, thử khôi phục (Recycle Bin, Previous Versions, backup), ghi lại sự việc và rút ra biện pháp phòng ngừa', 'Đổ lỗi cho user', 'Cài lại máy'], a: 1, e: 'Trung thực, hành động khắc phục và học hỏi là điều nhà tuyển dụng tìm kiếm.' }
  ]
});
