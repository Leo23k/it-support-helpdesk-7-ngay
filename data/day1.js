COURSE.days.push({
  n: 1, short: 'Nền tảng & Phần cứng', title: 'Nền tảng IT Support, phần cứng và quy trình xử lý sự cố',
  tagline: 'Hiểu nghề, nắm phần cứng, biết cách xử lý sự cố bài bản và viết ticket chuẩn.',
  hours: '6–7 giờ',
  intro: 'Hôm nay bạn xây “bộ khung tư duy” của người làm helpdesk: công việc thực tế là gì, phần cứng máy tính hoạt động ra sao, xử lý sự cố theo quy trình thay vì đoán mò, và cách ghi nhận – giao tiếp với người dùng. Đây là nền cho 6 ngày tiếp theo.',
  outcomes: [
    'Mô tả được công việc L1/L2/L3 và một ngày làm việc điển hình của helpdesk',
    'Nhận diện linh kiện, cổng kết nối, đọc được thông số máy; xử lý 10 lỗi phần cứng phổ biến',
    'Áp dụng quy trình xử lý sự cố 6 bước (CompTIA) cho mọi vấn đề',
    'Phân biệt Incident / Service Request / Problem / Change, hiểu SLA và độ ưu tiên',
    'Viết được ticket và ghi chú giải quyết chuyên nghiệp, giao tiếp đúng mẫu qua điện thoại/chat'
  ],
  plan: ['<b>2h</b> Bài 1–2 (nghề + phần cứng)', '<b>1.5h</b> Bài 3–5 (quy trình, ticket, giao tiếp)', '<b>2h</b> Lab: dựng máy ảo + xem thông tin phần cứng', '<b>30p</b> Quiz + tình huống'],
  lessons: [
    {
      id: 'd1-l1', title: 'IT Support / Helpdesk làm gì? Thị trường & cấp bậc', min: 30,
      html: `
<p><b>IT Support (Helpdesk / Service Desk / Desktop Support)</b> là người đầu tiên mà nhân viên công ty tìm đến khi máy tính, mạng, email, tài khoản hay máy in gặp vấn đề. Công việc cốt lõi: <b>tiếp nhận → chẩn đoán → khắc phục hoặc chuyển cấp → ghi lại → xác nhận người dùng hài lòng</b>.</p>
<aside class="ex"><p>8:55 sáng: chị Lan (kế toán) gọi: “Máy tính em không vào được mạng nội bộ, 9h có báo cáo”. Bạn hỏi nhanh → thấy máy nhận IP 169.254.x.x → thử cắm lại cáp, <code>ipconfig /renew</code> → có mạng lại. Ghi ticket: nguyên nhân (cáp lỏng), cách xử lý, thời gian xử lý 7 phút. Đó là một ca L1 hoàn chỉnh.</p></aside>
<h3>Phân tầng hỗ trợ (tier)</h3>
<table><thead><tr><th>Cấp</th><th>Làm gì</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td><b>L1</b> (Service Desk)</td><td>Tiếp nhận, xử lý lỗi phổ biến theo script/KB, reset mật khẩu, hướng dẫn, ghi ticket. Fresher bắt đầu ở đây.</td><td>Quên mật khẩu, Outlook lỗi, máy in không in, cài phần mềm</td></tr>
<tr><td><b>L2</b> (Desktop/Field/Onsite)</td><td>Lỗi sâu hơn: cài lại máy, AD/GPO cơ bản, mạng văn phòng, tới tận nơi sửa</td><td>Máy mất domain trust, profile hỏng, GPO không áp dụng</td></tr>
<tr><td><b>L3</b> (System/Network/Security)</td><td>Hạ tầng: server, mạng, bảo mật, tự động hoá, xử lý nguyên nhân gốc</td><td>DC lỗi replication, firewall rule, mail flow</td></tr>
</tbody></table>
<h3>Bạn sẽ làm việc ở đâu?</h3>
<ul>
<li><b>Doanh nghiệp (in-house IT):</b> ngân hàng, sản xuất, bán lẻ, bệnh viện… Hỗ trợ 100–5.000 nhân viên.</li>
<li><b>Công ty dịch vụ IT / MSP / outsourcing:</b> hỗ trợ nhiều khách hàng; học nhanh, đa dạng công nghệ, có ca trực.</li>
<li><b>Shared service / BPO của công ty nước ngoài:</b> quy trình ITIL chặt, yêu cầu tiếng Anh, làm ticket theo SLA.</li>
<li><b>Nhà mạng, FPT, Viettel, VNPT, hãng công nghệ:</b> helpdesk hoặc support kỹ thuật cho khách.</li>
</ul>
<h3>Lộ trình nghề nghiệp</h3>
<p>Helpdesk L1 (0–1 năm) → Desktop/L2 Support (1–2 năm) → <b>System Admin</b> / <b>Network Engineer</b> / <b>Cloud (Azure, AWS)</b> / <b>Security (SOC)</b> / <b>Endpoint/Intune Engineer</b>. Helpdesk là cửa vào rẻ nhất của ngành IT.</p>
<aside class="job"><p>Nhà tuyển dụng fresher <b>không</b> kỳ vọng bạn biết hết. Họ kiểm tra 4 thứ: (1) nền tảng Windows + mạng, (2) tư duy xử lý sự cố có hệ thống, (3) giao tiếp/thái độ phục vụ, (4) khả năng tự học (bằng chứng: lab, project, chứng chỉ). Toàn bộ khoá này xây đúng 4 thứ đó.</p></aside>
<h3>Kỹ năng cần có (tóm tắt)</h3>
<ul><li><b>Kỹ thuật:</b> Windows, mạng, AD, M365, phần cứng, ticket, bảo mật cơ bản, PowerShell nhập môn.</li><li><b>Mềm:</b> lắng nghe, đồng cảm, giải thích đơn giản, quản lý thời gian, ghi chép rõ ràng, làm việc dưới áp lực.</li><li><b>Tiếng Anh:</b> đọc hiểu thông báo lỗi, tài liệu Microsoft, viết ticket tiếng Anh ngắn gọn.</li></ul>`
    },
    {
      id: 'd1-l2', title: 'Phần cứng máy tính & laptop — nhận diện và xử lý lỗi', min: 55,
      html: `
<p>Một máy tính là sự phối hợp của: <b>CPU</b> (xử lý) – <b>RAM</b> (bộ nhớ tạm) – <b>Ổ lưu trữ</b> (dữ liệu lâu dài) – <b>Mainboard</b> (kết nối tất cả) – <b>Nguồn PSU</b> (cấp điện) – <b>GPU</b> (đồ hoạ) – <b>Tản nhiệt</b>.</p>
<table><thead><tr><th>Linh kiện</th><th>Cần biết</th><th>Lỗi thường gặp</th></tr></thead><tbody>
<tr><td><b>CPU</b></td><td>Intel Core i3/i5/i7, AMD Ryzen 3/5/7. Nhân (core) / luồng (thread); xung nhịp GHz. Văn phòng: i5/Ryzen 5 là đủ.</td><td>Quá nhiệt → máy chậm, tự tắt (thường do bụi, keo tản nhiệt khô)</td></tr>
<tr><td><b>RAM</b></td><td>DDR4/DDR5; laptop dùng SODIMM (nhỏ). Văn phòng nên ≥ 8GB, tốt nhất 16GB. Cắm 2 thanh = dual channel nhanh hơn.</td><td>Máy treo, BSOD ngẫu nhiên, không lên hình, beep. Thử rút từng thanh; chạy Windows Memory Diagnostic</td></tr>
<tr><td><b>Ổ lưu trữ</b></td><td><b>HDD</b> (đĩa quay, chậm, rẻ) · <b>SSD SATA</b> (2.5”) · <b>SSD NVMe M.2</b> (nhanh nhất). Dùng SSD cho hệ điều hành.</td><td>Máy chậm khủng khiếp, “No boot device”, tiếng click (HDD hỏng). Xem SMART bằng CrystalDiskInfo</td></tr>
<tr><td><b>Mainboard</b></td><td>Có socket CPU, khe RAM, PCIe, SATA, M.2, pin CMOS (CR2032), chip BIOS/UEFI.</td><td>Mất giờ BIOS/ngày giờ sai → thay pin CMOS</td></tr>
<tr><td><b>PSU (nguồn)</b></td><td>Công suất (W), chuẩn 80 Plus. Cấp điện cho mọi linh kiện.</td><td>Bấm nguồn không phản ứng, tự khởi động lại, mùi khét</td></tr>
<tr><td><b>GPU</b></td><td>Card đồ hoạ rời (NVIDIA, AMD) hoặc đồ hoạ tích hợp trong CPU. Máy văn phòng thường dùng tích hợp.</td><td>Màn hình sọc, không tín hiệu, lỗi driver</td></tr>
</tbody></table>
<h3>Cổng kết nối thường gặp</h3>
<table><thead><tr><th>Cổng</th><th>Dùng cho</th><th>Ghi chú</th></tr></thead><tbody>
<tr><td>USB-A / USB-C</td><td>Chuột, bàn phím, ổ USB, sạc, màn hình (Alt mode)</td><td>USB 3.0 thường có màu xanh dương; USB-C không đồng nghĩa nhanh/sạc được, tuỳ chuẩn</td></tr>
<tr><td>HDMI / DisplayPort</td><td>Xuất hình ra màn hình/máy chiếu</td><td>DP hỗ trợ daisy-chain; HDMI phổ biến TV</td></tr>
<tr><td>VGA (D-sub)</td><td>Máy chiếu cũ</td><td>Chỉ tín hiệu hình, không có tiếng</td></tr>
<tr><td>RJ45</td><td>Cáp mạng LAN</td><td>Đèn LED cổng cho biết link/hoạt động</td></tr>
<tr><td>Thunderbolt</td><td>Dock đa năng, ổ ngoài tốc độ cao</td><td>Dùng đầu USB-C, có biểu tượng tia sét</td></tr>
</tbody></table>
<h3>BIOS / UEFI &amp; quá trình khởi động</h3>
<p>Bấm nguồn → <b>POST</b> (Power-On Self Test: kiểm tra CPU/RAM/GPU) → firmware <b>BIOS/UEFI</b> chọn thiết bị boot → bootloader → Windows. Vào BIOS bằng phím <kbd>F2</kbd>/<kbd>Del</kbd>/<kbd>F10</kbd>/<kbd>Esc</kbd> (tuỳ hãng; menu boot thường <kbd>F12</kbd>). Những thứ cần biết: <b>Boot order</b>, <b>Secure Boot</b>, <b>TPM</b> (bắt buộc cho Windows 11), <b>Virtualization (VT-x/SVM)</b> cần bật để chạy máy ảo, chế độ <b>UEFI</b> (ổ GPT) và <b>Legacy</b> (ổ MBR).</p>
<aside class="warn"><p>Trước khi mở máy: rút nguồn, tháo pin laptop (nếu tháo được), chạm vào kim loại để xả tĩnh điện (ESD) hoặc đeo vòng chống tĩnh điện. Không cầm vào chân linh kiện. Chụp ảnh vị trí dây trước khi tháo.</p></aside>
<h3>Bảng chẩn đoán nhanh</h3>
<table><thead><tr><th>Triệu chứng</th><th>Nghi ngờ</th><th>Thử đầu tiên</th></tr></thead><tbody>
<tr><td>Bấm nguồn, không đèn, không quạt</td><td>Nguồn/ổ cắm/dây nguồn, nút nguồn</td><td>Đổi ổ cắm, dây nguồn; laptop thử sạc + giữ nút nguồn 15–30s để xả điện</td></tr>
<tr><td>Quạt quay, màn hình đen</td><td>RAM lỏng, cáp màn hình, GPU</td><td>Rút – cắm lại RAM; thử màn hình/cáp khác; cắm lại card</td></tr>
<tr><td>Beep liên tục khi bật</td><td>RAM/GPU (mã beep tuỳ hãng)</td><td>Tra tài liệu mainboard; cắm lại RAM</td></tr>
<tr><td>“No bootable device / Operating System not found”</td><td>Ổ hỏng, sai boot order, MBR/BCD lỗi</td><td>Vào BIOS xem có nhận ổ không; kiểm tra boot order</td></tr>
<tr><td>Máy rất chậm, ổ đĩa 100% trong Task Manager</td><td>HDD yếu, Windows Update, antivirus quét</td><td>Kiểm tra SMART, nâng cấp SSD</td></tr>
<tr><td>Máy nóng, quạt ồn, tự tắt</td><td>Bụi, keo tản nhiệt khô, quạt hỏng</td><td>Vệ sinh, thay keo, kiểm tra nhiệt độ (HWMonitor)</td></tr>
<tr><td>Laptop không sạc</td><td>Adapter, cổng sạc, pin</td><td>Thử adapter đúng công suất; xem đèn sạc; kiểm tra “Plugged in, not charging”</td></tr>
<tr><td>Chuột/phím/USB không nhận</td><td>Cổng, driver, nguồn USB</td><td>Đổi cổng, đổi thiết bị, Device Manager</td></tr>
<tr><td>Màn hình nhấp nháy, không đúng độ phân giải</td><td>Cáp, driver, tần số quét</td><td>Cắm cáp khác, cập nhật driver</td></tr>
<tr><td>Giờ máy luôn sai sau khi tắt điện</td><td>Pin CMOS yếu</td><td>Thay pin CR2032</td></tr>
</tbody></table>
<aside class="tip"><p>Quy tắc “thay từng thứ một” (known-good swap): có nghi ngờ linh kiện nào, hãy thay bằng linh kiện <i>chắc chắn tốt</i> (dây nguồn, RAM, cáp màn hình…). Đây là cách chẩn đoán phần cứng nhanh và rẻ nhất.</p></aside>`
    },
    {
      id: 'd1-l3', title: 'Phương pháp xử lý sự cố 6 bước', min: 35,
      html: `
<p>Người giỏi không phải người biết nhiều mẹo, mà là người có <b>quy trình</b>. Chuẩn CompTIA A+ (rất được nhà tuyển dụng nhắc tới) gồm 6 bước:</p>
<ol class="steps">
<li><b>Xác định vấn đề (Identify).</b> Hỏi người dùng; tái hiện lỗi; xem thông báo lỗi; hỏi “có gì thay đổi gần đây?”; sao lưu dữ liệu nếu cần trước khi can thiệp.</li>
<li><b>Lập giả thuyết nguyên nhân (Theory).</b> Bắt đầu từ cái đơn giản và hay gặp nhất (cáp, nguồn, mật khẩu, khởi động lại) rồi mới tới phức tạp.</li>
<li><b>Kiểm chứng giả thuyết (Test).</b> Thử xác nhận. Đúng → bước 4. Sai → lập giả thuyết mới hoặc <b>chuyển cấp (escalate)</b>.</li>
<li><b>Lập kế hoạch &amp; thực hiện giải pháp.</b> Cân nhắc tác động (có cần báo người dùng, cần backup, cần thời gian ngừng máy?). Làm đúng quy trình, thay đổi từng bước một.</li>
<li><b>Xác nhận hệ thống hoạt động đầy đủ &amp; phòng ngừa.</b> Nhờ người dùng tự kiểm tra; kiểm tra các chức năng liên quan; áp dụng biện pháp để lỗi không lặp lại.</li>
<li><b>Ghi chép (Document).</b> Nguyên nhân, cách xử lý, thời gian – vào ticket/KB.</li>
</ol>
<h3>10 câu hỏi vàng khi người dùng báo lỗi</h3>
<ul>
<li>Chính xác thì bạn thấy gì? (nhờ chụp màn hình thông báo lỗi)</li>
<li>Lỗi bắt đầu từ khi nào? Có gì thay đổi trước đó (cập nhật, cài phần mềm, đổi mật khẩu, di chuyển chỗ ngồi)?</li>
<li>Chỉ mình bạn bị hay nhiều người cùng bị?</li>
<li>Lỗi xảy ra mọi lúc hay thỉnh thoảng? Làm thế nào để lỗi xuất hiện lại?</li>
<li>Trước đây nó từng hoạt động chưa?</li>
<li>Bạn đã thử gì rồi?</li>
<li>Máy nào, hệ điều hành nào, đang ở văn phòng hay làm từ xa/VPN?</li>
<li>Mức ảnh hưởng công việc (không làm được gì / chỉ khó chịu)?</li>
<li>Có dữ liệu quan trọng chưa lưu không?</li>
<li>Số điện thoại/cách liên lạc tốt nhất?</li>
</ul>
<aside class="ex"><h4>Ví dụ: “Máy không lên nguồn” đi qua 6 bước</h4>
<p><b>1.</b> Hỏi: có đèn không? lần cuối chạy bình thường khi nào? vừa di chuyển máy? → máy bàn, không đèn, hôm qua mất điện.<br>
<b>2.</b> Giả thuyết: ổ cắm/dây nguồn/PSU/ổ chống sét hỏng (đơn giản → phức tạp).<br>
<b>3.</b> Test: cắm ổ khác → vẫn không đèn; đổi dây nguồn khác → máy lên.<br>
<b>4.</b> Thay dây nguồn.<br>
<b>5.</b> Bật máy, đăng nhập, mở ứng dụng; đề xuất cấp ổ chống sét/UPS.<br>
<b>6.</b> Ghi ticket: “Dây nguồn đứt ngầm, đã thay, test OK, đề xuất UPS”.</p></aside>
<h3>Mẹo chẩn đoán</h3>
<ul>
<li><b>Chia để trị (divide &amp; conquer):</b> máy hay mạng? một ứng dụng hay toàn bộ? tài khoản hay thiết bị? (đăng nhập thử bằng máy/tài khoản khác).</li>
<li><b>Khởi động lại</b> không “ngớ ngẩn” — nhiều lỗi tạm thời được xoá, nhưng hãy hỏi/ghi nhận trước để không mất dữ liệu.</li>
<li><b>Chỉ đổi một thứ mỗi lần</b>, ghi lại thứ bạn đã đổi để hoàn tác được.</li>
<li><b>Tìm kiếm có kỹ năng:</b> dán mã lỗi + tên sản phẩm vào Google/Microsoft Learn; ưu tiên tài liệu chính hãng.</li>
<li><b>Biết giới hạn:</b> sau ~15–30 phút không tiến triển (hoặc vượt quyền hạn), hãy escalate kèm đủ thông tin đã thử.</li>
</ul>`
    },
    {
      id: 'd1-l4', title: 'Ticket, ITIL cơ bản, SLA và độ ưu tiên', min: 45,
      html: `
<p>Mọi yêu cầu hỗ trợ đều phải có <b>ticket</b> (phiếu): để không sót việc, đo SLA, tái sử dụng kiến thức, làm bằng chứng khi có tranh chấp. Các công cụ phổ biến: <b>ServiceNow, Jira Service Management, Freshservice, Zendesk, ManageEngine ServiceDesk Plus, GLPI/osTicket</b> (mã nguồn mở – tốt để tự lab).</p>
<h3>4 loại “phiếu” theo ITIL</h3>
<table><thead><tr><th>Loại</th><th>Ý nghĩa</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td><b>Incident</b></td><td>Sự cố làm gián đoạn / giảm chất lượng dịch vụ. Mục tiêu: <b>khôi phục nhanh</b>.</td><td>Máy in không in được; không gửi được email</td></tr>
<tr><td><b>Service Request</b></td><td>Yêu cầu dịch vụ chuẩn, không phải lỗi.</td><td>Tạo tài khoản nhân viên mới; cài phần mềm; xin quyền thư mục</td></tr>
<tr><td><b>Problem</b></td><td>Nguyên nhân gốc của một hay nhiều incident lặp lại. Mục tiêu: <b>xử lý tận gốc</b>.</td><td>20 người cùng mất mạng mỗi chiều → switch lỗi firmware</td></tr>
<tr><td><b>Change</b></td><td>Thay đổi có kiểm soát lên hạ tầng (cần phê duyệt, kế hoạch, rollback).</td><td>Nâng cấp firmware switch, đổi chính sách mật khẩu</td></tr>
</tbody></table>
<h3>Độ ưu tiên = Tác động × Khẩn cấp</h3>
<table><thead><tr><th>Tác động (Impact) ↓ / Khẩn cấp →</th><th>Cao</th><th>Trung bình</th><th>Thấp</th></tr></thead><tbody>
<tr><td><b>Cao</b> (cả công ty / phòng ban)</td><td>P1 Critical</td><td>P2 High</td><td>P3 Medium</td></tr>
<tr><td><b>Trung bình</b> (một nhóm)</td><td>P2 High</td><td>P3 Medium</td><td>P4 Low</td></tr>
<tr><td><b>Thấp</b> (một người)</td><td>P3 Medium</td><td>P4 Low</td><td>P4 Low</td></tr>
</tbody></table>
<aside class="ex"><p>“Cả công ty không vào được email” = impact cao + urgent cao = <b>P1</b>. “Sếp không in được” — impact thấp (1 người) nhưng nếu họp 10 phút nữa, urgent cao → P3 hoặc nâng lên theo chính sách VIP. Hiểu quy tắc nhưng linh hoạt theo chính sách công ty.</p></aside>
<h3>SLA (Service Level Agreement)</h3>
<p>Cam kết thời gian: <b>thời gian phản hồi</b> (response) và <b>thời gian giải quyết</b> (resolution) theo độ ưu tiên. Ví dụ: P1 phản hồi 15 phút/giải quyết 4 giờ; P3 phản hồi 4 giờ/giải quyết 3 ngày làm việc. Ticket sắp “breach” SLA thì phải ưu tiên hoặc báo trưởng nhóm.</p>
<h3>Vòng đời ticket</h3>
<p><code>New</code> → <code>Assigned</code> → <code>In Progress</code> → <code>Pending (chờ user/chờ vendor)</code> → <code>Resolved</code> → <code>Closed</code> (user xác nhận hoặc tự đóng sau X ngày).</p>
<h3>Escalation</h3>
<ul><li><b>Functional (chuyển chuyên môn):</b> chuyển L2/L3/team Network/Security khi vượt khả năng.</li><li><b>Hierarchical (báo cấp trên):</b> khi sắp vi phạm SLA, sự cố nghiêm trọng, khách VIP.</li></ul>
<p>Khi chuyển cấp, luôn kèm: <i>mô tả, tác động, đã thử gì, kết quả, thông tin máy/tài khoản, cách liên lạc</i>. Chuyển mà thiếu thông tin = làm phí thời gian người khác.</p>
<h3>Viết ticket tốt vs dở</h3>
<table><thead><tr><th>Dở</th><th>Tốt</th></tr></thead><tbody>
<tr><td>“Máy lỗi” / “Fix giúp”</td><td><b>Tiêu đề:</b> [Outlook] Không gửi được mail ra ngoài, lỗi 5.7.1 – user nguyen.an</td></tr>
<tr><td>Không nói đã làm gì</td><td><b>Mô tả:</b> Từ 9:10 sáng nay gửi mail tới @gmail.com bị trả lại (NDR 5.7.1). Mail nội bộ bình thường. Chỉ 1 user. Đã thử khởi động lại Outlook.<br><b>Tác động:</b> không gửi hồ sơ cho khách.</td></tr>
</tbody></table>
<h4>Mẫu ghi chú giải quyết (copy dùng luôn)</h4>
<pre><code>[Triệu chứng]  User không in được vào máy in PRN-KT-02 từ sáng nay
[Nguyên nhân]  Hàng đợi in (Print Spooler) bị kẹt do 1 job hỏng
[Đã thực hiện] Dừng dịch vụ Print Spooler, xoá file trong C:\\Windows\\System32\\spool\\PRINTERS, khởi động lại dịch vụ
[Kết quả]      In thử trang test OK, user xác nhận lúc 10:22
[Phòng ngừa]   Đề xuất cập nhật driver; thêm bài KB-0042
[Thời gian]    12 phút</code></pre>`
    },
    {
      id: 'd1-l5', title: 'Giao tiếp & dịch vụ khách hàng (kèm mẫu tiếng Anh)', min: 30,
      html: `
<p>Nhiều fresher giỏi kỹ thuật vẫn rớt vì giao tiếp. Người dùng không cần biết bạn thông minh — họ cần cảm thấy <b>được lắng nghe và được giúp</b>.</p>
<h3>Khung 7 bước cho một cuộc gọi/chat hỗ trợ</h3>
<ol class="steps">
<li><b>Chào &amp; xưng danh:</b> “Dạ IT Helpdesk xin nghe, em là An. Em có thể hỗ trợ gì cho anh/chị ạ?”</li>
<li><b>Xác minh danh tính</b> (bắt buộc khi đụng tới tài khoản): hỏi mã nhân viên, phòng ban, email, quản lý trực tiếp… theo quy trình công ty. <b>Không bao giờ</b> hỏi mật khẩu.</li>
<li><b>Lắng nghe &amp; đồng cảm:</b> “Em hiểu là anh đang gấp họp, em sẽ xử lý ngay.”</li>
<li><b>Làm rõ vấn đề:</b> đặt câu hỏi ngắn, từng câu một, tóm tắt lại để xác nhận.</li>
<li><b>Đặt kỳ vọng:</b> “Việc này khoảng 10 phút, em sẽ điều khiển máy từ xa nếu anh đồng ý.”</li>
<li><b>Xử lý &amp; giải thích bằng ngôn ngữ đời thường:</b> “Bộ nhớ tạm của Outlook bị đầy nên em xoá bớt.”</li>
<li><b>Xác nhận &amp; kết thúc:</b> nhờ user thử, hỏi còn gì khác không, nói rõ ticket số mấy, cách liên hệ lại.</li>
</ol>
<h3>Xử lý người dùng bực bội</h3>
<ul><li><b>Đừng phòng thủ/đối đầu.</b> Họ giận vì sự cố, không giận bạn.</li><li>Nhận trách nhiệm: “Em xin lỗi vì sự bất tiện này. Em sẽ hỗ trợ anh ngay.”</li><li>Tập trung vào <b>việc có thể làm</b> chứ không phải lý do không làm được.</li><li>Không biết thì nói thật: “Em cần kiểm tra thêm, em sẽ phản hồi lại anh trước 3 giờ chiều.” — rồi <b>giữ lời hứa</b>.</li></ul>
<h3>Nên / không nên</h3>
<table><thead><tr><th>Không nên</th><th>Nên</th></tr></thead><tbody>
<tr><td>“Cái này đơn giản mà” / “Anh làm sai rồi”</td><td>“Mình thử thêm bước này nhé”</td></tr>
<tr><td>Dùng thuật ngữ: “DNS cache của anh bị stale”</td><td>“Máy đang nhớ địa chỉ cũ của trang web, em làm mới lại”</td></tr>
<tr><td>Im lặng lâu khi đang xử lý từ xa</td><td>“Em đang kiểm tra phần cài đặt, chờ em khoảng 1 phút”</td></tr>
<tr><td>Hứa “xong ngay” khi chưa chắc</td><td>Hứa thời gian thực tế, báo trước nếu trễ</td></tr>
</tbody></table>
<h3>Mẫu câu tiếng Anh hay dùng</h3>
<table><thead><tr><th>Tình huống</th><th>Câu mẫu</th></tr></thead><tbody>
<tr><td>Chào</td><td>“IT Service Desk, this is An speaking. How can I help you today?”</td></tr>
<tr><td>Xác minh</td><td>“For security, could you confirm your employee ID and manager's name?”</td></tr>
<tr><td>Làm rõ</td><td>“Could you share a screenshot of the error message?” · “When did this start?”</td></tr>
<tr><td>Đặt kỳ vọng</td><td>“It should take about 10 minutes. May I connect to your computer remotely?”</td></tr>
<tr><td>Cập nhật</td><td>“I'm still investigating. I'll update you by 3 PM.”</td></tr>
<tr><td>Kết thúc</td><td>“Is everything working now? Is there anything else I can help with? Your ticket number is INC0012345.”</td></tr>
<tr><td>Escalate</td><td>“I'm going to escalate this to our network team. They'll contact you within 2 hours.”</td></tr>
</tbody></table>
<aside class="warn"><p><b>Bảo mật là luật:</b> không đọc/gửi mật khẩu qua chat/email; reset mật khẩu cho tài khoản cần xác minh danh tính; mật khẩu tạm phải ép đổi ở lần đăng nhập đầu. Kẻ tấn công thường giả làm “sếp đang gấp” để lừa helpdesk (social engineering).</p></aside>`
    }
  ],
  lab: {
    title: 'Dựng máy ảo, đọc thông tin phần cứng, viết ticket mẫu',
    html: `
<p><b>Mục tiêu:</b> có môi trường lab cho cả khoá và luyện nhận diện thông số máy. <b>Thời gian:</b> ~2 giờ. <b>Yêu cầu máy thật:</b> RAM ≥ 8GB (tốt nhất 16GB), trống ≥ 80GB.</p>
<ol class="steps">
<li><b>Cài VirtualBox</b> (miễn phí, virtualbox.org). Vào BIOS/UEFI bật <i>Virtualization (VT-x / AMD-V / SVM)</i> nếu máy ảo không chạy được 64-bit.</li>
<li><b>Tải Windows 11 Enterprise Evaluation</b> (hoặc Windows 10) bản dùng thử 90 ngày từ Microsoft Evaluation Center (file ISO). Tạo VM: 4GB RAM, 2 CPU, 60GB đĩa. Cài Windows, tạo user <code>labadmin</code>.</li>
<li><b>Xem phần cứng ngay trên Windows:</b> chạy <code>msinfo32</code>, <code>dxdiag</code>, Task Manager (Ctrl+Shift+Esc) → tab Performance. Ghi lại: CPU, RAM, loại ổ đĩa, phiên bản Windows, BIOS mode (UEFI).</li>
<li><b>Chạy lệnh thu thập thông tin</b> trong CMD: <pre><code>systeminfo
wmic cpu get name,numberofcores
wmic diskdrive get model,size
hostname</code></pre> (Nếu <code>wmic</code> không có trên Windows 11 mới, dùng PowerShell: <code>Get-CimInstance Win32_Processor | Select Name,NumberOfCores</code>.)</li>
<li><b>Nhận diện linh kiện thật:</b> xem 1 video “how to open desktop PC / replace RAM / replace SSD laptop” và liệt kê tên các linh kiện trong ảnh. Nếu có máy cũ, tự tháo/lắp RAM và ổ đĩa (nhớ quy tắc ESD).</li>
<li><b>Cài hệ thống ticket tự lab (tuỳ chọn, rất đáng làm):</b> cài <i>osTicket</i> hoặc <i>GLPI</i> bằng Docker/XAMPP, hoặc đăng ký bản dùng thử Freshservice/Zendesk. Tạo 5 ticket mẫu từ bảng tình huống dưới đây.</li>
<li><b>Viết 3 ticket mẫu</b> theo mẫu ở Bài 4 (tiêu đề, mô tả, tác động, đã thử, ưu tiên) cho: (a) “Laptop không sạc”, (b) “Cả phòng kế toán mất mạng”, (c) “Yêu cầu cài Zoom cho nhân viên mới”. Xác định loại (Incident/Request) và độ ưu tiên.</li>
</ol>
<p><b>Sản phẩm để lưu:</b> ảnh chụp msinfo32 + Task Manager của VM, file <code>tickets-mau.md</code> với 3 ticket. Đưa vào repo portfolio.</p>`
  },
  quiz: [
    { q: 'Khi bạn sắp can thiệp vào máy người dùng mà dữ liệu quan trọng chưa được lưu, bước nào trong quy trình 6 bước bạn nên làm trước tiên?', o: ['Cài lại Windows ngay', 'Xác định vấn đề và sao lưu dữ liệu nếu cần', 'Ghi chép vào KB', 'Escalate sang L3'], a: 1, e: 'Bước 1 “Identify” bao gồm hỏi han và sao lưu dữ liệu trước khi thay đổi bất kỳ thứ gì.' },
    { q: 'Máy tính bàn bấm nguồn không có đèn, không quạt. Giả thuyết nào nên kiểm tra TRƯỚC?', o: ['CPU hỏng', 'Mainboard hỏng', 'Ổ cắm / dây nguồn / PSU', 'Driver card đồ hoạ'], a: 2, e: 'Luôn kiểm tra thứ đơn giản và phổ biến nhất trước: nguồn điện, dây nguồn, ổ cắm.' },
    { q: '30 nhân viên cùng không truy cập được hệ thống ERP. Đây là loại gì và ưu tiên?', o: ['Service Request, P4', 'Incident, ưu tiên cao (P1/P2)', 'Change, P3', 'Problem, P4'], a: 1, e: 'Là sự cố làm gián đoạn dịch vụ (Incident) và ảnh hưởng nhiều người nên ưu tiên cao.' },
    { q: '“Xin cấp quyền truy cập thư mục chia sẻ cho nhân viên mới” thuộc loại nào?', o: ['Incident', 'Problem', 'Service Request', 'Major incident'], a: 2, e: 'Đây là yêu cầu dịch vụ chuẩn, không phải sự cố.' },
    { q: 'Ổ nào nhanh nhất cho hệ điều hành?', o: ['HDD 7200rpm', 'SSD SATA', 'SSD NVMe M.2', 'USB flash'], a: 2, e: 'NVMe giao tiếp qua PCIe nên nhanh hơn SATA nhiều lần; HDD chậm nhất.' },
    { q: 'Windows 11 yêu cầu tính năng bảo mật phần cứng nào trên mainboard?', o: ['VGA', 'TPM 2.0', 'PS/2', 'Parallel port'], a: 1, e: 'Windows 11 yêu cầu TPM 2.0 và UEFI Secure Boot (các máy không đáp ứng cần bật trong BIOS hoặc không được hỗ trợ chính thức).' },
    { q: 'Điều nào sau đây là hành động ĐÚNG khi người dùng gọi nhờ reset mật khẩu?', o: ['Reset ngay vì họ nghe rất gấp', 'Xác minh danh tính theo quy trình rồi mới reset, đặt mật khẩu tạm bắt buộc đổi', 'Hỏi mật khẩu cũ để chắc chắn', 'Gửi mật khẩu mới qua chat nhóm'], a: 1, e: 'Xác minh danh tính chống social engineering; mật khẩu tạm phải bắt đổi khi đăng nhập.' },
    { q: 'Bạn đã thử 3 cách nhưng chưa xử lý được, đã quá 30 phút. Việc nên làm là?', o: ['Tiếp tục thử ngẫu nhiên', 'Đóng ticket vì “không tái hiện được”', 'Escalate kèm đầy đủ thông tin đã thử', 'Bảo user tự xử lý'], a: 2, e: 'Biết giới hạn và chuyển cấp đúng cách (kèm thông tin) là kỹ năng được đánh giá cao.' },
    { q: 'Máy luôn hiển thị sai ngày giờ sau khi rút điện. Nguyên nhân khả dĩ nhất?', o: ['Windows bị virus', 'RAM hỏng', 'Pin CMOS (CR2032) yếu', 'Card mạng hỏng'], a: 2, e: 'Pin CMOS giữ giờ/cấu hình BIOS khi mất điện.' }
  ],
  scenarios: [
    { q: '<b>Tình huống:</b> Giám đốc gọi: “Máy chiếu phòng họp không lên hình, 10 phút nữa họp với đối tác!” Bạn làm gì đầu tiên?', o: ['Nói “để em đăng ký ticket, xử lý trong 4 giờ”', 'Trấn an, đến ngay phòng họp, kiểm tra cáp HDMI/nguồn máy chiếu/nguồn tín hiệu (Win+P), chuẩn bị phương án dự phòng (màn hình TV, chia sẻ qua Teams)', 'Bảo giám đốc tự kiểm tra cáp', 'Reinstall driver card đồ hoạ'], a: 1, e: 'Impact + urgent cao: hành động nhanh, kiểm tra điểm lỗi đơn giản (cáp, nguồn tín hiệu, Win+P) và luôn có phương án dự phòng. Ticket được tạo song song.' },
    { q: '<b>Tình huống:</b> Một người tự xưng là CEO nhắn tin: “Reset mật khẩu email cho tôi và gửi vào Zalo này, tôi đang đi công tác, gấp!” Bạn làm gì?', o: ['Reset ngay và gửi', 'Từ chối lịch sự, yêu cầu xác minh qua kênh chính thức (gọi lại số đã đăng ký, theo quy trình), báo bộ phận bảo mật nếu nghi ngờ', 'Gửi mật khẩu cũ cho họ', 'Bỏ qua tin nhắn'], a: 1, e: 'Đây là mẫu social engineering/BEC kinh điển. Luôn xác minh qua kênh độc lập và theo quy trình, không có ngoại lệ vì “sếp”.' },
    { q: '<b>Tình huống:</b> Đã là lần thứ 4 trong tuần, các máy ở phòng Sales cứ chiều chiều lại mất mạng 5 phút. Bạn nên làm gì ngoài việc xử lý từng lần?', o: ['Tiếp tục đóng ticket từng lần', 'Tạo/đề xuất Problem record để tìm nguyên nhân gốc, gom các incident liên quan, báo đội mạng', 'Bảo người dùng chịu khó', 'Thay tất cả máy tính phòng Sales'], a: 1, e: 'Incident lặp lại → Problem management: tìm nguyên nhân gốc thay vì chữa triệu chứng.' }
  ]
});
